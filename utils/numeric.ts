export function _sliceNumber(_n: bigint, _nbits: bigint, _offset: bigint) {

    // mask is made by shifting left an offset number of times
    let mask = (2n ** _nbits - 1n) << _offset;
    // AND n with mask, and trim to max of _nbits bits
    return (_n & mask) >> _offset;
}

export function _get5Bits(_input: bigint, _slot: bigint) {
    return _sliceNumber(_input, 5n, _slot * 5n);
}

export function decode(_characters: bigint, level: bigint) {
    let totalparts = level + 4n;
    let traits = Array(totalparts);
    let i;
    for (i = 0; i < totalparts; i++) {
        traits[i] = _get5Bits(_characters, BigInt(i)) % 16n;
    }
    return traits;
}

export function encode(_traits: bigint[], level: number) {
    let totalparts = level + 4;
    let _characters = 0n;
    for (let i = 0; i < totalparts; i++) {
        _characters = _characters << 5n;
        // bitwise OR trait with _characters
        _characters = _characters | _traits[(totalparts - 1) - i];
    }
    return _characters;
}