import 'mocha';
import { assert } from 'chai';

import util from '../src';
import Description from '../src/structure/Description';

const servers = [
	'hub.mcs.gg',
	'mc.hypixel.net',
	'mccentral.org',
	'go.primemc.org',
	'play.mineverse.com',
	'play.applecraft.org',
	'mc.mineville.org',
	'play.chaoscraft.org',
	'play.pixelmonrealms.com',
	'play.extremecraft.net',
	'play.simplesurvival.gg',
	'neonmc.tk'
];

const bedrockServers = [
	'mco.mineplex.com',
	'play.nethergames.org',
	'play.hyperlandsmc.net',
	'play.fallentech.io'
];

describe('status()', () => {
	for (let i = 0; i < servers.length; i++) {
		it(servers[i], (done) => {
			util.status(servers[i])
				.then((result) => {
					assert(typeof result === 'object', `Expected result to be an object, got ${typeof result}`);
					assert(typeof result.host === 'string', `Expected 'result.host' to be a string, got ${typeof result.host}`);
					assert(result.host.length > 0, `Expected 'result.host' to have a length greater than 0, got ${result.host.length}`);
					assert(result.host === servers[i], `Expected 'result.host' to match input, expected ${servers[i]}, got ${result.host}`);
					assert(typeof result.port === 'number', `Expected 'result.port' to be a number, got ${typeof result.port}`);
					assert(result.port > 0, `Expected 'result.port' to be greater than 0, got ${result.port}`);
					assert(result.port < 65536, `Expected 'result.port' to be less than 65536, got ${result.port}`);
					assert(result.port === 25565, `Expected 'result.port' to match input, expected 25565, got ${result.port}`);
					assert(typeof result.srvRecord === 'object', `Expected 'result.srvRecord' to be an object, got ${typeof result.srvRecord}`);
					assert(typeof result.version === 'string' || result.version === null, `Expected 'result.version' to be a string or null, got ${typeof result.version}`);

					if (result.version !== null) {
						assert(result.version.length > 0, `Expected 'result.version' to have a length greater than 0, got ${result.version?.length}`);
					}

					assert(typeof result.protocolVersion === 'number' || result.protocolVersion === null, `Expected 'result.protocolVersion' to be a number or null, got ${typeof result.protocolVersion}`);

					if (result.protocolVersion !== null) {
						assert(result.protocolVersion >= 0, `Expected 'result.protocolVersion' to be greater than or equal to 0, got ${result.protocolVersion}`);
						assert(Number.isInteger(result.protocolVersion), `Expected 'result.protocolVersion' to be an integer, got ${result.protocolVersion}`);
					}

					assert(typeof result.onlinePlayers === 'number' || result.onlinePlayers === null, `Expected 'result.onlinePlayers' to be a number or null, got ${typeof result.onlinePlayers}`);

					if (result.onlinePlayers !== null) {
						assert(result.onlinePlayers >= 0, `Expected 'result.onlinePlayers' to be greater than or equal to 0, got ${result.onlinePlayers}`);
						assert(Number.isInteger(result.onlinePlayers), `Expected 'result.onlinePlayers' to be an integer, got ${result.onlinePlayers}`);
					}

					assert(typeof result.maxPlayers === 'number' || result.maxPlayers === null, `Expected 'result.maxPlayers' to be a number or null, got ${typeof result.maxPlayers}`);

					if (result.maxPlayers !== null) {
						assert(result.maxPlayers >= 0, `Expected 'result.maxPlayers' to be greater than or equal to 0, got ${result.maxPlayers}`);
						assert(Number.isInteger(result.maxPlayers), `Expected 'result.maxPlayers' to be an integer, got ${result.maxPlayers}`);
					}

					assert(Array.isArray(result.samplePlayers) || result.samplePlayers === null, `Expected 'result.samplePlayers' to be an array or null, got ${typeof result.samplePlayers}`);

					if (result.samplePlayers !== null) {
						for (let i = 0; i < result.samplePlayers.length; i++) {
							assert(typeof result.samplePlayers[i] === 'object', `Expected 'result.samplePlayers[${i}]' to be an object, got ${typeof result.samplePlayers[i]}`);
							assert(typeof result.samplePlayers[i].name === 'string', `Expected 'result.samplePlayers[${i}].name' to be a string, got ${result.samplePlayers[i].name}`);
							// assert(result.samplePlayers[i].name.length > 0, `Expected 'result.samplePlayers[${i}].name' to have a length greater than 0, got ${result.samplePlayers[i].name.length}`);
							assert(typeof result.samplePlayers[i].id === 'string', `Expected 'result.samplePlayers[${i}].id' to be a string, got ${result.samplePlayers[i].id}`);
							assert(result.samplePlayers[i].id.length > 0, `Expected 'result.samplePlayers[${i}].id' to have a length greater than 0, got ${result.samplePlayers[i].id.length}`);
						}
					}

					assert(typeof result.description === 'object' || result.description === null, `Expected 'result.description' to be an object or null, got ${typeof result.description}`);

					if (result.description !== null) {
						assert(result.description instanceof Description, `Expected 'result.description' to be an instance of Description, got ${Object.getPrototypeOf(result.description)}`);
						assert(typeof result.description.descriptionText === 'string', `Expected 'result.description.descriptionText' to be a string, got ${typeof result.description.descriptionText}`);
						assert(typeof result.description.toRaw === 'function', `Expected 'result.description.toRaw' to be a function, got ${typeof result.description.toRaw}`);
						assert(typeof result.description.toRaw() === 'string', `Expected 'result.description.toRaw()' to be a string, got ${typeof result.description.toRaw()}`);
						assert(typeof result.description.toANSI === 'function', `Expected 'result.description.toANSI' to be a function, got ${typeof result.description.toANSI}`);
						assert(typeof result.description.toANSI() === 'string', `Expected 'result.description.toANSI()' to be a string, got ${typeof result.description.toANSI()}`);
						assert(typeof result.description.toString === 'function', `Expected 'result.description.toString' to be a function, got ${typeof result.description.toString}`);
						assert(typeof result.description.toString() === 'string', `Expected 'result.description.toString()' to be a string, got ${typeof result.description.toString()}`);
					}

					assert(typeof result.favicon === 'string' || result.favicon === null, `Expected 'result.favicon' to be a string or null, got ${typeof result.favicon}`);

					if (result.favicon !== null) {
						assert(result.favicon.length > 0, `Expected 'result.favicon' to have a length greater than 0, got ${result.favicon.length}`);
					}

					assert(typeof result.modInfo === 'object' || result.modInfo === null, `Expected 'result.modInfo' to be an object or null, got ${typeof result.modInfo}`);

					if (result.modInfo !== null) {
						assert(typeof result.modInfo.type === 'string', `Expected 'result.modInfo.type' to be a string, got ${typeof result.modInfo.type}`);
						assert(result.modInfo.type.length > 0, `Expected 'result.modInfo.type' to have length greater than 0, got ${result.modInfo.type.length}`);
						assert(Array.isArray(result.modInfo.modList), `Expected 'result.modInfo.modList' to be an array, got ${typeof result.modInfo.modList}`);

						for (let i = 0; i < result.modInfo.modList.length; i++) {
							assert(typeof result.modInfo.modList[i] === 'object', `Expected 'result.modInfo.modList[${i}]' to be an object, got ${typeof result.modInfo.modList[i]}`);
							assert(typeof result.modInfo.modList[i].modid === 'string', `Expected 'result.modInfo.modList[${i}].modid' to be a string, got ${typeof result.modInfo.modList[i].modid}`);
							assert(result.modInfo.modList[i].modid.length > 0, `Expected 'result.modInfo.modList[${i}].modid' to have a length greater than 0, got ${typeof result.modInfo.modList[i].modid.length}`);
							assert(typeof result.modInfo.modList[i].version === 'string', `Expected 'result.modInfo.modList[${i}].version' to be a string, got ${typeof result.modInfo.modList[i].version}`);
							assert(result.modInfo.modList[i].version.length > 0, `Expected 'result.modInfo.modList[${i}].version' to have a length greater than 0, got ${typeof result.modInfo.modList[i].version.length}`);
						}
					}

					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});

describe('statusBedrock()', () => {
	for (let i = 0; i < bedrockServers.length; i++) {
		it(bedrockServers[i], (done) => {
			util.statusBedrock(bedrockServers[i])
				.then((result) => {
					assert(typeof result === 'object', `Expected result to be an object, got ${typeof result}`);
					assert(typeof result.host === 'string', `Expected 'result.host' to be a string, got ${typeof result.host}`);
					assert(result.host.length > 0, `Expected 'result.host' to have a length greater than 0, got ${result.host.length}`);
					assert(result.host === bedrockServers[i], `Expected 'result.host' to match input host, got ${result.host}`);
					assert(typeof result.port === 'number', `Expected 'result.port' to be a number, got ${typeof result.port}`);
					assert(result.port > 0, `Expected 'result.port' to be greater than 0, got ${result.port}`);
					assert(result.port < 65536, `Expected 'result.port' to be less than 65536, got ${result.port}`);
					assert(Number.isInteger(result.port), `Expected 'result.port' to be an integer, got ${result.port}`);
					assert(result.port === 19132, `Expected 'result.port' to match input port, got ${result.port}`);
					assert(typeof result.srvRecord === 'object' || result.srvRecord === null, `Expected 'result.srvRecord' to be an object or null, got ${typeof result.srvRecord}`);

					if (typeof result.srvRecord === 'object' && result.srvRecord !== null) {
						assert(typeof result.srvRecord.host === 'string', `Expected 'result.srvRecord.host' to be a string, got ${typeof result.srvRecord.host}`);
						assert(result.srvRecord.host.length > 0, `Expected 'result.srvRecord.host' to have a length greater than 0, got ${result.srvRecord.host.length}`);
						assert(typeof result.srvRecord.port === 'number', `Expected 'result.srvRecord.port' to be a number, got ${typeof result.srvRecord.port}`);
						assert(result.srvRecord.port > 0, `Expected 'result.srvRecord.port' to be greater than 0, got ${result.srvRecord.port}`);
						assert(result.srvRecord.port < 65536, `Expected 'result.srvRecord.port' to be less than 65536, got ${result.srvRecord.port}`);
						assert(Number.isInteger(result.srvRecord.port), `Expected 'result.srvRecord.port' to be an integer, got ${result.srvRecord.port}`);
					}

					assert(typeof result.edition === 'string' || result.edition === null, `Expected 'result.edition' to be a string or null, got ${typeof result.edition}`);

					if (typeof result.edition === 'string') {
						assert(result.edition.length > 0, `Expected 'result.edition' to have a length greater than 0, got ${result.edition.length}`);
					}

					assert(typeof result.serverGUID === 'bigint', `Expected 'result.serverGUID' to be a bigint, got ${typeof result.serverGUID}`);
					assert(typeof result.motdLine1 === 'object' || result.motdLine1 === null, `Expected 'result.motdLine1' to be an object or null, got ${typeof result.motdLine1}`);

					if (result.motdLine1 !== null) {
						assert(result.motdLine1 instanceof Description, `Expected 'result.motdLine1' to be an instance of Description, got ${Object.getPrototypeOf(result.motdLine1)}`);
						assert(typeof result.motdLine1.descriptionText === 'string', `Expected 'result.motdLine1.descriptionText' to be a string, got ${typeof result.motdLine1.descriptionText}`);
						assert(typeof result.motdLine1.toRaw === 'function', `Expected 'result.motdLine1.toRaw' to be a function, got ${typeof result.motdLine1.toRaw}`);
						assert(typeof result.motdLine1.toRaw() === 'string', `Expected 'result.motdLine1.toRaw()' to be a string, got ${typeof result.motdLine1.toRaw()}`);
						assert(typeof result.motdLine1.toANSI === 'function', `Expected 'result.motdLine1.toANSI' to be a function, got ${typeof result.motdLine1.toANSI}`);
						assert(typeof result.motdLine1.toANSI() === 'string', `Expected 'result.motdLine1.toANSI()' to be a string, got ${typeof result.motdLine1.toANSI()}`);
						assert(typeof result.motdLine1.toString === 'function', `Expected 'result.motdLine1.toString' to be a function, got ${typeof result.motdLine1.toString}`);
						assert(typeof result.motdLine1.toString() === 'string', `Expected 'result.motdLine1.toString()' to be a string, got ${typeof result.motdLine1.toString()}`);
					}

					assert(typeof result.motdLine2 === 'object' || result.motdLine2 === null, `Expected 'result.motdLine2' to be an object or null, got ${typeof result.motdLine2}`);

					if (result.motdLine2 !== null) {
						assert(result.motdLine2 instanceof Description, `Expected 'result.motdLine2' to be an instance of Description, got ${Object.getPrototypeOf(result.motdLine2)}`);
						assert(typeof result.motdLine2.descriptionText === 'string', `Expected 'result.motdLine2.descriptionText' to be a string, got ${typeof result.motdLine2.descriptionText}`);
						assert(typeof result.motdLine2.toRaw === 'function', `Expected 'result.motdLine2.toRaw' to be a function, got ${typeof result.motdLine2.toRaw}`);
						assert(typeof result.motdLine2.toRaw() === 'string', `Expected 'result.motdLine2.toRaw()' to be a string, got ${typeof result.motdLine2.toRaw()}`);
						assert(typeof result.motdLine2.toANSI === 'function', `Expected 'result.motdLine2.toANSI' to be a function, got ${typeof result.motdLine2.toANSI}`);
						assert(typeof result.motdLine2.toANSI() === 'string', `Expected 'result.motdLine2.toANSI()' to be a string, got ${typeof result.motdLine2.toANSI()}`);
						assert(typeof result.motdLine2.toString === 'function', `Expected 'result.motdLine2.toString' to be a function, got ${typeof result.motdLine2.toString}`);
						assert(typeof result.motdLine2.toString() === 'string', `Expected 'result.motdLine2.toString()' to be a string, got ${typeof result.motdLine2.toString()}`);
					}

					assert(typeof result.version === 'string' || result.version === null, `Expected 'result.version' to be a string or null, got ${typeof result.version}`);

					if (typeof result.version === 'string') {
						assert(result.version.length > 0, `Expected 'result.version' to have a length greater than 0, got ${result.version.length}`);
					}

					assert(typeof result.protocolVersion === 'number' || result.protocolVersion === null, `Expected 'result.protocolVersion' to be a number or null, got ${typeof result.protocolVersion}`);
					assert(typeof result.maxPlayers === 'number' || result.maxPlayers === null, `Expected 'result.maxPlayers' to a number or null, got ${typeof result.maxPlayers}`);
					assert(typeof result.onlinePlayers === 'number' || result.onlinePlayers === null, `Expected 'result.onlinePlayers' to be a number or null, got ${typeof result.onlinePlayers}`);
					assert(typeof result.serverID === 'string' || result.serverID === null, `Expected 'result.serverID' to be a string or null, got ${typeof result.serverID}`);

					if (typeof result.serverID === 'string') {
						assert(result.serverID.length > 0, `Expected 'result.serverID' to have a length greater than 0, got ${result.serverID.length}`);
					}

					assert(typeof result.gameMode === 'string' || result.gameMode === null, `Expected 'result.gameMode' to be a string or null, got ${typeof result.gameMode}`);

					if (typeof result.gameMode === 'string') {
						assert(result.gameMode.length > 0, `Expected 'result.gameMode' to have a length greater than 0, got ${result.gameMode.length}`);
					}

					assert(typeof result.gameModeID === 'number' || result.gameModeID === null, `Expected 'result.gameModeID' to be a number or null, got ${typeof result.gameModeID}`);
					assert(typeof result.portIPv4 === 'number' || result.portIPv4 === null, `Expected 'result.portIPv4' to be a number or null, got ${typeof result.portIPv4}`);
					assert(typeof result.portIPv6 === 'number' || result.portIPv6 === null, `Expected 'result.portIPv6' to be a number or null, got ${typeof result.portIPv6}`);

					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});