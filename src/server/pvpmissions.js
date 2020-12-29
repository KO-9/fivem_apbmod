Delay = (ms) => new Promise(res => setTimeout(res, ms));

var capture_update_rate = 100;
var mm_queue = [];
var team_size = 1;
var debug_start_with_one = 1;

var game_groups = [

];
//blip colours
const BLIP_COLOUR_GREEN = 2;
const BLIP_COLOUR_LYELLOW = 16;

const MISSION_TYPES_VEHICLE_CAPTURE = exports.test.MISSION_TYPES_VEHICLE_CAPTURE();
const MISSION_TYPES_VEHICLE_DELIVER = exports.test.MISSION_TYPES_VEHICLE_DELIVER();
const MISSION_TYPES_OBJECT_CAPTURE = exports.test.MISSION_TYPES_OBJECT_CAPTURE();
const MISSION_TYPES_OBJECT_DELIVER = exports.test.MISSION_TYPES_OBJECT_DELIVER();
const MISSION_TYPES_AREA_CAPTURE = exports.test.MISSION_TYPES_AREA_CAPTURE();
//const MISSION_TYPES_CAPTURE_SPRAY = 1;
//const MISSION_TYPES_BREAK = 2;

var missions = [
    {
        stages:[
            {
                respawnPoints: [
                    [
                        {x: -1837.1103515625, y: 468.28338623047, z: 129.05754089355, h: 327.11499023438},
                        {x: -1835.8028564453, y: 533.63433837891, z: 146.80891418457, h: 3.8103404045105},
                    ],
                    [
                        {x: -1769.5615234375, y: 477.29711914062, z: 134.21438598633, h: 359.84979248047},
                        {x: -1872.3438720703, y: 403.28103637695, z: 106.99066162109, h: 237.04147338867}
                    ]
                ],
                objectiveMessage: ["Defend the car","Recover the car"],
                blips: {
                    area: {type: "radius", x: -1796.1593017578, y: 488.03793334961, z: 133.85330200195, radius: 30, colour: BLIP_COLOUR_LYELLOW},
                    missionObjective: {type: "entity", netId: null, colour: BLIP_COLOUR_GREEN},
                },
                type: MISSION_TYPES_VEHICLE_CAPTURE,
                missionObjective:{
                    model:"adder",
                    //x: -1726.1903076172, y: 476.79293823242, z: 126.067527771, h: 36.94909286499
                    pos: {x: -1726.1903076172, y: 476.79293823242, z: 126.067527771, h: 36.94909286499},
                    //pos: {x: -1796.1593017578, y: 488.03793334961, z: 133.85330200195, h: 83.679985046387},
                    //captureTime: 45*1000,
                    captureTime: 10*1000,
                    progress: 0,
                    captured: false,
                    entity_handle: null,
                    netId: null,
                    attacker_team: 2,
                    marker: null,
                }
            },
            {
                respawnPoints: [
                    [
                        {x: -1837.1103515625, y: 468.28338623047, z: 129.05754089355, h: 327.11499023438},
                        {x: -1835.8028564453, y: 533.63433837891, z: 146.80891418457, h: 3.8103404045105},
                    ],
                    [
                        {x: -1769.5615234375, y: 477.29711914062, z: 134.21438598633, h: 359.84979248047},
                        {x: -1872.3438720703, y: 403.28103637695, z: 106.99066162109, h: 237.04147338867}
                    ]
                ],
                objectiveMessage: ["Prevent the drop off","Drop off the car"],
                blips: {
                    area: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 30, colour: BLIP_COLOUR_LYELLOW},
                    missionObjective: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 5, colour: BLIP_COLOUR_GREEN},
                },
                type: MISSION_TYPES_VEHICLE_DELIVER,
                missionObjective:{
                    model:"adder",
                    pos: {x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, h: 297.45794677734},//Delivery area
                    //02/*dir*/, 0, 0, 0/*rot*/, 0, 0, 5/*scale*/, 5,5,0.8, 255,255,255, 200, 0, 0, 2, 0, 0, 0, 0
                    marker: {type: 27, x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375 + 0.3, dirX: 2, dirY: 0, dirZ: 0, rotX: 0, rotY: 0, rotZ: 0, scaleX: 5, scaleY: 5, scaleZ: 5, red: 0, green: 8, blue: 255, alpha: 255, bobUpAndDown: true, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false},
                    captureTime: 10*1000,
                    progress: 0,
                    captured: false,
                    entity_handle: null,
                    netId: null,
                    attacker_team: 2,
                }
            },
            {
                respawnPoints: [
                    [
                        {x: -1837.1103515625, y: 468.28338623047, z: 129.05754089355, h: 327.11499023438},
                        {x: -1835.8028564453, y: 533.63433837891, z: 146.80891418457, h: 3.8103404045105},
                    ],
                    [
                        {x: -1769.5615234375, y: 477.29711914062, z: 134.21438598633, h: 359.84979248047},
                        {x: -1872.3438720703, y: 403.28103637695, z: 106.99066162109, h: 237.04147338867}
                    ]
                ],
                objectiveMessage: ["Break into the base","Defend the base"],
                blips: {
                    area: {type: "radius", x: -1778.3726806641, y: 465.91171264648, z: 129.04014587402, h: 106.81718444824, radius: 30, colour: BLIP_COLOUR_LYELLOW},
                    missionObjective: {type: "radius", x: -1778.3726806641, y: 465.91171264648, z: 129.04014587402, h: 106.81718444824, radius: 5, colour: BLIP_COLOUR_GREEN},
                },
                type: MISSION_TYPES_OBJECT_CAPTURE,
                missionObjective:{
                    model:"adder",
                    pos: {x: -1778.3726806641, y: 465.91171264648, z: 129.04014587402, h: 106.81718444824},
                    //captureTime: 45*1000,
                    marker: {type: 27, x: -1778.3726806641, y: 465.91171264648, z: 129.04014587402 - 0.5, dirX: 0, dirY: 0, dirZ: 0, rotX: 0, rotY: 0, rotZ: 0, scaleX: 1, scaleY: 1, scaleZ: 1, red: 0, green: 8, blue: 255, alpha: 255, bobUpAndDown: true, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false},
                    captureTime: 4.5*1000,
                    progress: 0,
                    captured: false,
                    entity_handle: null,
                    netId: null,
                    objectModel: "prop_ld_case_01",
                    attacker_team: 2,//1 normally
                }
            },
            {
                respawnPoints: [
                    [
                        {x: -1837.1103515625, y: 468.28338623047, z: 129.05754089355, h: 327.11499023438},
                        {x: -1835.8028564453, y: 533.63433837891, z: 146.80891418457, h: 3.8103404045105},
                    ],
                    [
                        {x: -1769.5615234375, y: 477.29711914062, z: 134.21438598633, h: 359.84979248047},
                        {x: -1872.3438720703, y: 403.28103637695, z: 106.99066162109, h: 237.04147338867}
                    ]
                ],
                objectiveMessage: ["Drop off the bag", "Prevent the drop off"],
                blips: {
                    area: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 30, colour: BLIP_COLOUR_LYELLOW},
                    missionObjective: {type: "entity", netId: null, colour: BLIP_COLOUR_LYELLOW},
                },
                type: MISSION_TYPES_OBJECT_DELIVER,
                missionObjective:{
                    model:"adder",
                    pos: {x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, h: 297.45794677734},//Delivery area
                    marker: {type: 27, x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375 + 0.3, dirX: 2, dirY: 0, dirZ: 0, rotX: 0, rotY: 0, rotZ: 0, scaleX: 5, scaleY: 5, scaleZ: 5, red: 0, green: 8, blue: 255, alpha: 255, bobUpAndDown: true, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false},
                    captureTime: 10*1000,
                    progress: 0,
                    captured: false,
                    entity_handle: null,
                    netId: null,
                    objectHolder: null,
                    attacker_team: 2,//Should be 1
                }
            },
            {
                respawnPoints: [
                    [
                        {x: -1837.1103515625, y: 468.28338623047, z: 129.05754089355, h: 327.11499023438},
                        {x: -1835.8028564453, y: 533.63433837891, z: 146.80891418457, h: 3.8103404045105},
                    ],
                    [
                        {x: -1769.5615234375, y: 477.29711914062, z: 134.21438598633, h: 359.84979248047},
                        {x: -1872.3438720703, y: 403.28103637695, z: 106.99066162109, h: 237.04147338867}
                    ]
                ],
                objectiveMessage: ["Capture and hold area to win","Capture and hold area to win"],
                blips: {
                    area: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 30, colour: BLIP_COLOUR_LYELLOW},
                    missionObjective: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 5, colour: BLIP_COLOUR_GREEN},
                },
                type: MISSION_TYPES_AREA_CAPTURE,
                missionObjective:{
                    model:"adder",
                    pos: {x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, h: 297.45794677734},//Delivery area
                    //02/*dir*/, 0, 0, 0/*rot*/, 0, 0, 5/*scale*/, 5,5,0.8, 255,255,255, 200, 0, 0, 2, 0, 0, 0, 0
                    marker: {type: 27, x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375 + 0.3, dirX: 2, dirY: 0, dirZ: 0, rotX: 0, rotY: 0, rotZ: 0, scaleX: 5, scaleY: 5, scaleZ: 5, red: 0, green: 8, blue: 255, alpha: 255, bobUpAndDown: true, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false},
                    captureTime: 10*1000,
                    progress: 0,
                    captured: false,
                    entity_handle: null,
                    netId: null,
                    attacker_team: 2,
                }
            },
        ]
    },
    {
        stages:[
            {
                respawnPoints: [
                    [
                        {x: -1837.1103515625, y: 468.28338623047, z: 129.05754089355, h: 327.11499023438},
                        {x: -1835.8028564453, y: 533.63433837891, z: 146.80891418457, h: 3.8103404045105},
                    ],
                    [
                        {x: -1769.5615234375, y: 477.29711914062, z: 134.21438598633, h: 359.84979248047},
                        {x: -1872.3438720703, y: 403.28103637695, z: 106.99066162109, h: 237.04147338867}
                    ]
                ],
                objectiveMessage: ["Capture and hold area to win","Capture and hold area to win"],
                blips: {
                    area: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 30, colour: BLIP_COLOUR_LYELLOW},
                    missionObjective: {type: "radius", x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, radius: 5, colour: BLIP_COLOUR_GREEN},
                },
                type: MISSION_TYPES_AREA_CAPTURE,
                missionObjective:{
                    model:"adder",
                    pos: {x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375, h: 297.45794677734},//Delivery area
                    //02/*dir*/, 0, 0, 0/*rot*/, 0, 0, 5/*scale*/, 5,5,0.8, 255,255,255, 200, 0, 0, 2, 0, 0, 0, 0
                    marker: {type: 27, x: -1677.8245849609, y: 489.72100830078, z: 128.43896484375 + 0.3, dirX: 2, dirY: 0, dirZ: 0, rotX: 0, rotY: 0, rotZ: 0, scaleX: 5, scaleY: 5, scaleZ: 5, red: 0, green: 8, blue: 255, alpha: 255, bobUpAndDown: true, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false},
                    captureTime: 10*1000,
                    progress: 0,
                    captured: false,
                    entity_handle: null,
                    netId: null,
                    attacker_team: 2,
                }
            },
        ]
    },
];

var max_buckets = 63;
var routing_buckets = [];//0-63
for(var i = 0; i < max_buckets + 1; i++) {
    let available = true;
    if(i == 0) available = false;
    routing_buckets[i] = {id: i, available: available};
}

RegisterCommand('w0', async (source, args, raw) => {
    console.log(`route: ${GetPlayerRoutingBucket(source)}`);
    if(args.length == 1) {
        SetPlayerRoutingBucket(source, parseInt(args));
        console.log(`route: ${GetPlayerRoutingBucket(source)}`);
    }
});

RegisterCommand('q', async (source, args, raw) => {
    //console.log("queue req");
    if(!mm_queue.includes(source)) {
        let group = await getGroupFromPlayerIdx(source);
        if(group !== false) {
            return;
        }
        mm_queue.push(source);
        emitNet("entered_mission_q", source);
        if(debug_start_with_one || mm_queue.length >= (team_size * 2)) {
            createGameGroups();
        }
    }
});

async function createGameGroups() {
    var game_group = {
        players: [],
        stage: -1,
        winner: null,
        team_points: [0, 0],
    };
    var required_players = 1;
    if(!debug_start_with_one) {
        required_players = team_size * 2;
    }

    //find an available bucket
    var routing_bucket = null;
    for(var i = 1; i < 63; i++) {
        routing_bucket = routing_buckets[i];
        if(routing_bucket.available) {
            break;
        }
    }
    if(routing_bucket == null) {
        //handle error
        console.log("error");
        return;
    }
    routing_bucket.available = false;
    game_group.bucket = routing_bucket;
    //Get players from start of queue
    var new_players = mm_queue.splice(0, required_players);
    //Put players into the same routing bucket
    for(var i = 0; i < new_players.length; i++) {
        var plr = {};
        plr.index = new_players[i];
        var team = 1;
        if( (i+1) / new_players.length > 0.5) {
            team = 2;
        }
        plr.team = team;
        game_group.players.push(plr);
        console.log(`route: ${GetPlayerRoutingBucket(plr.index)} - bucket ${game_group.bucket.id}`);
        SetPlayerRoutingBucket(plr.index, game_group.bucket.id);
        console.log(`route: ${GetPlayerRoutingBucket(plr.index)}`);
    }
    //Todo, add more + make random
    game_group.mission = JSON.parse(JSON.stringify(missions[0]));
    //console.log(game_group.mission);
    //game_group.stage += 2;
    let game_group_id = game_groups.push(game_group);
    game_group_id--;
    //Spawn things
    sendPlayerDate(game_group);
    setupNextStage(game_group);
    sendStartMission(game_group);
    //GetPlayerFromServerId
}

async function sendStartMission(game_group) {
    for(var i = 0; i < game_group.players.length; i++) {
        var plr_id = game_group.players[i].index;
        emitNet("mission_start", plr_id);
    }
}

async function sendPlayerDate(game_group) {
    for(var i = 0; i < game_group.players.length; i++) {
        var plr_id = game_group.players[i].index;
        emitNet("mission_team_data", plr_id, game_group.players);
    }
}

async function endMission(game_group) {
    for(var i = 0; i < game_group.players.length; i++) {
        var plr_id = game_group.players[i].index;
        SetPlayerRoutingBucket(plr_id, 0);
        emitNet("mission_ended", plr_id);
    }
    game_groups.splice(game_groups.indexOf(game_group), 1);
}

async function setupNextStage(game_group) {
    if(game_group.mission.stages.length == game_group.stage + 1) {
        console.log("game ended");
        endMission(game_group);
        return;
    }
    game_group.stage++;
    var stage = game_group.mission.stages[game_group.stage];
    var mission_state = null;
    console.log("begin-setup-state");
    switch(stage.type) {
        case MISSION_TYPES_VEHICLE_CAPTURE:
            const hash = GetHashKey(stage.missionObjective.model);
            //Won't spawn if nobody is in range...
            //Need to handle when a player is within X distance of entity and if entity has not spawned or does not exist...
            //Must also handle respawnig of veh
            //Death of player with object
            const vehicle = CreateVehicle(hash, stage.missionObjective.pos.x, stage.missionObjective.pos.y, stage.missionObjective.pos.z, stage.missionObjective.pos.h, true, true);
            while(!DoesEntityExist(vehicle)) {
                await Delay(50);
            }
            stage.blips.missionObjective.netId = NetworkGetNetworkIdFromEntity(vehicle);
            stage.missionObjective.netId = stage.blips.missionObjective.netId;
            SetVehicleNumberPlateText(vehicle, "anna cute");
            SetVehicleDoorsLocked(vehicle, 2);
            //SetEntityAsMissionEntity(vehicle, true, true);
            SetEntityRoutingBucket(vehicle, game_group.bucket.id);
            stage.missionObjective.entity_handle = vehicle;
            break;
        case MISSION_TYPES_VEHICLE_DELIVER:
            stage.missionObjective.entity_handle = game_group.mission.stages[game_group.stage - 1].missionObjective.entity_handle;
            stage.missionObjective.netId = game_group.mission.stages[game_group.stage - 1].missionObjective.netId;
            //refreshBlips(game_group);
            break;
        case MISSION_TYPES_OBJECT_DELIVER:
            stage.missionObjective.netId = game_group.mission.stages[game_group.stage - 1].missionObjective.netId;
            stage.blips.missionObjective.netId = stage.missionObjective.netId;
            break;
    }
    console.log("end-setup-state");
    updateMissionStage(game_group);
    refreshBlips(game_group);
}

async function updateMissionStage(game_group) {
    for(var i = 0; i < game_group.players.length; i++) {
        var plr_id = game_group.players[i].index;
        emitNet("mission_state", plr_id, game_group.mission.stages[game_group.stage], game_group.stage, game_group.mission.stages.length);
    }
}

async function refreshBlips(game_group) {
    for(var i = 0; i < game_group.players.length; i++) {
        var plr_id = game_group.players[i].index;
        emitNet("mission_refresh_blips", plr_id);
    }
}

onNet("pickup_object", async function(netId) {
    const game_group = await getGroupFromPlayerIdx(source);
    if(!game_group) return;
    game_group.mission.stages[game_group.stage].missionObjective.objectHolder = source;
    updateMissionStage(game_group);
});

onNet("drop_object", async function(netId) {
    const game_group = await getGroupFromPlayerIdx(source);
    if(!game_group) return;
    game_group.mission.stages[game_group.stage].missionObjective.objectHolder = null;
    updateMissionStage(game_group);
});

onNet("created_obj_net_id", async function(netId) {
    const game_group = await getGroupFromPlayerIdx(source);
    if(!game_group) return;
    game_group.mission.stages[game_group.stage].missionObjective.netId = netId;
    game_group.mission.stages[game_group.stage].missionObjective.objectHolder = source;
    setupNextStage(game_group);
});



onNet("baseevents:enteringVehicle", async function(vehHandle, seat, model, netId) {
    const entity_id = NetworkGetEntityFromNetworkId(netId);
    const game_group = await getGroupFromPlayerIdx(source);
    if(!game_group) return;
    if(game_group.mission.stages[game_group.stage].type == MISSION_TYPES_VEHICLE_CAPTURE && entity_id == game_group.mission.stages[game_group.stage].missionObjective.entity_handle && game_group.mission.stages[game_group.stage].missionObjective.progress < game_group.mission.stages[game_group.stage].missionObjective.captureTime) {
        startCarJacking(source);
    }
});

onNet("capturing", async function(stage) {
    const game_group = await getGroupFromPlayerIdx(source);
    if(!game_group || game_group.mission.stages[stage].missionObjective.captured) {
        emitNet("cancel_action", source);
        console.log(game_group);
        return;
    }
    game_group.mission.stages[stage].missionObjective.progress += capture_update_rate;
    if(!game_group.mission.stages[stage].missionObjective.captured && game_group.mission.stages[stage].missionObjective.progress >= game_group.mission.stages[stage].missionObjective.captureTime) {
        //Captured
        await handleStageCaptured(game_group, source);
    }
    updateMissionStage(game_group);
});

async function handleStageCaptured(game_group, source) {
    let stage = game_group.mission.stages[game_group.stage];
    let player = await findPlayerFromGroup(game_group, source);
    game_group.team_points[player.team - 1]++;
    console.log("score:"+game_group.team_points[player.team - 1]);
    switch(stage.type) {                                
        case MISSION_TYPES_VEHICLE_CAPTURE:
            stage.missionObjective.captured = true;
            emitNet("cancel_action", source);
            await unlockVehicleForTeam(game_group, stage.missionObjective.attacker_team);
            setupNextStage(game_group);
            break;
        case MISSION_TYPES_VEHICLE_DELIVER:
            stage.missionObjective.captured = true;
            //DeleteVehicle(stage.missionObjective.entity_handle);
            await deleteVehicleForGroup(game_group, stage.missionObjective.netId);
            setupNextStage(game_group);
            break;
        case MISSION_TYPES_OBJECT_CAPTURE:
            stage.missionObjective.captured = true;
            emitNet("create_object", source, stage.missionObjective.objectModel);
            emitNet("cancel_action", source);
            break;
        case MISSION_TYPES_OBJECT_DELIVER:
            stage.missionObjective.captured = true;
            emitNet("delete_object", source, stage.missionObjective.netId);
            setupNextStage(game_group);
            break;
        case MISSION_TYPES_AREA_CAPTURE:
            stage.missionObjective.captured = true;
            setupNextStage(game_group);
            break;
    }
}

async function deleteVehicleForGroup(game_group, vehicleNetId) {
    for(var x = 0; x < game_group.players.length; x++) {
        emitNet("delete_vehicle", game_group.players[x].index, vehicleNetId);
    }
}

async function unlockVehicleForTeam(game_group, team) {
    const vehicleNetId = NetworkGetNetworkIdFromEntity(game_group.mission.stages[game_group.stage].missionObjective.entity_handle);
    SetVehicleDoorsLocked(game_group.mission.stages[game_group.stage].missionObjective.entity_handle, 1);
    for(var x = 0; x < game_group.players.length; x++) {
        emitNet("unlock_vehicle", game_group.players[x].index, team, vehicleNetId);
    }
}

async function findPlayerFromGroup(game_group, playerIdx) {
    for(var x = 0; x < game_group.players.length; x++) {
        if(game_group.players[x].index == playerIdx) {
            return game_group.players[x];
        }
    }
}

async function getGroupFromPlayerIdx(playerIdx) {
    for(var i = 0; i < game_groups.length; i++) {
        var game_group = game_groups[i];
        for(var x = 0; x < game_group.players.length; x++) {
            if(game_group.players[x].index == playerIdx) {
                return game_group;
            }
        }
    }
    return false;
}

async function startCarJacking(source) {
    emitNet("mission_start_carjack", source);
}