import { promises as fs } from 'fs';

/**
 * A utility class for converting a server's favicon into various formats.
 * @class
 */
class Favicon {
	private text: string;

	/**
	 * Creates a new Favicon class
	 * @param text The raw favicon data returned from the server
	 */
	constructor(text: string) {
		this.text = text;
	}

	/**
	 * Returns the raw favicon data from the server
	 * @returns {string} Raw favicon data
	 */
	toString(): string {
		return this.text;
	}

	/**
	 * Gets the data from the favicon and returns it as a buffer
	 * @returns {Buffer} The data buffer
	 */
	toBuffer(): Buffer {
		return Buffer.from(this.text.split(';base64,')[1], 'base64');
	}

	/**
	 * Writes the favicon to a file, typically a PNG
	 * @param {string} path The path to write the image to
	 * @returns {Promise<void>}
	 */
	writeToFile(path: string): Promise<void> {
		return fs.writeFile(path, this.toBuffer());
	}
}

export default Favicon;