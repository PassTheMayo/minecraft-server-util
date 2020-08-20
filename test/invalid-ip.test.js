const bluebird = require('bluebird');
bluebird.config({ longStackTraces: true, warnings: true });
global.Promise = bluebird;

jest.setTimeout(8000);

const ping = require('../src');

test('invalid IP address - callback', (done) => {
	ping('a', 25565, (error, data) => {
		expect(error).not.toBe(null);
		expect(data).toBe(null);

		done();
	});
});

test('invalid IP address - promise', (done) => {
	ping('a', 25565)
		.then((result) => {
			done.fail('ping() accepted invalid IP address');
		})
		.catch((error) => {
			done();
		});
});