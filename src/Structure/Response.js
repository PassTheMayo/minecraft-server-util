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
		this.samplePlayers = 'players' in data && 'samplePlayers' in data.players ? data.players.samplePlayers : null;
		this.descriptionText = descriptionText;
		this.favicon = 'favicon' in data ? data.favicon : null;
		this.modList = 'modinfo' in data && 'modList' in data.modinfo ? data.modinfo.modList : null;
	}

	getHost() {
		return this.host;
	}

	getPort() {
		return this.port;
	}

	getVersion() {
		return this.version;
	}

	getProtocolVersion() {
		return this.protocolVersion;
	}

	getOnlinePlayers() {
		return this.onlinePlayers;
	}

	getPlayersOnline() {
		return this.onlinePlayers;
	}

	getMaxPlayers() {
		return this.maxPlayers;
	}

	getSamplePlayers() {
		return this.samplePlayers;
	}

	getDescriptionText() {
		return this.descriptionText;
	}

	getFavicon() {
		return this.favicon;
	}

	getModList() {
		return this.modList;
	}
}

module.exports = Response;