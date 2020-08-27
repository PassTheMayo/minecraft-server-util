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
			.then(() => {
				done.fail('ping() accepted invalid arguments');
			})
			.catch(() => {
				done.fail('ping() accepted invalid arguments, should have thrown error, not rejected promise');
			});
	} catch (e) {
		done();
	}
});