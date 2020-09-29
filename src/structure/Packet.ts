import TCPSocket from './TCPSocket';

/**
 * A packet class with utilities for reading and writing from a stream.
 * @class
 */
class Packet {
	/** The buffered data in the packet. */
	public data: number[] = [];

	/**
	 * Automatically read a packet from a stream using the Minecraft 1.7+ format.
	 * @param {TCPSocket} socket The TCP socket to read data from
	 * @returns {Promise<Packet>} The buffered packet with the data
	 * @async
	 */
	static async from(socket: TCPSocket): Promise<Packet> {
		const length = await socket.readVarInt();
		if (length < 1) {
			return new Packet();
		}

		const data = await socket.readBytes(length);

		const packet = new Packet();
		packet.data = data;
		return packet;
	}

	/**
	 * Reads a byte from the packet data
	 * @returns {number} The byte read from the packet
	 */
	readByte(): number {
		if (this.data.length < 1) {
			throw new Error('Cannot readByte() as buffer is empty');
		}

		return this.data.shift() || 0;
	}

	/**
	 * Reads bytes from the packet data
	 * @returns {number[]} The bytes read from the packet
	 */
	readBytes(length: number): number[] {
		if (this.data.length < 1) {
			throw new Error('Cannot readByte() as buffer is empty');
		}

		return this.data.splice(0, length);
	}

	/**
	* Write bytes to the packet data
	* @param {...number[]} values The bytes to write to the packet
	*/
	writeByte(...values: number[]): void {
		this.data.push(...values);
	}

	/**
	 * Reads a short (int16, big-endian) from the packet data
	 * @returns {number} The int16 read from the packet
	 */
	readShortBE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShort() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readInt16BE();
	}

	/**
	 * Writes a short (int16, big-endian) to the packet data
	 * @param {number} value The int16 written to the packet
	 */
	writeShortBE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeInt16BE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a short (int16, little-endian) from the packet data
	 * @returns {number} The int16 read from the packet
	 */
	readShortLE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShortLE() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readInt16LE();
	}

	/**
	 * Writes a short (int16, little-endian) to the packet data
	 * @param {number} value The int16 written to the packet
	 */
	writeShortLE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeInt16LE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a short (uint16, big-endian) from the packet data
	 * @returns {number} The uint16 read from the packet
	 */
	readUShortBE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShort() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readUInt16BE();
	}

	/**
	 * Writes a short (uint16, big-endian) to the packet data
	 * @param {number} value The uint16 written to the packet
	 */
	writeUShortBE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeUInt16BE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a short (uint16, little-endian) from the packet data
	 * @returns {number} The uint16 read from the packet
	 */
	readUShortLE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readUShortLE() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readUInt16LE();
	}

	/**
	 * Writes a short (uint16, little-endian) to the packet data
	 * @returns {number} The uint16 written to the packet
	 */
	writeUShortLE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeUInt16LE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads an int (int32, big-endian) from the packet data
	 * @returns {number} The int32 read from the packet
	 */
	readIntBE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readInt32BE();
	}

	/**
	 * Writes an int (int32, big-endian) to the packet data
	 * @param {number} value The int32 written to the packet
	 */
	writeIntBE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeInt32BE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads an int (int32, little-endian) from the packet data
	 * @returns {number} The int32 read from the packet
	 */
	readIntLE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readInt32LE();
	}

	/**
	 * Writes an int (int32, little-endian) to the packet data
	 * @param {number} value The int32 written to the packet
	 */
	writeIntLE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeInt32LE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads an int (uint32, big-endian) from the packet data
	 * @returns {number} The uint32 read from the packet
	 */
	readUIntBE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readUInt32BE();
	}

	/**
	 * Writes an int (uint32, big-endian) to the packet data
	 * @param {number} value The uint32 written to the packet
	 */
	writeUIntBE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeUInt32BE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads an int (uint32, little-endian) from the packet data
	 * @returns {number} The uint32 read from the packet
	 */
	readUIntLE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readUInt32LE();
	}

	/**
	 * Writes an int (uint32, little-endian) to the packet data
	 * @param {number} value The uint32 written to the packet
	 */
	writeUIntLE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeUInt32LE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a long (int64, big-endian) from the packet data
	 * @returns {number} The int64 read from the packet
	 */
	readLongBE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigInt64BE();
	}

	/**
	 * Writes a long (int64, big-endian) to the packet data
	 * @param {bigint} value The int64 written to the packet
	 */
	writeLongBE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigInt64BE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a long (int64, little-endian) from the packet data
	 * @returns {number} The int64 read from the packet
	 */
	readLongLE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigInt64LE();
	}

	/**
	 * Writes a long (int64, little-endian) to the packet data
	 * @param {bigint} value The int64 written to the packet
	 */
	writeLongLE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigInt64LE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a long (uint64, big-endian) from the packet data
	 * @returns {number} The uint64 read from the packet
	 */
	readULongBE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigUInt64BE();
	}

	/**
	 * Writes a long (uint64, big-endian) to the packet data
	 * @param {bigint} value The uint64 written to the packet
	 */
	writeULongBE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigUInt64BE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a long (uint64, little-endian) from the packet data
	 * @returns {number} The uint64 read from the packet
	 */
	readULongLE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigUInt64LE();
	}

	/**
	 * Writes a long (uint64, little-endian) to the packet data
	 * @param {bigint} value The uint64 written to the packet
	 */
	writeULongLE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigUInt64LE(value);
		this.writeByte(...buf);
	}

	/**
	 * Reads a varint from the packet data
	 * @returns {number} The varint read from the packet
	 */
	readVarInt(): number {
		let numRead = 0;
		let result = 0;
		let read: number, value: number;

		do {
			if (numRead > 4) { throw new Error('VarInt exceeds data bounds'); }

			read = this.readByte();
			value = (read & 0b01111111);
			result |= (value << (7 * numRead));

			numRead++;

			if (numRead > 5) {
				throw new Error('VarInt is too big');
			}
		} while ((read & 0b10000000) != 0);

		return result;
	}

	/**
	 * Writes a varint to the packet data
	 * @param {number} value The varint written to the packet
	 */
	writeVarInt(value: number): void {
		do {
			let temp = value & 0b01111111;

			value >>>= 7;

			if (value != 0) {
				temp |= 0b10000000;
			}

			this.writeByte(temp);
		} while (value != 0);
	}

	/**
	 * Reads a short-prefixed string from the packet data
	 * @returns {string} The string read from the packet
	 */
	readString(): string {
		const length = this.readVarInt();

		return String.fromCodePoint(...this.data.splice(0, length));
	}

	/**
	 * Writes a short-prefixed string to the packet data
	 * @param {string} value The string written to the packet
	 * @param {boolean} writeLength Write the length to the packet
	 */
	writeString(value: string, writeLength: boolean): void {
		if (writeLength) {
			this.writeVarInt(value.length);
		}

		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}
	}

	/**
	 * Reads a null terminated string from the packet data
	 * @returns {string} The string read from the packet
	 */
	readStringNT(): string {
		let read, result = '';

		while ((read = this.readByte()) !== 0) {
			result += String.fromCodePoint(read);
		}

		return result;
	}

	/**
	 * Writes a null terminated string to the packet
	 * @param {string} value The string to write to the packet
	 */
	writeStringNT(value: string): void {
		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}

		this.writeByte(0);
	}
}

export default Packet;