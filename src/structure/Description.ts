import ansi from 'ansi-styles';

const formattingCode = /\u00C2?\u00A7([a-fklmnor0-9])/g;

const chalkMap = new Map<string, ansi.CSPair>();
chalkMap.set('0', ansi.black);
chalkMap.set('1', ansi.blue);
chalkMap.set('2', ansi.green);
chalkMap.set('3', ansi.cyan);
chalkMap.set('4', ansi.red);
chalkMap.set('5', ansi.magenta);
chalkMap.set('6', ansi.yellow);
chalkMap.set('7', ansi.gray);
chalkMap.set('8', ansi.blackBright);
chalkMap.set('9', ansi.blueBright);
chalkMap.set('a', ansi.greenBright);
chalkMap.set('b', ansi.cyanBright);
chalkMap.set('c', ansi.redBright);
chalkMap.set('d', ansi.magentaBright);
chalkMap.set('e', ansi.yellowBright);
chalkMap.set('f', ansi.whiteBright);
chalkMap.set('k', ansi.reset);
chalkMap.set('l', ansi.bold);
chalkMap.set('m', ansi.strikethrough);
chalkMap.set('n', ansi.underline);
chalkMap.set('o', ansi.italic);
chalkMap.set('r', ansi.reset);

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
			const value = chalkMap.get(p1);

			if (!value) return ansi.reset.open;

			return value.open;
		}) + ansi.reset.open;
	}

	// TODO implement coercing to HTML string
}

export default Description;