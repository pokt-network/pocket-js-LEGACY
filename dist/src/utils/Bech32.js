"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
// Inspiration: https://github.com/btcsuite/btcutil/tree/master/bech32
/**
 *
 *
 * @class Bech32
 * @deprecated
 * This class provides a TypeScript implementation of the bech32 format specified in BIP 173 --> https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki.
 */
var Bech32 = /** @class */ (function () {
    /**
     * Creates an instance of Bech32.
     * Fill in the alphabet map with the possible characters that the encrypted text will have
     */
    function Bech32() {
        var _this = this;
        this.alphabet = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
        this.alphabetMap = new Map();
        var index = 0;
        var alphabetArray = this.alphabet.split(/(?=[\s\S])/u);
        alphabetArray.forEach(function (letter) {
            if (_this.alphabetMap.has(letter)) {
                throw new TypeError(letter + " is ambiguous");
            }
            _this.alphabetMap.set(letter, index);
            index++;
        });
    }
    /**
     *
     *  Encodes a byte slice into a bech32 string with the human-readable part hrb. Note that the bytes must each encode 5 bits(base32).
     * @param {String} hrp - Prefix value.
     * @param {String} str - String to be encoded.
     * @returns {String} - Encoded value.
     */
    Bech32.prototype.encode = function (hrp, str) {
        var _this = this;
        var bytes = this.toBytes(str);
        if (hrp.length + 7 + bytes.length > 90) {
            throw new TypeError("Exceeds length limit");
        }
        var lowerHrp = hrp.toLowerCase();
        var checksum = this.verifyChecksum(lowerHrp);
        var result = lowerHrp + "1";
        bytes.forEach(function (byte) {
            if (byte >> 5 !== 0) {
                throw new TypeError("Non 5-bit word");
            }
            checksum = _this.convertBits(checksum) ^ byte;
            result += _this.alphabet.charAt(byte);
        });
        for (var index = 0; index < 6; ++index) {
            checksum = this.convertBits(checksum);
        }
        checksum ^= 1;
        for (var index = 0; index < 6; ++index) {
            var encodedValue = (checksum >> ((5 - index) * 5)) & 0x1f;
            result += this.alphabet.charAt(encodedValue);
        }
        return result;
    };
    /**
     *
     * Decodes a bech32 encoded string, returning the human-readable part and the data part excluding the checksum.
     * @param {String} str - String to be decoded.
     */
    Bech32.prototype.decode = function (str) {
        if (str.length < 8) {
            throw new TypeError(str + " too short");
        }
        if (str.length > 90) {
            throw new TypeError("Exceeds length limit");
        }
        if (str !== str.toLowerCase() && str !== str.toUpperCase()) {
            throw new TypeError("Mixed-case string");
        }
        var strLower = str.toLowerCase();
        var split = strLower.lastIndexOf("1");
        if (split === -1) {
            throw new TypeError("No separator character for " + strLower);
        }
        if (split === 0) {
            throw new TypeError("Missing hrp for " + strLower);
        }
        var hrp = strLower.slice(0, split);
        var bytesChars = strLower.slice(split + 1);
        if (bytesChars.length < 6) {
            throw new TypeError("Data too short");
        }
        var checksum = this.verifyChecksum(hrp);
        var bytes = [];
        for (var index = 0; index < bytesChars.length; ++index) {
            var byte = bytesChars.charAt(index);
            var value = this.alphabetMap.get(byte);
            if (value === undefined) {
                throw new TypeError("Unknown character " + byte);
            }
            checksum = this.convertBits(checksum) ^ value;
            if (index + 6 >= bytesChars.length) {
                continue;
            }
            bytes.push(value);
        }
        if (checksum !== 1) {
            throw new TypeError("Invalid checksum for " + str);
        }
        return { hrp: hrp, bytes: bytes };
    };
    /**
     *
     * In this function we realize the checksum calculation. For more details on the checksum calculation, please refer to BIP 173.
     * @param {String} hrp - Prefix used to generate the checksum value.
     * @returns {Number} - Checksum.
     */
    Bech32.prototype.verifyChecksum = function (hrp) {
        var _this = this;
        var checksum = 1;
        var hrpArray = hrp.split(/(?=[\s\S])/u);
        hrpArray.forEach(function (char) {
            var charCode = char.charCodeAt(0);
            if (charCode < 33 || charCode > 126) {
                throw new TypeError("Invalid hrp: " + hrp);
            }
            checksum = _this.convertBits(checksum) ^ (charCode >> 5);
        });
        checksum = this.convertBits(checksum);
        hrpArray.forEach(function (char) {
            var charCode = char.charCodeAt(0);
            checksum = _this.convertBits(checksum) ^ (charCode & 0x1f);
        });
        return checksum;
    };
    /**
     *
     * Converts each character in the string 'chars' to the value of the index of the correspoding character in 'charset'
     * @param {String} str - String from where we are going to extract the bytes value.
     * @returns {[Number]} - Array of bytes.
     */
    Bech32.prototype.toBytes = function (str) {
        var bytes = buffer_1.Buffer.from(str, "utf8");
        var maxValue = (1 << 5) - 1;
        var value = 0;
        var bits = 0;
        var result = [];
        for (var index = 0; index < bytes.length; ++index) {
            value = (value << 8) | bytes[index];
            bits += 8;
            while (bits >= 5) {
                bits -= 5;
                result.push((value >> bits) & maxValue);
            }
        }
        if (bits > 0) {
            result.push((value << (5 - bits)) & maxValue);
        }
        return result;
    };
    /**
     *
     * In this function we realize the polymod calculation. For more details on the polymod calculation, please refer to BIP 173.
     * @param {Number} checksum - Checksum. We need to execute multiple arithmetic right shifts to generate the proper encoded value
     * @returns {Number} - Checksum.
     */
    Bech32.prototype.convertBits = function (checksum) {
        var byte = checksum >> 25;
        return (((checksum & 0x1ffffff) << 5) ^
            (-((byte >> 0) & 1) & 0x3b6a57b2) ^
            (-((byte >> 1) & 1) & 0x26508e6d) ^
            (-((byte >> 2) & 1) & 0x1ea119fa) ^
            (-((byte >> 3) & 1) & 0x3d4233dd) ^
            (-((byte >> 4) & 1) & 0x2a1462b3));
    };
    return Bech32;
}());
exports.Bech32 = Bech32;
//# sourceMappingURL=Bech32.js.map