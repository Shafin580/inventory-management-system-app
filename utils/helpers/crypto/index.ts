import forge from "node-forge"

/**
 * @description Encrypts a string, number, bigint, boolean, null, object or array.
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */
export const encrypt = ({
  data,
  initializationVector = false,
  salt = "",
}: {
  data: string | number | bigint
  initializationVector?: false | string
  salt?: string
}) => {
  if (process.env.NEXT_PUBLIC_ENCRYPT_SECRETS === "false") {
    return {
      encrypted: data.toString(),
    }
  }

  const customInitializationVector = initializationVector
    ? initializationVector
    : process.env.NEXT_PUBLIC_CRYPTOGRAPH_IV!
  const cipher = forge.rc2.createEncryptionCipher(salt)

  cipher.start(customInitializationVector)
  cipher.update(forge.util.createBuffer(data.toString()))
  cipher.finish()

  return {
    encrypted: cipher.output.toHex(),
    ...(initializationVector ? { initializationVector: customInitializationVector } : {}),
  }
}

/**
 * @description Decrypts a string, number, bigint, boolean, null, object or array. If decryption fails, it will return null as decrypted value. If decryption is successful, it will return decrypted value as string. If you want to get the decrypted value as number, bigint, boolean, null, object or array, you need to parse it yourself. For example, if you want to get the decrypted value as number, you need to parse it like this: `Number(decrypted)`. If you want to get the decrypted value as bigint, you need to parse it like this: `BigInt(decrypted)`. If you want to get the decrypted value as object, array, boolean, or null you need to parse it like this: `JSON.parse(decrypted)`.
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */
export const decrypt = ({
  encryptedText,
  initializationVector = process.env.NEXT_PUBLIC_CRYPTOGRAPH_IV!,
  salt = "",
}: {
  encryptedText: string | number | bigint
  initializationVector?: string
  salt?: string
}) => {
  if (process.env.NEXT_PUBLIC_ENCRYPT_SECRETS === "false") {
    return {
      decrypted: encryptedText.toString(),
    }
  }

  try {
    const decipher = forge.rc2.createDecryptionCipher(salt)

    decipher.start(initializationVector)
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedText.toString())))
    decipher.finish()

    return {
      decrypted: decipher.output.data,
    }
  } catch (error) {
    console.error("Decryption failed:", error)
    return {
      decrypted: null,
    }
  }
}
