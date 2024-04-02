import { decrypt, encrypt } from "./"

const INITIALIZATION_VECTOR = "44181697d3fd56b3"
const SALT = "i8u7y6t5r4e3w2q1"

describe("Crypto with 'node-forge'", () => {
  console.info(
    `Encryption/Decryption only works when 'NEXT_PUBLIC_ENCRYPT_SECRETS' is set to 'true'. And 'NEXT_PUBLIC_CRYPTOGRAPH_IV' needs to be set to a random string, else only one way encryption will work with random initialization vector, thus it cannot be decrypted. \n\nCurrent NEXT_PUBLIC_ENCRYPT_SECRETS value: ${process.env.NEXT_PUBLIC_ENCRYPT_SECRETS}\nCurrent NEXT_PUBLIC_CRYPTOGRAPH_IV value : ${process.env.NEXT_PUBLIC_CRYPTOGRAPH_IV}`
  )

  describe("without custom initialization vector", () => {
    it("encrypt & decrypt a string", () => {
      const { encrypted } = encrypt({ data: "test" })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toEqual("test")
    })

    it("encrypt & decrypt a number", () => {
      const { encrypted } = encrypt({ data: 123456789 })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toEqual("123456789")
    })

    it("encrypt & decrypt a bigint", () => {
      const { encrypted } = encrypt({ data: BigInt(123456789) })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toEqual("123456789")
    })

    it("encrypt & decrypt a boolean", () => {
      const { encrypted } = encrypt({ data: JSON.stringify(true) })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toEqual("true")
    })

    it("encrypt & decrypt a null", () => {
      const { encrypted } = encrypt({ data: JSON.stringify(null) })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toEqual("null")
    })

    it("encrypt & decrypt a object", () => {
      const object = JSON.stringify({ test: "test", nested: { test: "nested test" } })
      const { encrypted } = encrypt({ data: object })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toStrictEqual(object)
    })

    it("encrypt & decrypt a array", () => {
      const array = JSON.stringify(["test", ["nested test"]])
      const { encrypted } = encrypt({ data: array })
      const { decrypted } = decrypt({ encryptedText: encrypted })

      expect(decrypted).toStrictEqual(array)
    })

    it("encrypt & decrypt a array of objects with salt", () => {
      const array = JSON.stringify([{ test: "test" }, { nested: { test: "nested test" } }])
      const { encrypted } = encrypt({ data: array, salt: SALT })
      const { decrypted } = decrypt({ encryptedText: encrypted, salt: SALT })

      expect(decrypted).toStrictEqual(array)
    })
  })

  describe("with custom initialization vector", () => {
    it("encrypt & decrypt a string", () => {
      const { encrypted, initializationVector } = encrypt({
        data: "test",
        initializationVector: INITIALIZATION_VECTOR,
      })

      expect(encrypted).toEqual("a59652bc57a915c3") // * this value will change if NEXT_PUBLIC_CRYPTOGRAPH_IV is changed, adjust the value if changed

      const { decrypted } = decrypt({
        encryptedText: encrypted,
        initializationVector,
      })

      expect(decrypted).toEqual("test")
    })

    it("encrypt & decrypt a number", () => {
      const { encrypted, initializationVector } = encrypt({
        data: 123456789,
        initializationVector: INITIALIZATION_VECTOR,
      })

      expect(encrypted).toEqual("7ad1a2e920acdb1a61b81c2d61484b96") // * this value will change if NEXT_PUBLIC_CRYPTOGRAPH_IV is changed, adjust the value if changed

      const { decrypted } = decrypt({
        encryptedText: encrypted,
        initializationVector,
      })

      expect(decrypted).toEqual("123456789")
    })

    it("encrypt & decrypt a array of objects with salt", () => {
      const array = JSON.stringify([{ test: "test" }, { nested: { test: "nested test" } }])
      const { encrypted, initializationVector } = encrypt({
        data: array,
        initializationVector: INITIALIZATION_VECTOR,
        salt: SALT,
      })

      expect(encrypted).toEqual(
        "6f4a693c57c7bdfd0012b80cc1c4a843f57c3120c49f1832f7df60ab03815507beed54d8b804b5a41aff1f58731306f5f4b2d36a31713b11"
      ) // * this value will change if NEXT_PUBLIC_CRYPTOGRAPH_IV is changed, adjust the value if changed

      const { decrypted } = decrypt({
        encryptedText: encrypted,
        initializationVector,
        salt: SALT,
      })

      expect(decrypted).toStrictEqual(array)
    })
  })
})
