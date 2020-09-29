const formattingCode = /§[a-fklmnor0-9]/g;

/**
 * The result of the formatted description of the server.
 * @class
 */
class Description {
	/** The description text as a string. */
	public descriptionText: string;

	/**
	 * Creates a new description class from the text.
	 * @param descriptionText The MOTD text
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

	// TODO implement coercing to HTML string
}

export default Description;