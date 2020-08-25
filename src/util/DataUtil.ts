import assert from 'assert';
import { SrvResponse } from './ResolveSRV';
import { Response } from '../model/api';
import { Result } from '../model/internal';

const colorCodes: {[key: string]: string | number} = {
    black: 0,
    dark_blue: 1,
    dark_green: 2,
    dark_aqua: 3,
    dark_red: 4,
    dark_purple: 5,
    gold: 6,
    gray: 7,
    dark_gray: 8,
    blue: 9,
    green: 'a',
    aqua: 'b',
    red: 'c',
    light_purple: 'd',
    yellow: 'e',
    white: 'f'
};

const formatCodes: {[key: string]: string} = {
    obfuscated: 'k',
    bold: 'l',
    strikethrough: 'm',
    underline: 'n',
    italic: 'o',
    reset: 'r'
};

interface Description {
    color: string
    text: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extra?: any[]
}

export function verifyHost(host: string): void {
    assert(typeof host === 'string', `Host must be a string, got ${typeof host}`);
    assert(host.length > 0, `Host.length must be greater than zero, got ${host.length}`);
}

export function verifyPort(port: number): void {
    assert(typeof port === 'number', `Port must be a number got ${typeof port}`);
    assert(Number.isInteger(port), `Port must be an integer, got ${port}`);
    assert(port > 0, `Expected port > 0, got ${port}`);
    assert(port < 65536, `Expected port < 65536, got ${port}`);
}

export function parseDescription(description: string | Description): string {
    assert(typeof description === 'object' || typeof description === 'string', 'Expected object or string, got ' + (typeof description));

    if (typeof description === 'string') {
        return description;
    }

    let result = '';

    if (description.color) {
        if (description.color in colorCodes || description.color in formatCodes) {
            result += '\u00A7' + (colorCodes[description.color] || formatCodes[description.color]);
        }
    }

    for (const prop in description) {
        if (prop in formatCodes) {
            result += '\u00A7' + formatCodes[prop];
        }
    }

    result += description.text || '';

    if (Object.prototype.hasOwnProperty.call(description, 'extra') && description.extra!.constructor === Array) {
        for (let i = 0; i < description.extra.length; i++) {
            console.log(description.extra[i]);
            result += description.extra[i];
        }
    }

    return result;
}

export function formatResult(host: string, port: number, srvRecord: SrvResponse | undefined, result: Result): Response {
    verifyHost(host);
    verifyPort(port);
    assert(typeof srvRecord === 'object' || srvRecord == null, `Expected object or null, got ${typeof srvRecord}`);
    assert(typeof result === 'object', `Expected object, got ${typeof result}`);

    const version = result.version?.name;
    const protocolVersion = result.version?.protocol;
    const onlinePlayers = result.players?.online;
    const maxPlayers = result.players?.max;
    const samplePlayers = result.players?.sample;
    const descriptionText = result.description != null ? parseDescription(result.description) : undefined;
    const favicon = result.favicon;
    const modList = result.modinfo?.modList;

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
        modList
    };
}
