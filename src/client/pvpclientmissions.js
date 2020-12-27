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
}

const MISSION_TYPES_VEHICLE_CAPTURE = 0;
const MISSION_TYPES_VEHICLE_DELIVER = 1;
const MISSION_TYPES_OBJECT_CAPTURE = 2;
const MISSION_TYPES_OBJECT_DELIVER = 3;

onNet("entered_mission_q", async () => {
    console.log(`entered q`);
});

onNet("delete_vehicle", async (vehicleNetId) => {
    const ent = NetworkGetEntityFromNetworkId(vehicleNetId);
    if(DoesEntityExist(ent)) DeleteVehicle(ent);
    SetCurrentPedWeapon(GetPlayerPed(-1), "WEAPON_BRIEFCASE");
});

onNet("unlock_vehicle", async (team, vehicleNetId) => {
    const ent = NetworkGetEntityFromNetworkId(vehicleNetId);
    SetVehicleDoorsLocked(ent, 1);
    SetVehicleDoorsLockedForTeam(ent, 1, true);
    SetVehicleDoorsLockedForTeam(ent, 2, true);
    SetVehicleDoorsLockedForTeam(ent, team, false);
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
    if(onMission && missionData.currentStage != currentStage) {
        emit("cancel_action");
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

onNet("mission_start_carjack", () => {
    startCarJacking();
});
onNet("mission_refresh_blips", async () => {
    console.log("refresh blips");
    refreshBlips();
});

async function refreshBlips() {
    let active_blips = missionData.activeBlips;
    console.log("remove bleeeps");
    for(var i = 0; i < active_blips.length; i++) {
        console.log("remove bleeepsxx");
        RemoveBlip(active_blips[i]);
    }
    active_blips = [];
    let blips = missionData.stage.blips;
    let areaBlip = null;
    let missionObjectiveBlip = null;
    for(const prop in blips) {
        const currentBlip = blips[prop];
        console.log("boop");
        console.log(currentBlip.type);
        console.log(currentBlip);
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
    return missionData.myTeam == missionData.stage.attacker_team;
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

async function isActionKeyPressed() {
    return IsControlPressed(0, 23);
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
    switch(missionData.stage.type) {
        case MISSION_TYPES_VEHICLE_DELIVER:
            if(isAttacking()) {
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
        case MISSION_TYPES_OBJECT_CAPTURE:
            if(isAttacking()) {
                const ped = GetPlayerPed(-1);
                const coords = GetEntityCoords(ped);
                const dist = GetDistanceBetweenCoords(missionData.stage.missionObjective.pos.x, missionData.stage.missionObjective.pos.y, missionData.stage.missionObjective.pos.z, coords[0], coords[1], coords[2]);
                if(dist < 0.5) {
                    if(!jacking) {
                        const action_key_pressed = await isActionKeyPressed();
                        if(action_key_pressed) {
                            jacking = true;
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
                    jacking = false;
                    ClearAllHelpMessages();
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

async function startCarJacking() {
    const plr = GetPlayerPed(-1);
    
    ClearPedTasksImmediately(plr)
    
    await loadAnimDict( "veh@break_in@0h@p_m_one@" )
    TaskPlayAnim( plr, "veh@break_in@0h@p_m_one@", "low_locked_ps", 8.0, 1.0, missionData.stage.missionObjective.captureTime + 10000, 1, 0, 0, 0, 0 )
    jacking = true;
}