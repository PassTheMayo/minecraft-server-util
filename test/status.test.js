const util = require('../dist');

jest.setTimeout(1000 * 10);

test('status()', (done) => {
	util.status('localhost', { port: 25565 })
		.then((result) => {
			expect(typeof result).toBe('object');

			// `result.host`
			expect(typeof result.host).toBe('string');
			expect(result.host.length > 0).toBeTruthy();
			expect(result.host).toBe('localhost');

			// `result.port`
			expect(typeof result.port).toBe('number');
			expect(result.port).toBeGreaterThanOrEqual(1);
			expect(result.port).toBeLessThanOrEqual(65536);
			expect(Number.isInteger(result.port)).toBeTruthy();
			expect(result.port).toBe(25565);

			// `result.srvRecord`
			expect(typeof result.srvRecord === 'object' || result.srvRecord === null).toBeTruthy();

			if (result.srvRecord !== null) {
				// `result.srvRecord.host`
				expect(typeof result.srvRecord.host).toBe('string');
				expect(result.srvRecord.host.length).toBeGreaterThan(0);

				// `result.srvRecord.port`
				expect(typeof result.srvRecord.port).toBe('number');
				expect(result.port).toBeGreaterThanOrEqual(1);
				expect(result.port).toBeLessThanOrEqual(65536);
				expect(Number.isInteger(result.port)).toBeTruthy();
			}

			// `result.version`
			expect(typeof result.version === 'string' || result.version === null).toBeTruthy();

			if (result.version !== null) {
				expect(result.version.length).toBeGreaterThan(0);
			}

			// `result.protocolVersion`
			expect(typeof result.protocolVersion === 'number' || result.protocolVersion === null).toBeTruthy();

			if (result.protocolVersion !== null) {
				expect(Number.isInteger(result.protocolVersion)).toBeTruthy();
				expect(result.protocolVersion).toBeGreaterThanOrEqual(0);
			}

			// `result.onlinePlayers`
			expect(typeof result.onlinePlayers === 'number' || result.onlinePlayers === null).toBeTruthy();

			if (result.onlinePlayers !== null) {
				expect(Number.isInteger(result.onlinePlayers)).toBeTruthy();
				expect(result.onlinePlayers).toBeGreaterThanOrEqual(0);
			}

			// `result.maxPlayers`
			expect(typeof result.maxPlayers === 'number' || result.maxPlayers === null).toBeTruthy();

			if (result.maxPlayers !== null) {
				expect(Number.isInteger(result.maxPlayers)).toBeTruthy();
				expect(result.maxPlayers).toBeGreaterThanOrEqual(0);
			}

			// `result.samplePlayers`
			expect(Array.isArray(result.samplePlayers) || result.samplePlayers === null).toBeTruthy();

			if (result.samplePlayers !== null) {
				for (const player of result.samplePlayers) {
					expect(typeof player).toBe('object');

					// `result.samplePlayers[i].name`
					expect(typeof player.name).toBe('string');
					expect(player.name.length).toBeGreaterThan(0);

					// `result.samplePlayers[i].id`
					expect(typeof player.id).toBe('string');
					expect(player.id.length).toBeGreaterThan(0);
				}
			}

			// `result.motd`
			expect(typeof result.motd === 'object' || result.motd === null).toBeTruthy();

			if (result.motd !== null) {
				// `result.motd.clean`
				expect(typeof result.motd.clean).toBe('string');

				// `result.motd.raw`
				expect(typeof result.motd.raw).toBe('string');

				// `result.motd.html`
				expect(typeof result.motd.html).toBe('string');
			}

			// `result.favicon`
			expect(typeof result.favicon === 'object' || result.favicon === null).toBeTruthy();

			if (result.favicon !== null) {
				// `result.favicon.toString()`
				expect(typeof result.favicon.toString()).toBe('string');
				expect(result.favicon.toString().length).toBeGreaterThan(0);

				// `result.favicon.toBuffer()`
				expect(Buffer.isBuffer(result.favicon.toBuffer())).toBeTruthy();

				// TODO `result.favicon.writeToFile()` test
			}

			// `result.modInfo`
			expect(result.modInfo === null || typeof result.modInfo === 'object').toBeTruthy();

			if (result.modInfo !== null) {
				// `result.modInfo.type`
				expect(typeof result.modInfo.type).toBe('string');
				expect(result.modInfo.length).toBeGreaterThan(0);

				// `result.modList`
				expect(Array.isArray(result.modInfo.modList)).toBeTruthy();

				for (const mod of result.modInfo) {
					// `result.modInfo.modList[i].modid`
					expect(typeof mod.modid).toBe('string');
					expect(mod.modid.length).toBeGreaterThan(0);

					// `result.modInfo.modList[i].version`
					expect(typeof mod.version).toBe('string');
					expect(mod.version.length).toBeGreaterThan(0);
				}
			}

			// `result.rawResponse`
			expect(result.rawResponse === null || typeof result.rawResponse === 'object').toBeTruthy();

			// `result.roundTripLatency`
			expect(typeof result.roundTripLatency).toBe('number');
			expect(result.roundTripLatency).toBeGreaterThan(0);

			done();
		})
		.catch((error) => {
			done(error);
		});
});

test('status() with unknown host', (done) => {
	util.status('example.com')
		.then(() => {
			done(new Error('Promise should not have resolved with unknown host'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid host', (done) => {
	util.status('abc123')
		.then(() => {
			done(new Error('Promise should not have resolved with invalid host'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid port < 1', (done) => {
	util.status('localhost', { port: -1 })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid port'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid port > 65536', (done) => {
	util.status('localhost', { port: 65537 })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid port'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid non-integer port', (done) => {
	util.status('localhost', { port: 25565.387 })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid port'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid non-number port', (done) => {
	util.status('localhost', { port: '25565' })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid port'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid timeout', (done) => {
	util.status('localhost', { timeout: -500 })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid timeout'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid non-number timeout', (done) => {
	util.status('localhost', { timeout: '15000' })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid timeout'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid protocol version < 0', (done) => {
	util.status('localhost', { protocolVersion: -47 })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid protocol version'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid non-integer protocol version', (done) => {
	util.status('localhost', { protocolVersion: 47.387 })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid protocol version'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});

test('status() with invalid non-number protocol version', (done) => {
	util.status('localhost', { protocolVersion: '47' })
		.then(() => {
			done(new Error('Promise should not have resolved with invalid protocol version'));
		})
		.catch((error) => {
			expect(error).toBeTruthy();
			done();
		});
});