const assert = require('assert');

const colorCodes = {
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

const formatCodes = {
	obfuscated: 'k',
	bold: 'l',
	strikethrough: 'm',
	underline: 'n',
	italic: 'o',
	reset: 'r'
};

module.exports = (description) => {
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

	if (Object.prototype.hasOwnProperty.call(description, 'extra') && description.constructor === Array) {
		for (let i = 0; i < description.extra.length; i++) {
			console.log(description.extra[i]);

			result += this.call(null, description.extra[i]);
		}
	}

	return result;
};