import { SRVRecord } from './SRVRecord';

export interface JavaStatusResponse {
	version: {
		name: string,
		protocol: number
	},
	players: {
		online: number,
		max: number,
		sample: {
			name: string,
			id: string
		}[] | null
	},
	motd: {
		raw: string,
		clean: string,
		html: string
	},
	favicon: string | null,
	srvRecord: SRVRecord | null,
	roundTripLatency: number
}