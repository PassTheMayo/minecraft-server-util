import 'mocha';
import { assert } from 'chai';

import util from '../src';
import Description from '../src/structure/Description';

const servers = [
	'hub.mcs.gg',
	'mc.hypixel.net',
	'mccentral.org',
	'play.lemoncloud.net',
	'go.primemc.org',
	'play.mineverse.com',
	'play.applecraft.org',
	'mc.mineville.org',
	'play.chaoscraft.org',
	'play.pixelmonrealms.com',
	'play.extremecraft.net',
	'play.simplesurvival.gg'
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