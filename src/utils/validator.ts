export type FieldErrors<T extends Record<string, any>> = Partial<Record<keyof T, string>>

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernameRegex = /^[A-Za-z0-9_-]+$/
const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/

export function validateEmail(email: string): string | null {
	if (!email) return "Email is required"
	if (email.length > 254) return "Email must be less than 255 characters"
	if (email.includes(' ')) return "Email cannot contain spaces"
	const atCount = email.split('@').length - 1
	if (atCount !== 1) return "Email must contain exactly one '@' symbol"
	const parts = email.split('@')
	const domain = parts[1]
	if (!domain || !domain.includes('.')) return "Email must contain a '.' after the '@' symbol"
	if (!emailRegex.test(email)) return "Enter a valid email address, for example name@example.com"
	return null
}

export function validatePassword(password: string): string | null {
	if (!password) return "Password is required"
	if (password.length < 8) return "Password must be at least 8 characters"
	if (!/[0-9]/.test(password)) return "Password must include at least one number"
	if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter"
	if (!specialCharRegex.test(password)) return "Password must include at least one special character like $#@!"
	return null
}

export function validateUsername(username: string): string | null {
	if (!username) return "Username is required"
	if (!usernameRegex.test(username)) return "Username may only contain letters, numbers, underscore, and hyphen"
	if (username.length < 3 || username.length > 30) return "Username must be 3 to 30 characters"
	return null
}

export interface LoginFormValues {
	email: string
	password: string
}

export interface SignupFormValues {
	email: string
	username: string
	country: string
	password: string
	confirmPassword: string
}

export function validateLoginForm(values: LoginFormValues): FieldErrors<LoginFormValues> {
	const errs: FieldErrors<LoginFormValues> = {}
	const e = validateEmail(values.email)
	const p = validatePassword(values.password)
	if (e) errs.email = e
	if (p) errs.password = p
	return errs
}

export function validateSignupForm(values: SignupFormValues): FieldErrors<SignupFormValues> {
	const errs: FieldErrors<SignupFormValues> = {}
	const emailError = validateEmail(values.email)
	const usernameError = validateUsername(values.username)
	const passwordError = validatePassword(values.password)
	if (emailError) errs.email = emailError
	if (usernameError) errs.username = usernameError
	if (!values.country) errs.country = "Country is required"
	if (passwordError) errs.password = passwordError
	if (!values.confirmPassword) errs.confirmPassword = "Confirm password is required"
	else if (values.password !== values.confirmPassword) errs.confirmPassword = "Passwords do not match"
	return errs
}

export default validateLoginForm

