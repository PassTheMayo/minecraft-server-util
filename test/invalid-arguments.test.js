const bluebird = require('bluebird');
bluebird.config({ longStackTraces: true, warnings: true });
global.Promise = bluebird;

jest.setTimeout(8000);

const ping = require('../src');

test('invalid arguments - callback', (done) => {
	try {
		ping(25565);

		done.fail('ping() accepted invalid arguments');
	} catch (e) {
		done();
	}
});

test('invalid arguments - promise', (done) => {
	try {
		ping(25565)
			.then((result) => {
				done.fail('ping() accepted invalid arguments');
			})
			.catch((error) => {
				done.fail('ping() accepted invalid arguments, should have thrown error, not rejected promise');
			});
	} catch (e) {
		done();
	}
});