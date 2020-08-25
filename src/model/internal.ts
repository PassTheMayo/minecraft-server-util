import { SamplePlayer } from './api';

export interface Result {
    version?: {
        name?: string
        protocol?: number
    }
    players?: {
        online?: number
        max?: number
        sample?: SamplePlayer[]
    }
    description?: string
    favicon?: string
    modinfo?: {
        modList?: {
            modid: string
            version: string
        }[]
    }
}