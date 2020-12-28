Delay = (ms) => new Promise(res => setTimeout(res, ms));

var onMission = false;
var jacking = false;
var missionData = {
    stage: null,
    stages: 0,
    missionText: null,
    teamId: null,
    currentStage: 0,
    myTeam: null,
    activeBlips: [],
    holdingItem: false,
}

const MISSION_TYPES_VEHICLE_CAPTURE = exports.test.MISSION_TYPES_VEHICLE_CAPTURE();
const MISSION_TYPES_VEHICLE_DELIVER = exports.test.MISSION_TYPES_VEHICLE_DELIVER();
const MISSION_TYPES_OBJECT_CAPTURE = exports.test.MISSION_TYPES_OBJECT_CAPTURE();
const MISSION_TYPES_OBJECT_DELIVER = exports.test.MISSION_TYPES_OBJECT_DELIVER();
const MISSION_TYPES_AREA_CAPTURE = exports.test.MISSION_TYPES_AREA_CAPTURE();

RegisterCommand('t1', async (source, args, raw) => {
    createMissionObject("prop_ld_case_01", null);
});


async function createMissionObject(objectModel, pos) {
    const hash = GetHashKey(objectModel);
    RequestModel(hash)
    while(!HasModelLoaded(hash)) {
        await Delay(50);
    }
    //local bagspawned = CreateObject(GetHashKey(bagModel), plyCoords.x, plyCoords.y, plyCoords.z, 1, 1, 1)
    if(pos == null) {
        pos = {};
        const ped = GetPlayerPed(-1);
        const coords = GetEntityCoords(ped);
        pos.x = coords[0];
        pos.y = coords[1];
        pos.z = coords[2];
    }
    let object = CreateObject(hash, pos.x, pos.y, pos.z, true, true, false);
    let netId = NetworkGetNetworkIdFromEntity(object);
    //        AttachEntityToEntity(bagspawned, GetPlayerPed(PlayerId()), GetPedBoneIndex(GetPlayerPed(PlayerId()), 57005), 0.15, 0, 0, 0, 270.0, 60.0, true, true, false, true, 1, true)
    //AttachEntityToEntity(object, GetPlayerPed(PlayerId()), GetPedBoneIndex(GetPlayerPed(PlayerId()), 57005), 0.15, 0, 0, 0, 270.0, 60.0, true, true, false, true, 1, true)
    if(typeof ped == "undefined") {
        var ped = GetPlayerPed(-1);
    }
    let xPos = 0.15, yPos = 0, zPos = 0, xRot = 0, yRot = 0, zRot = 0, p9 = true, useSoftPinning = false, collision = false, isPed = true, vertexIndex = 1, fixedRot = true;
    AttachEntityToEntity(object, ped, GetPedBoneIndex(ped, 57005), xPos, yPos, zPos, xRot, yRot, zRot, p9, useSoftPinning, collision, isPed, vertexIndex, fixedRot);
    missionData.holdingItem = true;
    emitNet("created_obj_net_id", netId);
}

onNet("entered_mission_q", async () => {
    console.log(`entered q`);
});

onNet("create_object", async (objectModel) => {
    createMissionObject(objectModel, null);
});

onNet("delete_vehicle", async (vehicleNetId) => {
    const ent = NetworkGetEntityFromNetworkId(vehicleNetId);
    if(DoesEntityExist(ent)) DeleteVehicle(ent);
    SetCurrentPedWeapon(GetPlayerPed(-1), "WEAPON_BRIEFCASE");
});

onNet("unlock_vehicle", async (team, vehicleNetId) => {
    const ent = NetworkGetEntityFromNetworkId(vehicleNetId);
    console.log("unlock_for:"+ team);
    console.log("my_team:"+missionData.myTeam);
    let ped = GetPlayerPed(-1);
    if(team != missionData.myTeam) {
        SetVehicleDoorsLockedForTeam(ent, missionData.myTeam, true);
    }
    //SetVehicleDoorsLockedForAllPlayers(ent, true);
    //SetVehicleDoorsLockedForPlayer(GetPlayerPed(-1), false)
    //SetVehicleDoorsLockedForPlayer(ped, false);
    
    
    //SetVehicleDoorsLocked(ent, 1);
    //SetVehicleDoorsLockedForTeam(ent, 1, true);
    //SetVehicleDoorsLockedForTeam(ent, 2, true);
    /*
    SetVehicleDoorsLockedForTeam(ent, team, false);
    if(team == 1) {
        console.log("doors locked for team: 2")
        SetVehicleDoorsLockedForTeam(ent, 2, false);
    } else {
        console.log("doors locked for team: 1")
        SetVehicleDoorsLockedForTeam(ent, 1, false);
    }*/

   //SetVehicleDoorsLockedForPlayer(GetPlayerPed(-1), false);
});

onNet("cancel_action", async () => {
    console.log("cancelling action");
    const ped = GetPlayerPed(-1);
    jacking = false;
    ClearPedTasksImmediately(ped);
});

onNet("mission_team_data", async (players) => {
    missionData.players = players;
    console.log("print_players");
    console.log(players);
    for(var i = 0; i < players.length; i++) {
        const plr = GetPlayerFromServerId(players[i].index);
        if(plr == PlayerId()) {
            missionData.myTeam = players[i].team;
        }
        SetPlayerTeam(plr, players[i].team);
    }
});

onNet("mission_state", async (stageData, currentStage, totalStages) => {
    console.log("getstate");
    if(onMission && missionData.currentStage != currentStage) {
        ClearAllHelpMessages();
    }
    missionData.stage = stageData;
    missionData.currentStage = currentStage;
    missionData.stages = totalStages;
    if(!onMission) {
        console.log("enb_mission");
        onMission = true;
    }
    //console.log(`arg1: ${missionData.stage.missionObjective.progress} - arg2: ${currentStage}`);
});

onNet("delete_object", async (netId) => {
    const ent = NetworkGetEntityFromNetworkId(netId);
    if(DoesEntityExist(ent)) {
        missionData.holdingItem = false;
        jacking = false;
        DeleteEntity(ent);
    }
});

onNet("mission_start_carjack", () => {
    startCarJacking();
});
onNet("mission_refresh_blips", async () => {
    console.log("refresh blips");
    refreshBlips();
});

async function refreshBlips() {
    let active_blips = missionData.activeBlips;
    //console.log("remove bleeeps");
    for(var i = 0; i < active_blips.length; i++) {
        //console.log("remove bleeepsxx");
        RemoveBlip(active_blips[i]);
    }
    active_blips = [];
    let blips = missionData.stage.blips;
    let areaBlip = null;
    let missionObjectiveBlip = null;
    for(const prop in blips) {
        const currentBlip = blips[prop];
        //console.log("boop");
        //console.log(currentBlip.type);
        //console.log(currentBlip);
        let newBlip = null;
        switch(currentBlip.type) {
            case "radius":
            newBlip = AddBlipForRadius(currentBlip.x, currentBlip.y, currentBlip.z, currentBlip.radius);
            SetBlipRotation(newBlip, 0);
            SetBlipColour(newBlip, currentBlip.colour);//Green
            SetBlipDisplay(newBlip, 4);//Always show on main map
            if(currentBlip == missionData.stage.blips.missionObjective) SetBlipRoute(newBlip, true);
            missionData.activeBlips.push(newBlip);
            break;
        case "entity":
            //break;
            console.log("her2");
            const ent = NetworkGetEntityFromNetworkId(blips.missionObjective.netId);
            newBlip = AddBlipForEntity(ent);
            SetBlipDisplay(newBlip, 6);//Always show on mini-map and main map
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentString("Recover vehicle")
            EndTextCommandSetBlipName(newBlip)
            SetBlipColour(newBlip, 2);//Green
            if(currentBlip == missionData.stage.blips.missionObjective) SetBlipRoute(newBlip, true);
            missionData.activeBlips.push(newBlip);
            //setBlipAsFriendly(missionObjectiveBlip, true);
            //if(missionData.myTeam == missionData.stage.attacker_team) setBlipAsFriendly(missionObjectiveBlip, true);
            break;
        }
    }

}
async function isAttacking() {
    return missionData.myTeam == missionData.stage.missionObjective.attacker_team;
}

async function isPressingMoveKey() {
    if(IsControlPressed(0, 30)) {
        return true;
    }
    if(IsControlPressed(0, 31))
        return true;
    if(IsControlPressed(0, 32))
        return true;
    if(IsControlPressed(0, 33))
        return true;
    if(IsControlPressed(0, 34))
        return true;
    if(IsControlPressed(0, 35))
        return true;
    return false;
}

async function isPressingCancelKey() {
    return IsControlPressed(0, 73);//Default X
}

async function isActionKeyPressed() {
    return IsControlPressed(0, 23);//Default F
}

setTick(async() => {
    await Delay(100);
    if(jacking) {
        emitNet("capturing", missionData.currentStage);
    }
    if(onMission) {
        checkMissionConditions();
    }
});

async function checkMissionConditions() {
    const is_attacking = await isAttacking();
    switch(missionData.stage.type) {
        case MISSION_TYPES_AREA_CAPTURE://Stand in area to capture
            const ped = GetPlayerPed(-1);
            const coords = GetEntityCoords(ped);
            const dist = GetDistanceBetweenCoords(missionData.stage.missionObjective.pos.x, missionData.stage.missionObjective.pos.y, missionData.stage.missionObjective.pos.z, coords[0], coords[1], coords[2]);
            if(dist < 3.0) {
                emitNet("capturing", missionData.currentStage);
            }
            break;
        case MISSION_TYPES_VEHICLE_DELIVER://Drive vehicle to drop off
            if(is_attacking) {
                const ent = NetworkGetEntityFromNetworkId(missionData.stage.missionObjective.netId);
                const ped = GetPlayerPed(-1);
                if(IsPedInVehicle(ped, ent, true)) {
                    const coords = GetEntityCoords(ped);
                    const dist = GetDistanceBetweenCoords(missionData.stage.missionObjective.pos.x, missionData.stage.missionObjective.pos.y, missionData.stage.missionObjective.pos.z, coords[0], coords[1], coords[2]);
                    if(dist < 3.0) {
                        emitNet("capturing", missionData.currentStage);
                    }
                }
            }
            break;
        case MISSION_TYPES_OBJECT_CAPTURE://Break in to capture object
            if(is_attacking) {
                const ped = GetPlayerPed(-1);
                const coords = GetEntityCoords(ped);
                //Check distance from player to mission object
                const dist = GetDistanceBetweenCoords(missionData.stage.missionObjective.pos.x, missionData.stage.missionObjective.pos.y, missionData.stage.missionObjective.pos.z, coords[0], coords[1], coords[2]);
                if(dist < 0.5) {
                    if(!jacking) {
                        const action_key_pressed = await isActionKeyPressed();
                        if(action_key_pressed) {
                            jacking = true;
                            startWindowJacking();
                            ClearAllHelpMessages();
                        } else {
                            BeginTextCommandDisplayHelp("STRING")
                            AddTextComponentSubstringPlayerName("Press action key (F) to capture")
                            EndTextCommandDisplayHelp(0, true, true, 0)
                        }
                    }
                    if(jacking) {
                        emitNet("capturing", missionData.currentStage);
                    }
                    //emitNet("capturing", missionData.currentStage);
                } else {
                    if(jacking) {
                        jacking = false;
                        const plr = GetPlayerPed(-1);
                        ClearPedTasksImmediately(plr)
                    }
                    ClearAllHelpMessages();
                }
            }
            break;
        case MISSION_TYPES_OBJECT_DELIVER://Deliver item to drop off
            if(is_attacking) {
                if(missionData.holdingItem) {//Holding mission item
                    const pressingCancel = await isPressingCancelKey();
                    if(pressingCancel) {
                        const ent = NetworkGetEntityFromNetworkId(missionData.stage.missionObjective.netId);
                        if(DoesEntityExist(ent)) {
                            console.log("Drop pressed");
                            DetachEntity(ent);//missionData.stage.missionObjective.netId
                            missionData.holdingItem = false;
                            emitNet("drop_object", missionData.stage.missionObjective.netId);
                        }
                    } else {
                        //Check if inside drop off
                        const ped = GetPlayerPed(-1);
                        const coords_plr = GetEntityCoords(ped);
                        const dist = GetDistanceBetweenCoords(missionData.stage.missionObjective.pos.x, missionData.stage.missionObjective.pos.y, missionData.stage.missionObjective.pos.z, coords_plr[0], coords_plr[1], coords_plr[2]);
                        if(dist < 3.0) {
                            emitNet("capturing", missionData.currentStage);
                        }
                    }
                }
                if(!missionData.holdingItem && missionData.stage.missionObjective.objectHolder == null) {//Don't use else as setting false above
                    const ent = NetworkGetEntityFromNetworkId(missionData.stage.missionObjective.netId);
                    if(DoesEntityExist(ent)) {
                        const ped = GetPlayerPed(-1);
                        const coords_plr = GetEntityCoords(ped);
                        const coords_ent = GetEntityCoords(ent);
                        const dist = GetDistanceBetweenCoords(coords_plr[0], coords_plr[1], coords_plr[2], coords_ent[0], coords_ent[1], coords_ent[2]);
                        if(dist < 1.0) {
                            const action_key_pressed = await isActionKeyPressed();
                            if(action_key_pressed) {
                                let xPos = 0.15, yPos = 0, zPos = 0, xRot = 0, yRot = 0, zRot = 0, p9 = true, useSoftPinning = false, collision = false, isPed = true, vertexIndex = 1, fixedRot = true;
                                AttachEntityToEntity(ent, ped, GetPedBoneIndex(ped, 57005), xPos, yPos, zPos, xRot, yRot, zRot, p9, useSoftPinning, collision, isPed, vertexIndex, fixedRot);
                                ClearAllHelpMessages();
                                missionData.holdingItem = true;
                                emitNet("pickup_object", missionData.stage.missionObjective.netId);
                            } else {
                                BeginTextCommandDisplayHelp("STRING")
                                AddTextComponentSubstringPlayerName("Press action key (F) to pickup")
                                EndTextCommandDisplayHelp(0, true, true, 0)
                            }
                        } else {
                            ClearAllHelpMessages();
                        }
                    }
                }
            }
    }
}

setTick(async() => {
    if (jacking) {
        const moving = await isPressingMoveKey();
        if(moving) {
            console.log("move pressed");
            const plr = GetPlayerPed(-1);
            jacking = false;
            ClearPedTasksImmediately(plr)
        }
    }
    if(onMission) {
        drawHud();
        drawMarkers();
    }
});

async function drawMarkers() {
    if(missionData.stage.missionObjective.marker != null) {
        let m = missionData.stage.missionObjective.marker;
        DrawMarker(m.type, 
            m.x, 
            m.y, 
            m.z, 
            m.dirY, 
            m.dirX, 
            m.dirZ,
            m.rotX,
            m.rotY,
            m.rotZ,
            m.scaleX,
            m.scaleY,
            m.scaleZ, 
            m.red, 
            m.green, 
            m.blue, 
            m.alpha, 
            m.bobUpAndDown, 
            m.faceCamera, 
            m.p19, 
            m.rotate, 
            m.textureDict, 
            m.textureName, 
            m.drawOnEnts);
    }
    
}

async function drawHud() {
    SetTextFont(0);
    SetTextScale(0.475, 0.475);
    SetTextColour(0, 0, 0, 255);
    SetTextEntry("STRING");
    let progress = 0;
    if(missionData.stage.missionObjective.progress != 0) {
        progress = Math.round(missionData.stage.missionObjective.progress / missionData.stage.missionObjective.captureTime * 100)
    }
    if(progress > 100) progress = 100;
    let text = `Stage: ${missionData.currentStage  + 1}/${missionData.stages} | ${missionData.stage.objectiveMessage[missionData.myTeam - 1]} | Progress ${progress}%`;
    //let text ="boop";
    AddTextComponentString(text);
    DrawText(0.17, 0.9355);
    DrawRect(0.0001, 0.955, 2.0, 0.05, 255, 242, 64, 255);
}

RegisterCommand('mis', async (source, args, raw) => {
    const moving = await isPressingMoveKey();
    console.log(moving);
    SetEntityCoords(GetPlayerPed(-1), -1767.7573242188, 478.74697875977, 131.8067779541);
});

async function loadAnimDict(dict) {
    while(!HasAnimDictLoaded(dict)) {
        RequestAnimDict(dict);
        await Delay(50);
    }
}

async function startWindowJacking() {
    const plr = GetPlayerPed(-1);
    
    ClearPedTasksImmediately(plr)
    
    await loadAnimDict( "veh@break_in@0h@p_m_one@" )
    TaskPlayAnim( plr, "veh@break_in@0h@p_m_one@", "low_locked_ps", 8.0, 1.0, missionData.stage.missionObjective.captureTime + 10000, 1, 0, 0, 0, 0 )
}

async function startCarJacking() {
    if(missionData.myTeam == missionData.stage.missionObjective.attacker_team) {
        const plr = GetPlayerPed(-1);
    
        ClearPedTasksImmediately(plr)
        
        await loadAnimDict( "veh@break_in@0h@p_m_one@" )
        TaskPlayAnim( plr, "veh@break_in@0h@p_m_one@", "low_locked_ps", 8.0, 1.0, missionData.stage.missionObjective.captureTime + 10000, 1, 0, 0, 0, 0 )
        jacking = true;
    }
}