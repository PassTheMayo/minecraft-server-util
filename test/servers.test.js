const bluebird = require('bluebird');
bluebird.config({ longStackTraces: true, warnings: true });
global.Promise = bluebird;

jest.setTimeout(1000 * 15);

const ping = require('../src');

const servers = [
	'hub.mcs.gg',
	'mc.hypixel.net',
	'mccentral.org'
];

for (let i = 0; i < servers.length; i++) {
	test(servers[i] + ' ping test - callback', (done) => {
		ping(servers[i], (error, data) => {
			if (error) return done.fail(error);

			expect(data.host).toEqual(servers[i]);
			expect(data.port).toEqual(25565);
			expect(typeof data.version).toEqual('string');
			expect(typeof data.protocolVersion).toEqual('number');
			expect(typeof data.onlinePlayers).toEqual('number');
			expect(typeof data.maxPlayers).toEqual('number');
			expect(typeof data.samplePlayers).toEqual('object');
			expect(typeof data.descriptionText).toEqual('string');
			expect(typeof data.favicon).toEqual('string');

			if (data.modList != null) {
				expect(data.modList).toBeInstanceOf(Array);
			}

			expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
			expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

			done();
		});
	});

	test(servers[i] + ' ping test - promise', (done) => {
		ping(servers[i])
			.then((data) => {
				expect(data.host).toEqual(servers[i]);
				expect(data.port).toEqual(25565);
				expect(typeof data.version).toEqual('string');
				expect(typeof data.protocolVersion).toEqual('number');
				expect(typeof data.onlinePlayers).toEqual('number');
				expect(typeof data.maxPlayers).toEqual('number');
				expect(typeof data.samplePlayers).toEqual('object');
				expect(typeof data.descriptionText).toEqual('string');
				expect(typeof data.favicon).toEqual('string');

				if (data.modList != null) {
					expect(data.modList).toBeInstanceOf(Array);
				}

				expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
				expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

				done();
			})
			.catch((error) => {
				done.fail(error);
			});
	});

	test(servers[i] + ' ping test - callback - port', (done) => {
		ping(servers[i], 25565, (error, data) => {
			if (error) return done.fail(error);

			expect(data.host).toEqual(servers[i]);
			expect(data.port).toEqual(25565);
			expect(typeof data.version).toEqual('string');
			expect(typeof data.protocolVersion).toEqual('number');
			expect(typeof data.onlinePlayers).toEqual('number');
			expect(typeof data.maxPlayers).toEqual('number');
			expect(typeof data.samplePlayers).toEqual('object');
			expect(typeof data.descriptionText).toEqual('string');
			expect(typeof data.favicon).toEqual('string');

			if (data.modList != null) {
				expect(data.modList).toBeInstanceOf(Array);
			}

			expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
			expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

			done();
		});
	});

	test(servers[i] + ' ping test - promise - port', (done) => {
		ping(servers[i], 25565)
			.then((data) => {
				expect(data.host).toEqual(servers[i]);
				expect(data.port).toEqual(25565);
				expect(typeof data.version).toEqual('string');
				expect(typeof data.protocolVersion).toEqual('number');
				expect(typeof data.onlinePlayers).toEqual('number');
				expect(typeof data.maxPlayers).toEqual('number');
				expect(typeof data.samplePlayers).toEqual('object');
				expect(typeof data.descriptionText).toEqual('string');
				expect(typeof data.favicon).toEqual('string');

				if (data.modList != null) {
					expect(data.modList).toBeInstanceOf(Array);
				}

				expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
				expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

				done();
			})
			.catch((error) => {
				done.fail(error);
			});
	});

	test(servers[i] + ' ping test - callback - options', (done) => {
		ping(servers[i], { protocolVersion: 47 }, (error, data) => {
			if (error) return done.fail(error);

			expect(data.host).toEqual(servers[i]);
			expect(data.port).toEqual(25565);
			expect(typeof data.version).toEqual('string');
			expect(typeof data.protocolVersion).toEqual('number');
			expect(typeof data.onlinePlayers).toEqual('number');
			expect(typeof data.maxPlayers).toEqual('number');
			expect(typeof data.samplePlayers).toEqual('object');
			expect(typeof data.descriptionText).toEqual('string');
			expect(typeof data.favicon).toEqual('string');

			if (data.modList != null) {
				expect(data.modList).toBeInstanceOf(Array);
			}

			expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
			expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

			done();
		});
	});

	test(servers[i] + ' ping test - promise - options', (done) => {
		ping(servers[i], { protocolVersion: 47 })
			.then((data) => {
				expect(data.host).toEqual(servers[i]);
				expect(data.port).toEqual(25565);
				expect(typeof data.version).toEqual('string');
				expect(typeof data.protocolVersion).toEqual('number');
				expect(typeof data.onlinePlayers).toEqual('number');
				expect(typeof data.maxPlayers).toEqual('number');
				expect(typeof data.samplePlayers).toEqual('object');
				expect(typeof data.descriptionText).toEqual('string');
				expect(typeof data.favicon).toEqual('string');

				if (data.modList != null) {
					expect(data.modList).toBeInstanceOf(Array);
				}

				expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
				expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

				done();
			})
			.catch((error) => {
				done.fail(error);
			});
	});

	test(servers[i] + ' ping test - callback - options - port', (done) => {
		ping(servers[i], 25565, { protocolVersion: 47 }, (error, data) => {
			if (error) return done.fail(error);

			expect(data.host).toEqual(servers[i]);
			expect(data.port).toEqual(25565);
			expect(typeof data.version).toEqual('string');
			expect(typeof data.protocolVersion).toEqual('number');
			expect(typeof data.onlinePlayers).toEqual('number');
			expect(typeof data.maxPlayers).toEqual('number');
			expect(typeof data.samplePlayers).toEqual('object');
			expect(typeof data.descriptionText).toEqual('string');
			expect(typeof data.favicon).toEqual('string');

			if (data.modList != null) {
				expect(data.modList).toBeInstanceOf(Array);
			}

			expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
			expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

			done();
		});
	});

	test(servers[i] + ' ping test - promise - options - port', (done) => {
		ping(servers[i], 25565, { protocolVersion: 47 })
			.then((data) => {
				expect(data.host).toEqual(servers[i]);
				expect(data.port).toEqual(25565);
				expect(typeof data.version).toEqual('string');
				expect(typeof data.protocolVersion).toEqual('number');
				expect(typeof data.onlinePlayers).toEqual('number');
				expect(typeof data.maxPlayers).toEqual('number');
				expect(typeof data.samplePlayers).toEqual('object');
				expect(typeof data.descriptionText).toEqual('string');
				expect(typeof data.favicon).toEqual('string');

				if (data.modList != null) {
					expect(data.modList).toBeInstanceOf(Array);
				}

				expect(data.onlinePlayers).toBeGreaterThanOrEqual(0);
				expect(data.maxPlayers).toBeGreaterThanOrEqual(0);

				done();
			})
			.catch((error) => {
				done.fail(error);
			});
	});
}