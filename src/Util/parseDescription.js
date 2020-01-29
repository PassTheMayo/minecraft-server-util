const colorCodes = {
	'black': 0,
	'dark_blue': 1,
	'dark_green': 2,
	'dark_aqua': 3,
	'dark_red': 4,
	'dark_purple': 5,
	'gold': 6,
	'gray': 7,
	'dark_gray': 8,
	'blue': 9,
	'green': 'a',
	'aqua': 'b',
	'red': 'c',
	'light_purple': 'd',
	'yellow': 'e',
	'white': 'f'
};

module.exports = (description) => {
	if (typeof description !== 'object' && typeof description !== 'string') throw new Error('description must be an object or string, got ' + typeof description);

	let result = '';

	if (typeof description === 'string') {
		result = description;
	} else if (typeof description === 'object') {
		if (Object.keys(description).length === 1 && Object.prototype.hasOwnProperty.call(description, 'text')) {
			result = description.text;
		} else {
			result = description.text || '';

			if (Object.prototype.hasOwnProperty.call(description, 'extra')) {
				for (let i = 0; i < description.extra.length; i++) {
					const extra = description.extra[i];

					if (extra.color) {
						result += '\u00A7' + colorCodes[extra.color];
					}

					if (extra.obfuscated) {
						result += '\u00A7k';
					}

					if (extra.bold) {
						result += '\u00A7l';
					}

					if (extra.strikethrough) {
						result += '\u00A7m';
					}

					if (extra.underline) {
						result += '\u00A7n';
					}

					if (extra.italic) {
						result += '\u00A7o';
					}

					if (extra.reset) {
						result += '\u00A7r';
					}

					result += extra.text || '';
				}
			}
		}
	}

	return result;
};