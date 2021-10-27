import ansi, { CSPair } from 'ansi-styles';

const formattingCode = /\u00C2?\u00A7([a-fklmnor0-9])/g;

const ansiMap = new Map<string, CSPair>();
ansiMap.set('0', ansi.black);
ansiMap.set('1', ansi.blue);
ansiMap.set('2', ansi.green);
ansiMap.set('3', ansi.cyan);
ansiMap.set('4', ansi.red);
ansiMap.set('5', ansi.magenta);
ansiMap.set('6', ansi.yellow);
ansiMap.set('7', ansi.gray);
ansiMap.set('8', ansi.blackBright);
ansiMap.set('9', ansi.blueBright);
ansiMap.set('a', ansi.greenBright);
ansiMap.set('b', ansi.cyanBright);
ansiMap.set('c', ansi.redBright);
ansiMap.set('d', ansi.magentaBright);
ansiMap.set('e', ansi.yellowBright);
ansiMap.set('f', ansi.whiteBright);
ansiMap.set('k', ansi.reset);
ansiMap.set('l', ansi.bold);
ansiMap.set('m', ansi.strikethrough);
ansiMap.set('n', ansi.underline);
ansiMap.set('o', ansi.italic);
ansiMap.set('r', ansi.reset);

const htmlElementMap = new Map<string, string>();
htmlElementMap.set('0', '<span style="color: #000000;">');
htmlElementMap.set('1', '<span style="color: #0000AA;">');
htmlElementMap.set('2', '<span style="color: #00AA00;">');
htmlElementMap.set('3', '<span style="color: #00AAAA;">');
htmlElementMap.set('4', '<span style="color: #AA0000;">');
htmlElementMap.set('5', '<span style="color: #AA00AA;">');
htmlElementMap.set('6', '<span style="color: #FFAA00;">');
htmlElementMap.set('7', '<span style="color: #AAAAAA;">');
htmlElementMap.set('8', '<span style="color: #555555;">');
htmlElementMap.set('9', '<span style="color: #5555FF;">');
htmlElementMap.set('a', '<span style="color: #55FF55;">');
htmlElementMap.set('b', '<span style="color: #55FFFF;">');
htmlElementMap.set('c', '<span style="color: #FF5555;">');
htmlElementMap.set('d', '<span style="color: #FF55FF;">');
htmlElementMap.set('e', '<span style="color: #FFFF55;">');
htmlElementMap.set('f', '<span style="color: #FFFFFF;">');
htmlElementMap.set('k', '<span className="minecraft-formatting-obfuscated">');
htmlElementMap.set('l', '<span style="font-weight: bold;">');
htmlElementMap.set('m', '<span style="text-decoration: line-through;">');
htmlElementMap.set('n', '<span className="text-decoration: underline;">');
htmlElementMap.set('o', '<span className="font-style: italic;">');

/**
 * The result of the formatted description of the server.
 * @class
 */
class Description {
	/** The description text as a string. */
	public descriptionText: string;

	/**
	 * Creates a new description class from the text.
	 * @param {string} descriptionText The MOTD text
	 * @constructor
	 */
	constructor(descriptionText: string) {
		this.descriptionText = descriptionText;
	}

	/**
	 * Converts the MOTD into a string format
	 * @returns {string} The string format of the MOTD
	 */
	toString(): string {
		return this.descriptionText;
	}

	/**
	 * Converts the MOTD into a string format without any formatting
	 * @returns {string} The MOTD string without formatting
	 */
	toRaw(): string {
		return this.descriptionText.replace(formattingCode, '');
	}

	/**
	 * Converts the special formatting characters to ANSI escape codes, commonly used for terminal formatting
	 * @returns {string} The ANSI escaped formatting text
	 */
	toANSI(): string {
		return this.descriptionText.replace(formattingCode, (match: string, p1: string): string => {
			const value = ansiMap.get(p1);

			if (!value) return ansi.reset.open;

			return value.open;
		}) + ansi.reset.open;
	}

	/**
	 * Converts the description into HTML code.
	 * @returns {string} The HTML description
	 */
	toHTML(): string {
		let description = this.toString();

		let result = '<span>';
		let tagsOpen = 1;
		let bold = false, italics = false, underline = false, strikethrough = false, obfuscated = false, color = 'r';

		while (description.length > 0) {
			const char = description.charAt(0);

			if (char == '\u00A7') {
				const charCode = description.charAt(1).toLowerCase();

				description = description.substr(2);

				const element = htmlElementMap.get(charCode);

				switch (charCode) {
					case 'k': {
						if (obfuscated) continue;

						result += element;
						obfuscated = true;
						tagsOpen++;

						break;
					}
					case 'l': {
						if (bold) continue;

						result += element;
						bold = true;
						tagsOpen++;

						break;
					}
					case 'm': {
						if (strikethrough) continue;

						result += element;
						strikethrough = true;
						tagsOpen++;

						break;
					}
					case 'n': {
						if (underline) continue;

						result += element;
						underline = true;
						tagsOpen++;

						break;
					}
					case 'o': {
						if (italics) continue;

						result += element;
						italics = true;
						tagsOpen++;

						break;
					}
					case 'r': {
						bold = false;
						strikethrough = false;
						underline = false;
						italics = false;
						obfuscated = false;

						while (tagsOpen > 1) {
							result += '</span>';

							tagsOpen--;
						}

						break;
					}
					default: {
						if (color === charCode) continue;

						while (tagsOpen > 1) {
							result += '</span>';

							tagsOpen--;
						}

						obfuscated = false;
						bold = false;
						underline = false;
						strikethrough = false;
						italics = false;

						result += element;
						color = charCode;
						tagsOpen++;

						break;
					}
				}
			} else {
				description = description.substr(1);

				result += char;
			}
		}

		for (let i = 0; i < tagsOpen; i++) {
			result += '</span>';
		}

		return result;
	}
}

export default Description;