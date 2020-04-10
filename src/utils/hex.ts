// Inspiration: https://github.com/golang/go/blob/master/src/encoding/hex/hex.go
/**
 *
 *
 * @class Hex
 * @deprecated
 * This class provides a TypeScript implementation of the Hex format
 */
export class Hex {
  /**
   * Validates wheter or not str is a valid hex string
   * @param {string} str string to validate
   * @returns {boolean} - True or false if the string is hex.
   */
  public static isHex(str: string): boolean {
    const regexp = new RegExp("^[0-9a-fA-F]+$")
    return regexp.test(str)
  }

  /**
   *
   * Encodes an string into an array of bytes. After that using bitwise operations we transform each byte into an hexadecimal value.
   * @param {string} str - string value to be encoded.
   * @returns {string} - Encoded value.
   */
  public static encodeTostring(str: string): string {
    const encoded: string[] = this.encode(str)
    return encoded.join("")
  }

  /**
   *
   *  Decodes hex into an redable string. This function expects that hex contains only hexadecimal characters and that hex has even length.
   * @param {string} hex - Encoded value to be decoded.
   * @returns {string} - Encoded value.
   */
  public static decodeString(hex: string): string {
    let text = ""
    for (let i = 0; i < hex.length; i += 2) {
      text += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    return text
  }
  /**
   *
   *  Validates if a provided network identifier is a valid hex and byte length 32
   * @param {string} str - Network identifier.
   * @returns {boolean} - True or false.
   */
  public static validateNetworkIdentifier(str: string): boolean {
    if (Hex.isHex(str) && Hex.byteLength(str) === 32) {
      return true
    }
    return false
  }

  /**
   *
   *  Validates if a provided address is a valid hex and byte length 20
   * @param {string} str - Address to be verified.
   * @returns {boolean} - True or false.
   */
  public static validateAddress(str: string): boolean {
    if (Hex.isHex(str) && Hex.byteLength(str) === 20) {
      return true
    }
    return false
  }

  /**
   * referenced from https://stackoverflow.com/a/10121740
   * Checks the lenght of a provided string
   * @param {string} str - Provided string.
   * @returns {number} - The string lenght in bytes.
   * @memberof Hex
   */
  public static byteLength(str: string): number {
    const a = []
    for (let i = 0; i < str.length; i += 2) {
      a.push(str.substr(i, 2))
    }
    return a.length
  }

  private static readonly alphabet: string[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
  ]
  /**
   *
   *  Encodes a decoded value.
   * @param {string} str - Decoded value to be encoded.
   * @returns {string[]} - Encoded value.
   */
  private static encode(str: string): string[] {
    const value = this.toByteArray(str)
    const result: string[] = []

    let count = 0
    value.forEach(byte => {
      result[count] = this.alphabet[byte >> 4]
      result[count + 1] = this.alphabet[byte & 0x0f]

      count = count + 2
    })

    return result
  }
  /**
   *
   *  Converts an string to a byte array
   * @param {string} str - string value.
   * @returns {number[]} - Byte array.
   */
  private static toByteArray(str: string): number[] {
    const utf8: number[] = []
    for (let index = 0; index < str.length; index++) {
      let charcode = str.charCodeAt(index)
      if (charcode < 0x80) {
        utf8.push(charcode)
      } else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(
          0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        )
      } else {
        index++
        charcode =
          0x10000 +
          (((charcode & 0x3ff) << 10) |
            (str.charCodeAt(index) & 0x3ff))
        utf8.push(
          0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        )
      }
    }
    return utf8
  }
}
