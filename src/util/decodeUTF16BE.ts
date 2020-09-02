import assert from 'assert';

function decodeUTF16BE(value: string): string {
    assert(value.length % 2 === 0, 'Expected UTF-16 string length to be a multiple of 2, got ' + value.length);

    const result = [];

    for (let i = 0; i < value.length; i += 2) {
        result.push(((value.charCodeAt(i) << 8) & 0xFF) | (value.charCodeAt(i + 1) & 0xFF));
    }

    return String.fromCharCode(...result);
}

export default decodeUTF16BE;