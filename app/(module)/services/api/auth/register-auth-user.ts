import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

export interface CreateAuthUserParams {
  email: string
  password: string
}

/**
 * Creates a new auth user
 */
export const createAuthUser = async ({ email, password }: CreateAuthUserParams) => {
  try {
    const { status_code, user, token, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.REGISTER.root,
      "",
      "POST",
      JSON.stringify({ email: email, password: password })
    )

    if (status_code < 201 || status_code >= 400) {
      throw Error("Failed to Create Auth User", { cause: status_code })
    }

    return { status_code : Number(status_code), message: String(message) }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
