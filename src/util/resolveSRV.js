const dns = require('dns');

module.exports = (host) => {
	return new Promise((resolve) => {
		dns.resolveSrv('_minecraft._tcp.' + host, (error, address) => {
			if (error || !address || address.length < 1) return resolve(null);

			resolve({ host: address[0].name, port: address[0].port });
		});
	});
};