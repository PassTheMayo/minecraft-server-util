const parseDescription = require('../Util/parseDescription');

class Response {
	constructor(host, port, data) {
		if (typeof host !== 'string') throw new Error('Host must be a string');
		if (typeof port !== 'number') throw new Error('Port must be a number');
		if (typeof data !== 'object') throw new Error('Data must be an object');
		if (port < 1 || port > 65536) throw new Error('Port must be in range (0, 65536]');

		const descriptionText = typeof data.description !== 'undefined' ? parseDescription(data.description) : null;

		this.host = host;
		this.port = port;
		this.version = 'version' in data && 'name' in data.version ? data.version.name : null;
		this.protocolVersion = 'version' in data && 'protocol' in data.version ? data.version.protocol : null;
		this.onlinePlayers = 'players' in data && 'online' in data.players ? data.players.online : null;
		this.maxPlayers = 'players' in data && 'max' in data.players ? data.players.max : null;
		this.samplePlayers = 'players' in data && 'sample' in data.players ? data.players.sample : null;
		this.descriptionText = descriptionText;
		this.favicon = 'favicon' in data ? data.favicon : null;
		this.modList = 'modinfo' in data && 'modList' in data.modinfo ? data.modinfo.modList : null;
	}

	getHost() {
		console.warn('(minecraft-server-util) deprecation warning: getHost() will be removed in the next major release, use .host instead');

		return this.host;
	}

	getPort() {
		console.warn('(minecraft-server-util) deprecation warning: getPort() will be removed in the next major release, use .port instead');

		return this.port;
	}

	getVersion() {
		console.warn('(minecraft-server-util) deprecation warning: getVersion() will be removed in the next major release, use .version instead');

		return this.version;
	}

	getProtocolVersion() {
		console.warn('(minecraft-server-util) deprecation warning: getProtocolVersion() will be removed in the next major release, use .protocolVersion instead');

		return this.protocolVersion;
	}

	getOnlinePlayers() {
		console.warn('(minecraft-server-util) deprecation warning: getOnlinePlayers() will be removed in the next major release, use .onlinePlayers instead');

		return this.onlinePlayers;
	}

	getPlayersOnline() {
		console.warn('(minecraft-server-util) deprecation warning: getPlayersOnline() will be removed in the next major release, use .onlinePlayers instead');

		return this.onlinePlayers;
	}

	getMaxPlayers() {
		console.warn('(minecraft-server-util) deprecation warning: getMaxPlayers() will be removed in the next major release, use .maxPlayers instead');

		return this.maxPlayers;
	}

	getSamplePlayers() {
		console.warn('(minecraft-server-util) deprecation warning: getSamplePlayers() will be removed in the next major release, use .samplePlayers instead');

		return this.samplePlayers;
	}

	getDescriptionText() {
		console.warn('(minecraft-server-util) deprecation warning: getDescriptionText() will be removed in the next major release, use .descriptionText instead');

		return this.descriptionText;
	}

	getFavicon() {
		console.warn('(minecraft-server-util) deprecation warning: getFavicon() will be removed in the next major release, use .favicon instead');

		return this.favicon;
	}

	getModList() {
		console.warn('(minecraft-server-util) deprecation warning: getModList() will be removed in the next major release, use .modList instead');

		return this.modList;
	}
}

module.exports = Response;