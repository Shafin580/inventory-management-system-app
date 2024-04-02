import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"


export interface LoginUserParams {
  email: string
  password: string
}

/**
 * Creates a new intervention
 */
export const loginAuthUser = async ({ email, password }: LoginUserParams) => {
  try {
    const { status_code, user, token, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.LOGIN.root,
      "",
      "POST",
      JSON.stringify({ email: email, password: password })
    )

    if (status_code < 200 || status_code >= 400) {
      return { status_code: status_code, message: message }
    }

    return { status_code, user, token }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
