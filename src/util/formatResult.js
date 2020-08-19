const assert = require('assert');
const parseDescription = require('./parseDescription');

module.exports = (host, port, srvRecord, result) => {
	assert(typeof host === 'string', 'Expected string, got ' + (typeof host));
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(typeof port === 'number', 'Expected number, got ' + (typeof port));
	assert(Number.isInteger(port), 'Expected integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof srvRecord === 'object' || srvRecord === null, 'Expected object or null, got ' + (typeof srvRecord));
	assert(typeof result === 'object', 'Expected object, got ' + (typeof result));

	const version = 'version' in result && 'name' in result.version ? result.version.name : null;
	const protocolVersion = 'version' in result && 'protocol' in result.version ? result.version.protocol : null;
	const onlinePlayers = 'players' in result && 'online' in result.players ? result.players.online : null;
	const maxPlayers = 'players' in result && 'max' in result.players ? result.players.max : null;
	const samplePlayers = 'players' in result && 'sample' in result.players ? result.players.sample : null;
	const descriptionText = typeof result.description !== 'undefined' ? parseDescription(result.description) : null;
	const favicon = 'favicon' in result ? result.favicon : null;
	const modList = 'modinfo' in result && 'modList' in result.modinfo ? result.modinfo.modList : null;

	return {
		host,
		port,
		srvRecord,
		version,
		protocolVersion,
		onlinePlayers,
		maxPlayers,
		samplePlayers,
		descriptionText,
		favicon,
		modList,

		getHost() {
			console.warn('(minecraft-server-util) deprecation warning: getHost() will be removed in the next major release, use .host instead');

			return host;
		},

		getPort() {
			console.warn('(minecraft-server-util) deprecation warning: getPort() will be removed in the next major release, use .port instead');

			return port;
		},

		getVersion() {
			console.warn('(minecraft-server-util) deprecation warning: getVersion() will be removed in the next major release, use .version instead');

			return version;
		},

		getProtocolVersion() {
			console.warn('(minecraft-server-util) deprecation warning: getProtocolVersion() will be removed in the next major release, use .protocolVersion instead');

			return protocolVersion;
		},

		getOnlinePlayers() {
			console.warn('(minecraft-server-util) deprecation warning: getOnlinePlayers() will be removed in the next major release, use .onlinePlayers instead');

			return onlinePlayers;
		},

		getPlayersOnline() {
			console.warn('(minecraft-server-util) deprecation warning: getPlayersOnline() will be removed in the next major release, use .onlinePlayers instead');

			return onlinePlayers;
		},

		getMaxPlayers() {
			console.warn('(minecraft-server-util) deprecation warning: getMaxPlayers() will be removed in the next major release, use .maxPlayers instead');

			return maxPlayers;
		},

		getSamplePlayers() {
			console.warn('(minecraft-server-util) deprecation warning: getSamplePlayers() will be removed in the next major release, use .samplePlayers instead');

			return samplePlayers;
		},

		getDescriptionText() {
			console.warn('(minecraft-server-util) deprecation warning: getDescriptionText() will be removed in the next major release, use .descriptionText instead');

			return descriptionText;
		},

		getFavicon() {
			console.warn('(minecraft-server-util) deprecation warning: getFavicon() will be removed in the next major release, use .favicon instead');

			return favicon;
		},

		getModList() {
			console.warn('(minecraft-server-util) deprecation warning: getModList() will be removed in the next major release, use .modList instead');

			return modList;
		}
	};
};