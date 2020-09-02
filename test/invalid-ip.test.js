jest.setTimeout(8000);

const ping = require('../build');

test('invalid IP address', (done) => {
	ping('a')
		.then(() => {
			done.fail('ping() accepted invalid IP address');
		})
		.catch(() => {
			done();
		});
});