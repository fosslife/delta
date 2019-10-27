/*
 * ShortURL (https://github.com/delight-im/ShortURL)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

/**
 * ShortURL: Bijective conversion between natural numbers (IDs) and short strings
 *
 * ShortURL.encode() takes an ID and turns it into a short string
 * ShortURL.decode() takes a short string and turns it into an ID
 *
 * Features:
 * + large alphabet (51 chars) and thus very short resulting strings
 * + proof against offensive words (removed 'a', 'e', 'i', 'o' and 'u')
 * + unambiguous (removed 'I', 'l', '1', 'O' and '0')
 *
 * Example output:
 * 123456789 <=> pgK8p
 */

'use strict';
function shuffled(str) {
    return str
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');
}

const _alphabet = shuffled(
    '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_'
);
const _base = _alphabet.length;

module.exports = {
    encode: function(num) {
        var str = '';
        while (num > 0) {
            str = _alphabet.charAt(num % _base) + str;
            num = Math.floor(num / _base);
        }
        return str;
    }
};
