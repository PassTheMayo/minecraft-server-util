export interface ParsedAddress {
	host: string,
	port: number
}

const addressMatch = /^([^:]+)(?::(\d{1,5}))?$/;

export function parseAddress(value: string, defaultPort = 25565): ParsedAddress | null {
	const match = value.match(addressMatch);
	if (!match) return null;

	const port = match[2] ? parseInt(match[2]) : defaultPort;
	if (isNaN(port) || port < 1 || port > 65535) return null;

	return {
		host: match[1],
		port
	};
}