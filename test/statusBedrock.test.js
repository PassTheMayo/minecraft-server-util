const util = require('../dist');

const address = process.env.ADDRESS || 'mco.cubecraft.net';
const port = parseInt(process.env.PORT || '19132');

jest.setTimeout(1000 * 15);

test('statusBedrock() - success', (done) => {
	util.statusBedrock(address, port)
		.then((result) => {
			expect(typeof result).toBe('object');

			// result.edition
			expect(typeof result.edition).toBe('string');
			expect(result.edition.length).toBeGreaterThanOrEqual(1);

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

			// result.serverGUID
			expect(typeof result.serverGUID).toBe('bigint');

			// result.serverID
			expect(typeof result.serverID).toBe('string');
			expect(result.serverID.length).toBeGreaterThanOrEqual(1);

			// result.gameMode
			expect(typeof result.gameMode).toBe('string');
			expect(result.gameMode.length).toBeGreaterThanOrEqual(1);

			// result.gameModeID
			expect(typeof result.gameModeID).toBe('number');
			expect(Number.isInteger(result.gameModeID)).toBeTruthy();
			expect(result.gameModeID).toBeGreaterThanOrEqual(0);

			// result.portIPv4
			expect(typeof result.portIPv4 === 'number' || result.portIPv4 === null).toBeTruthy();

			if (result.portIPv4 !== null) {
				expect(Number.isInteger(result.portIPv4)).toBeTruthy();
				expect(result.portIPv4).toBeGreaterThanOrEqual(0);
				expect(result.portIPv4).toBeLessThanOrEqual(65535);
			}

			// result.portIPv6
			expect(typeof result.portIPv6 === 'number' || result.portIPv6 === null).toBeTruthy();

			if (result.portIPv6 !== null) {
				expect(Number.isInteger(result.portIPv6)).toBeTruthy();
				expect(result.portIPv6).toBeGreaterThanOrEqual(0);
				expect(result.portIPv6).toBeLessThanOrEqual(65535);
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

test('statusBedrock() - invalid host', (done) => {
	util.statusBedrock('abc123', port)
		.then(() => {
			done(new Error('Expected statusBedrock() method to fail with invalid host'));
		})
		.catch(() => {
			done();
		});
});

test('statusBedrock() - unknown host', (done) => {
	util.statusBedrock('example.com', port)
		.then(() => {
			done(new Error('Expected statusBedrock() method to fail with unknown host'));
		})
		.catch(() => {
			done();
		});
});

test('statusBedrock() - negative port', (done) => {
	try {
		util.statusBedrock(address, -1);

		done(new Error('Expected statusBedrock() method to fail with negative port'));
	} catch {
		done();
	}
});

test('statusBedrock() - out-of-range port', (done) => {
	try {
		util.statusBedrock(address, 65536);

		done(new Error('Expected statusBedrock() method to fail with out-of-range port'));
	} catch {
		done();
	}
});

test('statusBedrock() - invalid `options.enableSRV`', (done) => {
	try {
		util.statusBedrock(address, port, { enableSRV: 'true' });

		done(new Error('Expected statusBedrock() method to fail with invalid `options.enableSRV`'));
	} catch {
		done();
	}
});

test('statusBedrock() - invalid `options.timeout`', (done) => {
	try {
		util.statusBedrock(address, port, { timeout: '5000' });

		done(new Error('Expected statusBedrock() method to fail with invalid `options.timeout`'));
	} catch {
		done();
	}
});

test('statusBedrock() - negative `options.timeout`', (done) => {
	try {
		util.statusBedrock(address, port, { timeout: -1 });

		done(new Error('Expected statusBedrock() method to fail with negative `options.timeout`'));
	} catch {
		done();
	}
});

test('statusBedrock() - floating point `options.timeout`', (done) => {
	try {
		util.statusBedrock(address, port, { timeout: 5000.123 });

		done(new Error('Expected statusBedrock() method to fail with floating point `options.timeout`'));
	} catch {
		done();
	}
});