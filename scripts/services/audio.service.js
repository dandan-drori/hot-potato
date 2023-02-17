export class AudioService {
	audios = {};
	sounds = {
		background: '../../assets/audio/Fluffing-a-Duck.mp3',
		jump: '../../assets/audio/jump.wav',
	};

	constructor() {
		this.initSounds();
	}

	static getInstance(...args) {
		if (!this.instance) {
			this.instance = new AudioService(...args);
		}
		return this.instance;
	}

	playSound(soundName) {
		this.audios[soundName]?.play();
	}

	pauseSound(soundName) {
		this.audios[soundName]?.pause();
	}

	stopSound(soundName) {
		this.pauseSound(soundName);
		if (this.audios[soundName]) {
			this.audios[soundName].currentTime = 0;
		}
	}

	stopAllJumpSounds() {
		Object.keys(this.sounds).forEach(sound => {
			if (sound.includes('jump')) {
				this.stopSound(sound);
			}
		});
	}

	initSounds() {
		Object.keys(this.sounds).forEach(sound => {
			this.audios[sound] = new Audio(this.sounds[sound]);
			if (sound === 'background') {
				this.audios[sound].loop = true;
			}
		});
	}

	changeSoundsVolume(sound, volume) {
		this.audios[sound].volume = volume;
	}

	muteAllSounds() {
		Object.keys(this.sounds).forEach(sound => {
			this.changeSoundsVolume(sound, 0);
		});
	}

	stopAllSounds() {
		Object.keys(this.sounds).forEach(sound => {
			this.stopSound(sound);
		});
	}
}
