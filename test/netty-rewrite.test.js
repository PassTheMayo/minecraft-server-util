const bluebird = require('bluebird');
bluebird.config({ longStackTraces: true, warnings: true });
global.Promise = bluebird;

jest.setTimeout(8000);

const ping = require('../');

const servers = [
	'hub.mcs.gg',
	'mc.hypixel.net',
	'mccentral.org',
	'pixel.mc-complex.com',
	'pvpwars.net',
	'play.thedestinymc.com',
	'pvp.thearchon.net',
	'play.vanitymc.co',
	'play.pixelmonrealms.com'
];

for (let i = 0; i < servers.length; i++) {
	test(servers[i] + ' ping test - callback', (done) => {
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

	test(servers[i] + ' ping test - promise', (done) => {
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
}