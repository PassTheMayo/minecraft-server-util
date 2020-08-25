export function getVarIntSize(value: number): number {
    let size = 0;

    do {
        value >>>= 7;

        size++;
    } while (value != 0);

    return size;
}