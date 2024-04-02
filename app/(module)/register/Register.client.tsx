"use client"

import { useMutation } from "@tanstack/react-query"
import { AppContext } from "app/App.Context"
import { useContext, useState } from "react"
import { LINKS } from "../router.config"
import { useRouter } from "next/navigation"
import { CreateAuthUserParams, createAuthUser } from "../services/api/auth/register-auth-user"
import { ToastContext } from "app/components/global/Toast/Context"
import TextField from "app/components/global/Form/TextField"
import Button from "app/components/global/Button"
import { validatePasswordField, validateTextInputField } from "app/components/global/Form/Auth/Validation"

const Register = () => {
  const { updateLoadingStatus, login } = useContext(AppContext)
  const { renderToast } = useContext(ToastContext)
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const createAuthUserQuery = useMutation({
    mutationFn: async (credentials: CreateAuthUserParams) => {
      updateLoadingStatus(true, "Registering...")
      const data = await createAuthUser(credentials)

      if (data.status_code == 201 && data.user && data.token) {
        updateLoadingStatus(false, undefined)
        login(data.token, {
          email: data.user.email as string,
          id: Number(data.user.id),
          username: data.user.username as string,
        })
        router.push(LINKS.INVENTORY.LIST.home)
      } else {
        updateLoadingStatus(false, undefined)
        renderToast([
          {
            message: data.message ?? "Invalid Data Input",
            variant: "error",
            onClose: () => {},
          },
        ])
      }
    },
    onError: () => {
      updateLoadingStatus(false, undefined)
      renderToast([
        {
          message: "Something went wrong",
          variant: "error",
          onClose: () => {},
        },
      ])
    },
  })

  return (
    <div
      id="form"
      style={{ width: "min(32rem, 94vw)" }}
      className={`login-form mx-auto flex grow-0 flex-col space-y-10 rounded-lg
        ${"bg-white/80 backdrop-blur"} p-40 ${"shadow-lg"} dark:border-gray-700 dark:bg-gray-800 md:space-y-40`}
    >
      <div className="mx-auto">
        <h4 className="mb-8 block">Register User</h4>
      </div>

      <div className="!mt-14 flex flex-col space-y-20">
        <TextField
          label={"Email"}
          value={email}
          isRequired={true}
          onChange={(e: any) => {
            setEmail(e.data)
          }}
          onKeyDown={(e: any) => {
            setEmail(e.data)
          }}
          onBlur={(e: any) => {
            setEmail(e.data)
          }}
          errorText={
            validateTextInputField({ isEmail: true, required: true, value: email }).status == true
              ? ""
              : validateTextInputField({ isEmail: true, required: true, value: email }).message
          }
        />

        <TextField
          label="Password"
          type={"password"}
          value={password}
          isRequired={true}
          onChange={(e: any) => {
            setPassword(e.data)
          }}
          onKeyDown={(e: any) => {
            setPassword(e.data)
          }}
          onBlur={(e: any) => {
            setPassword(e.data)
          }}
          errorText={
            validatePasswordField({ isSimplePassword: true, value: password, required: true }).status == true
              ? ""
              : validatePasswordField({ isSimplePassword: true, value: password, required: true }).message
          }
        />
        <Button
          btnText={"Register"}
          type="submit"
          isDisabled={
            validateTextInputField({ isEmail: true, required: true, value: email }).status == true &&
            validatePasswordField({ isSimplePassword: true, value: password, required: true }).status == true
              ? false
              : true
          }
          disabledClass="bg-primary-300 text-white pointer-events-none"
          clicked={() => {
            createAuthUserQuery.mutate({ email: email, password: password })
          }}
        />
      </div>
    </div>
  )
}

export default Register
