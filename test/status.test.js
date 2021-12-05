const util = require('../dist');

describe('status()', () => {
	test('successful test', (done) => {
		util.status('play.hypixel.net', 25565)
			.then((result) => {
				expect(typeof result).toBe('object');

				// result.version
				expect(typeof result.version).toBe('object');

				// result.version.name
				expect(typeof result.version.name).toBe('string');
				expect(result.version.name.length).toBeGreaterThanOrEqual(1);

				// result.version.protocol
				expect(typeof result.version.protocol).toBe('number');
				expect(result.version.protocol).toBeGreaterThanOrEqual(0);
				expect(Number.isInteger(result.version.protocol)).toBeTruthy();

				// result.players
				expect(typeof result.players).toBe('object');

				// result.players.online
				expect(typeof result.players.online).toBe('number');
				expect(result.players.online).toBeGreaterThanOrEqual(0);
				expect(Number.isInteger(result.players.online)).toBeTruthy();

				// result.players.max
				expect(typeof result.players.max).toBe('number');
				expect(result.players.max).toBeGreaterThanOrEqual(0);
				expect(Number.isInteger(result.players.max)).toBeTruthy();

				// result.players.sample
				expect(Array.isArray(result.players.sample) || result.players.sample === null).toBeTruthy();

				if (result.players.sample !== null) {
					for (const player of result.players.sample) {
						expect(typeof player).toBe('object');

						// result.players.sample[i].name
						expect(typeof player.name).toBe('string');
						expect(player.name.length).toBeGreaterThanOrEqual(1);

						// result.players.sample[i].id
						expect(typeof player.id).toBe('string');
						expect(player.id.length).toBeGreaterThanOrEqual(1);
					}
				}

				// result.motd
				expect(typeof result.motd).toBe('object');

				// result.motd.raw
				expect(typeof result.motd.raw).toBe('string');
				expect(result.motd.raw.length).toBeGreaterThanOrEqual(1);

				// result.motd.clean
				expect(typeof result.motd.clean).toBe('string');
				expect(result.motd.clean.length).toBeGreaterThanOrEqual(1);

				// result.motd.html
				expect(typeof result.motd.html).toBe('string');
				expect(result.motd.html.length).toBeGreaterThanOrEqual(1);

				// result.favicon
				expect(typeof result.favicon === 'string' || result.favicon === null).toBeTruthy();

				if (result.favicon !== null) {
					expect(result.favicon.length).toBeGreaterThanOrEqual(1);
				}

				// result.srvRecord
				expect(typeof result.srvRecord === 'object' || result.srvRecord === null).toBeTruthy();

				if (result.srvRecord !== null) {
					// result.srvRecord.host
					expect(typeof result.srvRecord.host).toBe('string');
					expect(result.srvRecord.host).toBeGreaterThanOrEqual(1);

					// result.srvRecord.port
					expect(typeof result.srvRecord.port).toBe('number');
					expect(result.srvRecord.port).toBeGreaterThanOrEqual(0);
					expect(result.srvRecord.port).toBeLessThanOrEqual(65535);
					expect(Number.isInteger(result.srvRecord.port)).toBeTruthy();
				}

				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});