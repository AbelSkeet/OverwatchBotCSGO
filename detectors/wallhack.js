// This class name MUST be unique or it will override other results
module.exports = class Wallhack {
	constructor(parent, config) {
		this.parent = parent; // This is the object from "Demo.js"
		this.config = config;

		// Variables
		this.infractions = [];

		// Register events
		this.parent.demo.gameEvents.on("player_death", this.OnPlayerDeath.bind(this));
	}

	result() {
		/*
		This method is raan at the end when parsing of the demo has finished
		It should ALWAYS return an object like this:
		{
			aimbot: false, // True if this detector thought the player was aimbotting
			wallhack: false, // True if this detector thought the player was wallhacking
			speedhack: false, // True if this detector thought the player was using some kind of other cheat (Speedhack, Teleportation, Bunnyhop, etc)
			teamharm: false // True if this detector thought the player has shown anti-competitive behaviour (Griefing, Boosting Lobby, etc)
		}
		*/
		return {
			aimbot: false,
			wallhack: this.infractions.length >= this.config.verdict.minWallKills,
			speedhack: false,
			teamharm: false
		};
	}

	resultRaw() {
		/*
		This method is ran at the end when parsing of the demo has finished
		It must return an array with the infractions the suspect received
		*/
		return this.infractions;
	}

	/******************
	 * Custom Methods *
	 ******************/
	OnPlayerDeath(ev) {
		let attacker = this.parent.demo.entities.getByUserId(ev.attacker);
		if (!attacker || attacker.steam64Id !== this.parent.suspect64Id) {
			return; // Attacker no longer available or not our suspect
		}

		if (ev.penetrated <= 0 && !ev.thrusmoke && !ev.attackerblind) {
			// Nothing suspicious
			return;
		}

		// Log this
		this.infractions.push({
			tick: this.parent.demo.currentTick,
			penetrated: ev.penetrated,
			smokebang: ev.thrusmoke,
			blind: ev.attackerblind
		});
	}
};

