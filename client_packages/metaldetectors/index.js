mp.events.add("playMetalDetectorAlarm", (position, isSmallWeapon) => {
    // Guess we don't have to request any soundbanks etc.
    mp.game.audio.playSoundFromCoord(-1, isSmallWeapon ? "Metal_Detector_Small_Guns" : "Metal_Detector_Big_Guns", position.x, position.y, position.z, "dlc_ch_heist_finale_security_alarms_sounds", false, 0, false);
});