const { colshapeSize, soundRange, cooldownMs, allowedWeapons, smallWeaponGroups } = require("./json/config");
const metalDetectors = require("./json/detectors");
const weaponData = require("./json/weaponData");

const allowedWeaponHashes = allowedWeapons.map(weapon => mp.joaat(weapon));

// Load metal detectors
for (const detector of metalDetectors) {
    const { x, y, z, heading, dimension = 0, createProp = true } = detector;
    const position = new mp.Vector3(x, y, z);

    if (createProp) {
        mp.objects.new("ch_prop_ch_metal_detector_01a", position, {
            rotation: new mp.Vector3(0.0, 0.0, heading),
            dimension: dimension
        });
    }

    const colshape = mp.colshapes.newSphere(x, y, z, colshapeSize, dimension);
    colshape.isMetalDetector = true;
    colshape.metalDetectorPos = position;
    colshape.metalDetectorLastTriggered = 0;
}

console.log(`Loaded ${metalDetectors.length} metal detector(s).`);

// RAGEMP Events
mp.events.add("playerEnterColshape", (player, colshape) => {
    const now = Date.now();

    if (colshape.isMetalDetector && now - colshape.metalDetectorLastTriggered >= cooldownMs && !allowedWeaponHashes.includes(player.weapon)) {
        const isSmallWeapon = weaponData.hasOwnProperty(player.weapon) ? smallWeaponGroups.includes(weaponData[player.weapon].Group) : false;
        colshape.metalDetectorLastTriggered = now;

        mp.events.call("playerTriggerMetalDetector", player, colshape.metalDetectorPos, isSmallWeapon);
        mp.players.callInRange(colshape.metalDetectorPos, soundRange, colshape.dimension, "playMetalDetectorAlarm", [ colshape.metalDetectorPos, isSmallWeapon ]);
    }
});