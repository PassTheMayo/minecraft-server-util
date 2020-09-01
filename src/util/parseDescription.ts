import Description from '../structure/Description';

type ColorCode =
	| 'black'
	| 'dark_blue'
	| 'dark_green'
	| 'dark_aqua'
	| 'dark_red'
	| 'dark_purple'
	| 'gold'
	| 'gray'
	| 'dark_gray'
	| 'blue'
	| 'green'
	| 'aqua'
	| 'red'
	| 'light_purple'
	| 'yellow'
	| 'white';

type FormatCode =
	| 'obfuscated'
	| 'bold'
	| 'strikethrough'
	| 'underline'
	| 'italic'
	| 'reset';

interface Chat {
	text?: string,
	bold?: 'true' | 'false',
	italic?: 'true' | 'false',
	underlined?: 'true' | 'false',
	strikethrough?: 'true' | 'false',
	obfuscated?: 'true' | 'false',
	color?: ColorCode | FormatCode,
	extra?: Chat[]
}

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

const colorCodes = {
	black: '0',
	dark_blue: '1',
	dark_green: '2',
	dark_aqua: '3',
	dark_red: '4',
	dark_purple: '5',
	gold: '6',
	gray: '7',
	dark_gray: '8',
	blue: '9',
	green: 'a',
	aqua: 'b',
	red: 'c',
	light_purple: 'd',
	yellow: 'e',
	white: 'f'
};

const formatCodes = {
	obfuscated: 'k',
	bold: 'l',
	strikethrough: 'm',
	underline: 'n',
	italic: 'o',
	reset: 'r'
};

function parseDescription(description: Chat | string): Description {
	if (typeof description === 'string') return new Description(description);

	let result = '';

	if ('color' in description && typeof description.color !== 'undefined') {
		if (Object.prototype.hasOwnProperty.call(colorCodes, description.color)) {
			// @ts-ignore
			result += '\u00A7' + colorCodes[description.color];
		} else if (Object.prototype.hasOwnProperty.call(formatCodes, description.color)) {
			// @ts-ignore
			result += '\u00A7' + formatCodes[description.color];
		}
	}

	for (const prop in Object.getOwnPropertyNames(description)) {
		if (Object.prototype.hasOwnProperty.call(formatCodes, prop)) {
			// @ts-ignore
			result += '\u00A7' + formatCodes[prop];
		}
	}

	result += description.text || '';

	if (Object.prototype.hasOwnProperty.call(description, 'extra') && typeof description.extra !== 'undefined' && description.extra.constructor === Array) {
		for (let i = 0; i < description.extra.length; i++) {
			console.log(description.extra[i]);

			result += parseDescription(description.extra[i]);
		}
	}

	return new Description(result);
}

export { RawResponse, Chat, ColorCode, FormatCode, ModInfo };
export default parseDescription;