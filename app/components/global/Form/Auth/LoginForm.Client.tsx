"use client"

import Login from "./Login"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { AppContext } from "@app-context"
import Button from "../../Button"
import ModalBlank from "../../ModalBlank"
import ErrorText from "../ErrorText"
import { useMutation } from "@tanstack/react-query"
import { LoginUserParams, loginAuthUser } from "app/(module)/services/api/auth/login-auth-user"
import { LINKS } from "app/(module)/router.config"

export default function LoginForm() {
  const router = useRouter()

  const [errorResponse, setErrorResponse] = useState("")
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)

  const { updateLoadingStatus, login } = useContext(AppContext)

  // + Login Validate Function

  const loginMutationQuery = useMutation({
    mutationFn: async (credentials: LoginUserParams) => {
      updateLoadingStatus(true, "Logging...")
      const data = await loginAuthUser(credentials)

      if (data.status_code == 200 && data.user && data.token) {
        updateLoadingStatus(false, undefined)
        setShowUnauthorizedModal(false)
        login(data.token, {
          email: data.user.email as string,
          id: Number(data.user.id),
          username: data.user.name as string,
        })
        router.push(LINKS.INVENTORY.LIST.home)
      } else {
        setErrorResponse(data.message ?? "Invalid Credentials")
        setShowUnauthorizedModal(true)
        updateLoadingStatus(false, undefined)
      }
    },
    onError: () => {
      setErrorResponse("Something went wrong! Please try again")
      setShowUnauthorizedModal(true)
      updateLoadingStatus(false, undefined)
    },
  })

  return (
    <>
      <Login
        className="mt-56 grow-0 md:!min-w-[512px]"
        errorTextPassword={errorResponse}
        textInputMinLength={1}
        textInputMaxLength={1000}
        passwordMinLength={1}
        passwordMaxLength={1000}
        showForgotPass={false}
        isSimplePassword={true}
        submitClicked={(e: any) => {
          loginMutationQuery.mutate({ email: e.text, password: e.password })
        }}
        btnText="Sign In"
        textInputLabel="Email"
        loginFormLabel={
          <div className="rounded-md">
            <h3>Inventory Management System</h3>
          </div>
        }
        showSignUp={true}
        signUpLink={LINKS.REGISTER}
      />

      {showUnauthorizedModal && (
        <ModalBlank
          modalSize="sm"
          onCloseModal={() => setShowUnauthorizedModal(false)}
          onClickOutToClose={true}
          showCrossButton={true}
        >
          <div className="space-y-20 text-center">
            <div>
              <ErrorText text={errorResponse} />
            </div>
            <div>
              <Button
                btnText="Ok"
                clicked={() => {
                  setShowUnauthorizedModal(false)
                }}
                variant="primary"
                className="w-full px-16"
              />
            </div>
          </div>
        </ModalBlank>
      )}
    </>
  )
}
