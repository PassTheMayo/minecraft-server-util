jest.setTimeout(1000 * 15);

const { ping } = require('../build');

const servers = [
	'hub.mcs.gg',
	'mc.hypixel.net',
	'mccentral.org'
];

for (let i = 0; i < servers.length; i++) {
	test(servers[i] + ' ping test', (done) => {
		ping(servers[i])
			.then((data) => {
				expect(data.host).toEqual(servers[i]);
				expect(data.port).toEqual(25565);
				expect(typeof data.version).toEqual('string');
				expect(typeof data.protocolVersion).toEqual('number');
				expect(typeof data.onlinePlayers).toEqual('number');
				expect(typeof data.maxPlayers).toEqual('number');
				expect(typeof data.samplePlayers).toEqual('object');
				expect(typeof data.description).toEqual('object');
				expect(typeof data.description.toString()).toEqual('string');
				expect(typeof data.description.toRaw()).toEqual('string');
				if (data.favicon !== null) expect(typeof data.favicon).toEqual('string');

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