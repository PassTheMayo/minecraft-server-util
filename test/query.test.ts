import { assert } from 'chai';
import 'mocha';

import util from '../src';
import Description from '../src/structure/Description';

const servers: [string, number][] = [
	// ['localhost', 25565]
];

describe('queryBasic()', () => {
	for (let i = 0; i < servers.length; i++) {
		it(servers[i][0], (done) => {
			util.query(servers[i][0], { port: servers[i][1] })
				.then((result) => {
					assert(typeof result === 'object', `Expected result to be an object, got ${typeof result}`);
					assert(typeof result.host === 'string', `Expected 'result.host' to be a string, got ${typeof result.host}`);
					assert(result.host.length > 0, `Expected 'result.host' to have a length greater than 0, got ${result.host.length}`);
					assert(result.host === servers[i][0], `Expected 'result.host' to match input host, got ${result.host}`);
					assert(typeof result.port === 'number', `Expected 'result.port' to be a number, got ${typeof result.port}`);
					assert(result.port > 0, `Expected 'result.port' to be greater than 0, got ${result.port}`);
					assert(result.port < 65536, `Expected 'result.port' to be less than 65536, got ${result.port}`);
					assert(Number.isInteger(result.port), `Expected 'result.port' to be an integer, got ${result.port}`);
					assert(typeof result.srvRecord === 'object' || result.srvRecord === null, `Expected 'result.srvRecord' to be an object or null, got ${typeof result.srvRecord}`);

					if (result.srvRecord !== null) {
						assert(typeof result.srvRecord.host === 'string', `Expected 'result.srvRecord.host' to be a string, got ${typeof result.srvRecord.host}`);
						assert(result.srvRecord.host.length > 0, `Expected 'result.srvRecord.host' to have a length greater than 0, got ${result.srvRecord.host.length}`);
						assert(typeof result.srvRecord.port === 'number', `Expected 'result.srvRecord.port' to be a number, got ${typeof result.srvRecord.port}`);
						assert(result.srvRecord.port > 0, `Expected 'result.srvRecord.port' to be greater than 0, got ${result.srvRecord.port}`);
						assert(result.srvRecord.port < 65536, `Expected 'result.srvRecord.port' to be less than 65536, got ${result.srvRecord.port}`);
						assert(Number.isInteger(result.srvRecord.port), `Expected 'result.srvRecord.port' to be an integer, got ${result.srvRecord.port}`);
					}

					assert(typeof result.gameType === 'string', `Expected 'result.gameType' to be a string, got ${typeof result.gameType}`);
					assert(result.gameType.length > 0, `Expected 'result.gameType' to have a length greater than 0, got ${result.gameType.length}`);
					assert(typeof result.levelName === 'string', `Expected 'result.levelName' to be a string, got ${typeof result.levelName}`);
					assert(result.levelName.length > 0, `Expected 'result.levelName' to have a length greater than 0, got ${result.levelName.length}`);
					assert(typeof result.onlinePlayers === 'number', `Expected 'result.onlinePlayers' to be a number, got ${typeof result.onlinePlayers}`);
					assert(result.onlinePlayers >= 0, `Expected 'result.onlinePlayers' to be greater than or equal to 0, got ${result.onlinePlayers}`);
					assert(typeof result.maxPlayers === 'number', `Expected 'result.maxPlayers' to be a number, got ${typeof result.maxPlayers}`);
					assert(result.maxPlayers >= 0, `Expected 'result.maxPlayers' to be greater than or equal to 0, got ${result.maxPlayers}`);
					assert(result.description instanceof Description, `Expected 'result.description' to be an instance of Description, got ${Object.getPrototypeOf(result.description)}`);
					assert(typeof result.description.descriptionText === 'string', `Expected 'result.description.descriptionText' to be a string, got ${typeof result.description.descriptionText}`);
					assert(typeof result.description.toRaw === 'function', `Expected 'result.description.toRaw' to be a function, got ${typeof result.description.toRaw}`);
					assert(typeof result.description.toRaw() === 'string', `Expected 'result.description.toRaw()' to be a string, got ${typeof result.description.toRaw()}`);
					assert(typeof result.description.toANSI === 'function', `Expected 'result.description.toANSI' to be a function, got ${typeof result.description.toANSI}`);
					assert(typeof result.description.toANSI() === 'string', `Expected 'result.description.toANSI()' to be a string, got ${typeof result.description.toANSI()}`);
					assert(typeof result.description.toString === 'function', `Expected 'result.description.toString' to be a function, got ${typeof result.description.toString}`);
					assert(typeof result.description.toString() === 'string', `Expected 'result.description.toString()' to be a string, got ${typeof result.description.toString()}`);

					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});

describe('queryFull()', () => {
	for (let i = 0; i < servers.length; i++) {
		it(servers[i][0], (done) => {
			util.queryFull(servers[i][0], { port: servers[i][1] })
				.then((result) => {
					assert(typeof result === 'object', `Expected result to be an object, got ${typeof result}`);
					assert(typeof result.host === 'string', `Expected 'result.host' to be a string, got ${typeof result.host}`);
					assert(result.host.length > 0, `Expected 'result.host' to have a length greater than 0, got ${result.host.length}`);
					assert(result.host === servers[i][0], `Expected 'result.host' to match input host, got ${result.host}`);
					assert(typeof result.port === 'number', `Expected 'result.port' to be a number, got ${typeof result.port}`);
					assert(result.port > 0, `Expected 'result.port' to be greater than 0, got ${result.port}`);
					assert(result.port < 65536, `Expected 'result.port' to be less than 65536, got ${result.port}`);
					assert(Number.isInteger(result.port), `Expected 'result.port' to be an integer, got ${result.port}`);
					assert(typeof result.srvRecord === 'object' || result.srvRecord === null, `Expected 'result.srvRecord' to be an object or null, got ${typeof result.srvRecord}`);

					if (result.srvRecord !== null) {
						assert(typeof result.srvRecord.host === 'string', `Expected 'result.srvRecord.host' to be a string, got ${typeof result.srvRecord.host}`);
						assert(result.srvRecord.host.length > 0, `Expected 'result.srvRecord.host' to have a length greater than 0, got ${result.srvRecord.host.length}`);
						assert(typeof result.srvRecord.port === 'number', `Expected 'result.srvRecord.port' to be a number, got ${typeof result.srvRecord.port}`);
						assert(result.srvRecord.port > 0, `Expected 'result.srvRecord.port' to be greater than 0, got ${result.srvRecord.port}`);
						assert(result.srvRecord.port < 65536, `Expected 'result.srvRecord.port' to be less than 65536, got ${result.srvRecord.port}`);
						assert(Number.isInteger(result.srvRecord.port), `Expected 'result.srvRecord.port' to be an integer, got ${result.srvRecord.port}`);
					}

					assert(typeof result.gameType === 'string' || result.gameType === null, `Expected 'result.gameType' to be a string or null, got ${typeof result.gameType}`);

					if (result.gameType !== null) {
						assert(result.gameType.length > 0, `Expected 'result.gameType' to have a length greater than 0, got ${result.gameType.length}`);
					}

					assert(typeof result.version === 'string' || result.version === null, `Expected 'result.version' to be a string or null, got ${typeof result.version}`);

					if (result.version !== null) {
						assert(result.version.length > 0, `Expected 'result.version' to have a length greater than 0, got ${result.version.length}`);
					}

					assert(typeof result.software === 'string' || result.software === null, `Expected 'result.software' to be a string or null, got ${typeof result.software}`);

					if (result.software !== null) {
						assert(result.software.length > 0, `Expected 'result.software' to have a length greater than 0, got ${result.software.length}`);
					}

					assert(Array.isArray(result.plugins), `Expected 'result.plugins' to be an array, got ${Object.getPrototypeOf(result.plugins)}`);

					for (let i = 0; i < result.plugins.length; i++) {
						assert(typeof result.plugins[i] === 'string', `Expected 'result.plugins[${i}]' to be a string, got ${typeof result.plugins[i]}`);
						assert(result.plugins[i].length > 0, `Expected 'result.plugins[${i}]' to have a length greater than 0, got ${result.plugins[i].length}`);
					}

					assert(typeof result.levelName === 'string' || result.levelName === null, `Expected 'result.levelName' to be a string or null, got ${typeof result.levelName}`);

					if (result.levelName !== null) {
						assert(result.levelName.length > 0, `Expected 'result.levelName' to have a length greater than 0, got ${result.levelName.length}`);
					}

					assert(typeof result.onlinePlayers === 'number' || result.onlinePlayers === null, `Expected 'result.onlinePlayers' to be a number or null, got ${typeof result.onlinePlayers}`);

					if (result.onlinePlayers !== null) {
						assert(result.onlinePlayers >= 0, `Expected 'result.onlinePlayers' to be greater than or equal to 0, got ${result.onlinePlayers}`);
					}

					assert(typeof result.maxPlayers === 'number' || result.maxPlayers === null, `Expected 'result.maxPlayers' to be a number or null, got ${typeof result.maxPlayers}`);

					if (result.maxPlayers !== null) {
						assert(result.maxPlayers >= 0, `Expected 'result.maxPlayers' to be greater than or equal to 0, got ${result.maxPlayers}`);
					}

					assert(Array.isArray(result.players), `Expected 'result.players' to be an array, got ${Object.getPrototypeOf(result.players)}`);

					for (let i = 0; i < result.players.length; i++) {
						assert(typeof result.players[i] === 'string', `Expected 'result.players[${i}]' to be a string, got ${typeof result.players[i]}`);
						assert(result.players[i].length > 0, `Expected 'result.players[${i}]' to have a length greater than 0, got ${result.players[i].length}`);
					}

					assert(result.description instanceof Description, `Expected 'result.description' to be an instance of Description, got ${Object.getPrototypeOf(result.description)}`);
					assert(typeof result.description.descriptionText === 'string', `Expected 'result.description.descriptionText' to be a string, got ${typeof result.description.descriptionText}`);
					assert(typeof result.description.toRaw === 'function', `Expected 'result.description.toRaw' to be a function, got ${typeof result.description.toRaw}`);
					assert(typeof result.description.toRaw() === 'string', `Expected 'result.description.toRaw()' to be a string, got ${typeof result.description.toRaw()}`);
					assert(typeof result.description.toANSI === 'function', `Expected 'result.description.toANSI' to be a function, got ${typeof result.description.toANSI}`);
					assert(typeof result.description.toANSI() === 'string', `Expected 'result.description.toANSI()' to be a string, got ${typeof result.description.toANSI()}`);
					assert(typeof result.description.toString === 'function', `Expected 'result.description.toString' to be a function, got ${typeof result.description.toString}`);
					assert(typeof result.description.toString() === 'string', `Expected 'result.description.toString()' to be a string, got ${typeof result.description.toString()}`);

					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	}
});