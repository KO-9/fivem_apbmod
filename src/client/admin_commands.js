Delay = (ms) => new Promise(res => setTimeout(res, ms));

RegisterCommand('res', async (source, args, raw) => {
    const ped = PlayerPedId();
    SetEntityHealth(ped, 0)
    await Delay(100);
    const coords = GetEntityCoords(ped);
    SetEntityCoords(GetPlayerPed(-1), coords[0], coords[1] + 2, coords[2]);
    //ResurrectPed(ped); -- Doesn't work on local player?
    NetworkResurrectLocalPlayer(coords[0], coords[1] + 2, coords[2], GetEntityHeading(ped), true, false);
});

RegisterCommand('go', async (source, args, raw) => {
    SetEntityCoords(GetPlayerPed(-1), 646.36920166,
    600.17944335,
    128.91094970);
});


RegisterCommand('gun', async (source, args, raw) => {
  GiveWeaponToPed(GetPlayerPed(-1), "WEAPON_COMPACTLAUNCHER", 30, false, true);
});


RegisterCommand('car', async (source, args, raw) => {
    // account for the argument not being passed
    let model = "adder";
    if (args.length > 0)
    {
      model = args[0].toString();
    }
  
    // check if the model actually exists
    const hash = GetHashKey(model);
    if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash))
    {
      emit('chat:addMessage', {
        args: [`It might have been a good thing that you tried to spawn a ${model}. Who even wants their spawning to actually ^*succeed?`]
      });
      return;   
    }
  
    // Request the model and wait until the game has loaded it
    RequestModel(hash);
    while (!HasModelLoaded(hash))
    {
      await Delay(500);
    }
  
    const ped = PlayerPedId();
  
    // Get the coordinates of the player's Ped (their character)
    const coords = GetEntityCoords(ped);
  
    // Create a vehicle at the player's position
    const vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
  
    // Set the player into the drivers seat of the vehicle
    SetPedIntoVehicle(ped, vehicle, -1);
  
    // Allow the game engine to clean up the vehicle and model if needed
    SetEntityAsNoLongerNeeded(vehicle);
    SetModelAsNoLongerNeeded(model);
  
    // Tell the player the car spawned
    emit('chat:addMessage', {
      args: [`Woohoo! Enjoy your new ^*${model}!`]
    });
  }, false);