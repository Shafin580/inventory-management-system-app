"use client" // this is a client component
import { memo, useEffect, useState } from "react"
import TextField from "../TextField"
import Button from "../../Button"
import FormItemResponseInterface from "../FormItemResponseProps"

import ErrorText from "../ErrorText"
import Link from "next/link"
import { IconProps } from "../../Icon"
import { PasswordFieldInterface, TextInputFieldInterface, validatePasswordField, validateTextInputField } from "./Validation"
export interface logInFormInterface {
  onTextInputChange?: (e: FormItemResponseInterface) => void
  onPasswordChange?: (e: FormItemResponseInterface) => void
  textInputMinLength?: number
  textInputMaxLength?: number
  passwordMinLength?: number
  passwordMaxLength?: number
  submitClicked: Function
  isFetchingAPI?: boolean
  errorTextInput?: string
  errorTextPassword?: string
  btnText?: string
  btnHasSpinner?: boolean
  errorLoginText?: string
  textInputLabel?: string
  loginFormLabel?: string | JSX.Element
  defaultValidation?: boolean
  forgotPassLink?: string
  signUpLink?: string
  btnClassName?: string
  showForgotPass?: boolean
  showSignUp?: boolean
  showGoogleLogin?: boolean
  showFacebookLogin?: boolean
  backdropBlur?: boolean
  isSimplePassword?: boolean
  noShadow?: boolean
  className?: string
  googleRedirectURI?: string
  googleClientId?: string
  googleClientKey?: string
  facebookAppId?: string
}

/**
 * LogIn Component
    @param {FormItemResponseInterface}   onTextInputChange - trigger with onChange event and return the value of text(email/username) in parent component
    @param {FormItemResponseInterface}   onPasswordChange - trigger with onChange event and return the value of password in parent component
    @param {GoogleUserData}   getGoogleUserData - trigger with onChange event and return the value of google user data in parent component
    @param {FacebookUserData}   getFacebookUserData - trigger with onChange event and return the value of facebook user data in parent component
    @param {Function}   submitClicked - trigger with click event of Login button and return the
    value of text(email/username) and password to parent component
    @param {string}   errorTextInput - if any error triggers for text(email/username) custom validation in parent component,this parameter should be initialize with the response of validation from parent component. for defaultValidation this parameter has no use
    @param {string}   errorTextPassword - if any error triggers for password for custom validation in parent component,this parameter should be initialize with the response of validation from parent component.for defaultValidation this parameter has no use
    @param {string}   btnText - sets the value of button from parent component. e.g:"Log In"
    @param {boolean}   btnHasSpinner - Login Button Spins if it is set true
    @param {string}   textInputLabel - sets the value of label of textInput from parent component. e.g:"username,email....."
    @param {string|JSX.Element}   loginFormLabel - The label of the form. e.g: "Log In"
    @param {boolean}  defaultValidation -if default validation needed,this parameter needs to be
    "true" otherwise default validation for this component is set false
    @param {string}  forgotPassLink - Custom link URL for Forgot Password
    @param {string}  signUpLink - Custom link URL for sign up
    @param {string}  btnClassName -for custom css(tailwind) class for button
    @param {string}  showForgotPass -Show or hide Forgot Password Link
    @param {boolean}  showSignUp -Show or hide sign up Link
    @param {boolean}  showGoogleLogin -Show or hide Google Login Button
    @param {boolean}  showFacebookLogin -Show or hide Facebook Login Button
    @param {boolean} noShadow Remove box-shadow. Set to false by default.
    @param {string}  className -for custom class names of the entire form
    @param {string} [redirectURI] - Pass the URL of your website where after google authorization, the page will be redirected to the given url with some query params
    @param {string} [googleClientId] - Pass the Google Project Id
    @param {string} [googleClientKey] - Pass the Google Project Secret Key
    @param {string} [facebookAppId] - Pass the appId of the app created in facebook developer console
 */

const LogInForm = memo(function LogInForm({
  onTextInputChange,
  onPasswordChange,
  submitClicked,
  textInputMinLength = 5,
  textInputMaxLength = 20,
  passwordMaxLength = 20,
  passwordMinLength = 8,
  errorTextInput = "",
  errorTextPassword = "",
  errorLoginText = "",
  btnText = "Login",
  btnHasSpinner = false,
  textInputLabel = "Email",
  loginFormLabel = "Login",
  defaultValidation = false,
  isFetchingAPI = false,
  forgotPassLink = "",
  signUpLink = "",
  btnClassName,
  backdropBlur = true,
  showForgotPass = true,
  showSignUp = true,
  showGoogleLogin = false,
  showFacebookLogin = false,
  isSimplePassword = true,
  noShadow = false,
  googleRedirectURI = "",
  googleClientId = "",
  googleClientKey = "",
  facebookAppId = "",
  className,
}: logInFormInterface) {

  const [text, setText] = useState("")
  const [errorText, setErrorText] = useState(errorTextInput ?? "")
  const [isTextValidated, setIsTextValidated] = useState<boolean>(false)
  const [textFieldBlurCount, setTextFieldBlurCount] = useState(0)

  const [password, setPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState(errorTextPassword ?? "")
  const [isPasswordValidated, setIsPasswordValidated] = useState<boolean>(false)
  const [passwordFieldBlurCount, setPasswordFieldBlurCount] = useState(0)

  const [isClicked, setIsClicked] = useState(false)
  const [passwordIconName, setPasswordIconName] = useState<IconProps["iconName"]>("eye-off")
  const [IsPasswordVisible, setIsPasswordVisible] = useState("password")
  const emailValidatorProps: TextInputFieldInterface = {
    value: text,
    required: true,
    isEmail: true,
    minLength: textInputMinLength,
    maxLength: textInputMaxLength,
  }
  const validatePasswordFieldProps: PasswordFieldInterface = {
    value: password,
    minLength: passwordMinLength,
    maxLength: passwordMaxLength,
    isSimplePassword: isSimplePassword,
  }

  useEffect(() => {
    handleIsTextInputValid(text, "email")
    emailValidatorProps.value = text
    const validationText = validateTextInputField(emailValidatorProps)
    if (validationText.status == false) {
      setErrorText(validationText.message ?? "")
      setIsTextValidated(false)
    } else {
      setErrorText("")
      setIsTextValidated(true)
    }
  }, [text])

  useEffect(() => {
    const validationPwd = validatePasswordField(validatePasswordFieldProps)
    if (!validationPwd.status) {
      if (errorTextPassword) {
        setErrorPassword(errorTextPassword)
      } else {
        setErrorPassword(validationPwd?.message ?? "")
        setIsPasswordValidated(false)
      }
    } else {
      setErrorPassword("")
      setIsPasswordValidated(true)
    }
  }, [password])

  useEffect(() => {
    if (errorTextInput !== undefined) {
      setErrorText(errorTextInput)
    }
  }, [errorTextInput])

  useEffect(() => {
    if (errorTextPassword !== undefined) {
      setErrorPassword(errorTextPassword)
    }
  }, [errorTextPassword])

  const handleIsTextInputValid = (e: any, type: string) => {
    if (type == "email") {
      // console.log(e)
      const resp = validateTextInputField({
        value: e.data,
        required: true,
        isEmail: true,
      }).message

      if (resp) {
        setErrorText(resp)
      } else {
        setErrorText("")
      }
    } else {
      const resp = validatePasswordField({
        value: e.data,
        minLength: 5,
      }).message

      if (resp) {
        setErrorPassword(resp)
      } else {
        setErrorPassword("")
      }
    }
  }

  return (
    <>
      <div
        id="form"
        style={{ width: "min(32rem, 94vw)" }}
        className={`login-form mx-auto flex grow-0 flex-col space-y-10 rounded-lg
        ${backdropBlur == true ? "bg-white/80 backdrop-blur" : "bg-white"} p-40 ${
          noShadow == false ? "shadow-lg" : ""
        } dark:border-gray-700 dark:bg-gray-800 md:space-y-40 ${className}`}
      >
        <div className="mx-auto">
          <h4 className="mb-8 block">{loginFormLabel}</h4>
        </div>

        <div className="!mt-14 flex flex-col space-y-20">
          {errorLoginText && isFetchingAPI == false && <ErrorText text={errorLoginText} />}
          <TextField
            label={textInputLabel}
            value={text}
            isRequired={true}
            showErrorIcon={true}
            errorText={errorText.length == 0 || textFieldBlurCount == 0 ? "" : errorText}
            // fieldHeight="sm" // sm, md, lg
            onChange={(e: any) => {
              console.log(e.data)
              setText(e.data)
              // handleOnTextInputChange(e.data);
              // if (defaultValidation) {
              //   handleIsTextInputValid(e, "email");
              // }
            }}
            onKeyDown={(e: any) => {
              setText(e.data)
              setTimeout(() => {
                if (!(!isTextValidated || !isPasswordValidated || isFetchingAPI)) {
                  submitClicked({
                    text: text,
                    password: password,
                  })
                }
              }, 200)
            }}
            onBlur={(e: any) => {
              setTextFieldBlurCount((_prev) => _prev + 1)
              setText(e.data)
            }}
          />

          <TextField
            label="Password"
            type={IsPasswordVisible}
            rightIconName={passwordIconName}
            isRightIconClickable={true}
            onRightIconClick={() => {
              if (isClicked == false) {
                setIsClicked(true)
                {
                  setPasswordIconName("eye")
                  setIsPasswordVisible("text")
                }
              } else {
                setIsClicked(false)
                {
                  setPasswordIconName("eye-off")
                  setIsPasswordVisible("password")
                }
              }
            }}
            value={password}
            isRequired={true}
            showErrorIcon={false}
            errorText={errorPassword.length == 0 || passwordFieldBlurCount == 0 ? "" : errorPassword}
            // fieldHeight="sm" // sm, md, lg
            onChange={(e: any) => {
              console.log(e.data)
              setPassword(e.data)
              // handleOnPasswordChange(e.data);
              // if (defaultValidation) {
              //   handleIsTextInputValid(e, "password");
              // }
            }}
            onKeyDown={(e: any) => {
              setPassword(e.data)

              setTimeout(() => {
                if (!(!isTextValidated || !isPasswordValidated || isFetchingAPI)) {
                  submitClicked({
                    text: text,
                    password: password,
                  })
                }
              }, 200)
            }}
            onBlur={(e: any) => {
              setPasswordFieldBlurCount((_prev) => _prev + 1)
              setPassword(e.data)
              // if (defaultValidation) {
              //   handleIsTextInputValid(e, "password");
              // }
            }}
          />
          <Button
            btnText={btnText}
            type="submit"
            isDisabled={!isTextValidated || !isPasswordValidated || isFetchingAPI}
            disabledClass="bg-primary-300 text-white pointer-events-none"
            className={btnClassName}
            clicked={() => {
              submitClicked({
                text: text,
                password: password,
              })
            }}
            // spinnerSize="sm"
            hasSpinner={btnHasSpinner}
          />

          
          {showSignUp && (
            <div className="text-center text-slate-600 transition hover:text-primary-600">
              Don&apos;t have any account?&nbsp;
              <Link href={signUpLink} className=" text-primary">
                Create one
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
})

export default LogInForm
