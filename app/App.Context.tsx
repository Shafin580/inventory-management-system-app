"use client"

import { removeAllCookies } from "@utils/helpers/misc"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { ReactNode, createContext, useCallback, useEffect, useState } from "react"
import { decrypt, encrypt } from "@utils/helpers/crypto"
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies"
import { AppLoader, AppLoaderProps } from "@components/AppLoader"

/**
 * A variable that controls encryption of the sensitive info on production environment
 */
const ENCRYPT_SECRETS =
  process.env.NEXT_PUBLIC_ENCRYPT_SECRETS == "true" ?? process.env.NODE_ENV === "production"

// + cookie key constants
const TOKEN_COOKIE_KEY = "token"
const USER_INFO_COOKIE_KEY = "user-info"
/**
 * Initialization vector for the user info cookie used during decryption
 */
const USER_INFO_IV_COOKIE_KEY = "user-info-iv"

/**
 * All the mandatory cookies that should be present in order to use the application.
 * Used in middleware for checking if the user is logged in or not and for logging out the user.
 * @file AppContext.tsx
 */
export const MANDATORY_COOKIES = [
  TOKEN_COOKIE_KEY,
  USER_INFO_COOKIE_KEY,
  // mandatory if encryption is enabled
  ...(ENCRYPT_SECRETS ? ([USER_INFO_IV_COOKIE_KEY] as const) : ([] as const)),
] as const

// + User info properties
export interface UserInfoContextProps {
  id: number
  email: string
  username: string
}

// + App context properties
interface AppContextProps {
  /**
   * Site URL for the application
   * @example https://merlinapp.co.uk
   */
  SITE_URL: string
  token: string | null
  userInfo: UserInfoContextProps | null
  login: (token: string, userInfo: UserInfoContextProps) => void
  logout: () => void
  updateLoadingStatus: (status: boolean, text?: string) => void
}

// + create context with default values
export const AppContext = createContext<AppContextProps>({
  SITE_URL: "",
  token: null,
  userInfo: null,
  login: function (token: string, userInfo: UserInfoContextProps): void {
    throw new Error("Function not implemented.")
  },
  logout: function (): void {
    throw new Error("Function not implemented.")
  },
  updateLoadingStatus: function (status: boolean, text?: string | undefined): void {
    throw new Error("Function not implemented.")
  },
})

// + context provider
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname()
  const [userToken, updateContextUserToken] = useState<AppContextProps["token"]>(null)
  const [userInfo, updateContextUserInfo] = useState<AppContextProps["userInfo"]>(null)

  // + login function
  /**
   * Login function that sets the required data to the context and storages; routes
   * following the redirect URl
   */
  const login: AppContextProps["login"] = (token, userInfo) => {

    // + set the storages
    Cookies.set(TOKEN_COOKIE_KEY, token)
    localStorage.setItem("sidebar-open", "true")

    // @ts-expect-error
    const { modules, ...rest } = userInfo

    if (ENCRYPT_SECRETS) {
      const encryptedUserInfo = encrypt({
        data: JSON.stringify(rest),
        initializationVector: Math.random().toString(36).substring(2),
        salt: token,
      })

      Cookies.set(USER_INFO_COOKIE_KEY, encryptedUserInfo.encrypted)
      Cookies.set(USER_INFO_IV_COOKIE_KEY, encryptedUserInfo.initializationVector!)
    } else {
      // + storage handling if encryption is disabled
      Cookies.set(USER_INFO_COOKIE_KEY, JSON.stringify(userInfo))
    }

    updateContextUserToken(token)
    updateContextUserInfo(userInfo)
  }

  // + logout function
  /**
   * Logout function that clears the cookies, resets the states, and redirect to the login page
   */
  const logout: AppContextProps["logout"] = () => {
    updateContextUserToken(null)
    updateContextUserInfo(null)

    // remove every browser storage
    removeAllCookies()
    localStorage.clear()
    sessionStorage.clear()

    // router.push("/")
    location.href = "/"
  }
  // * loader states
  const [loadingSpinnerVisibility, updateLoadingSpinnerVisibility] = useState(false)
  const [loaderProps, updateLoaderProps] = useState<AppLoaderProps>({} as AppLoaderProps)
  const updateLoadingStatus = (
    status: Parameters<AppContextProps["updateLoadingStatus"]>["0"],
    text: Parameters<AppContextProps["updateLoadingStatus"]>["1"]
  ) => {
    updateLoadingSpinnerVisibility(status)
    updateLoaderProps((prev) => ({
      ...prev,
      spinnerProps: {
        ...prev.spinnerProps,
        spinnerText: text,
      },
    }))
  }

  // + update the context based on the cookies
  useEffect(() => {
    updateContextUserToken(Cookies.get(TOKEN_COOKIE_KEY) ?? null)

    const cookieUserInfo = parseCookieUserInfo()
    updateContextUserInfo(cookieUserInfo)
  }, [])

  return (
    <AppContext.Provider
      value={{
        SITE_URL: (process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", ""),
        token: userToken,
        userInfo,
        login,
        logout,
        updateLoadingStatus,
      }}
    >
      {children}
      {loadingSpinnerVisibility && <AppLoader {...loaderProps} />}
    </AppContext.Provider>
  )
}

// + user info cookie parser function
/**
 * User info cookie parser function that decrypts the data and returns the user info
 * object if encryption is enabled or returns plain user info object if encryption is disabled
 */
export const parseCookieUserInfo = (middlewareRequestCookie: RequestCookies | null = null) => {
  let userInfoCookie = middlewareRequestCookie
    ? middlewareRequestCookie.get(USER_INFO_COOKIE_KEY)?.value
    : Cookies.get(USER_INFO_COOKIE_KEY)

  if (process.env.NEXT_PUBLIC_ENCRYPT_SECRETS === "true" && userInfoCookie) {
    userInfoCookie = userInfoCookie =
      decrypt({
        encryptedText: userInfoCookie,
        salt: middlewareRequestCookie
          ? middlewareRequestCookie.get(TOKEN_COOKIE_KEY)?.value
          : Cookies.get(TOKEN_COOKIE_KEY),
        initializationVector: middlewareRequestCookie
          ? middlewareRequestCookie.get(USER_INFO_IV_COOKIE_KEY)?.value
          : Cookies.get(USER_INFO_IV_COOKIE_KEY),
      }).decrypted ?? "null"
  }

  return JSON.parse(userInfoCookie ?? "null") as UserInfoContextProps | null
}
