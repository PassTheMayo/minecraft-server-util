import { Chat } from './Chat';

interface ModInfo {
	type: string,
	modList: {
		modid: string,
		version: string
	}[]
}

interface RawResponse {
	version?: {
		name?: string,
		protocol?: number
	},
	players?: {
		max?: number,
		online?: number,
		sample?: {
			name: string,
			id: string
		}[]
	},
	description?: Chat | string,
	favicon?: string,
	modinfo?: ModInfo
}

export { RawResponse, ModInfo };