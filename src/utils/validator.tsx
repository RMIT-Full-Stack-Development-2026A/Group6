export type FieldErrors<T extends Record<string, any>> = Partial<Record<keyof T, string>>

export function validateEmail(email: string): string | null {
	if (!email) return "Email is required"
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!re.test(email)) return "Enter a valid email"
	return null
}

export function validatePassword(password: string): string | null {
	if (!password) return "Password is required"
	if (password.length < 6) return "Password must be at least 6 characters"
	return null
}

export interface LoginFormValues {
	email: string
	password: string
}

export function validateLoginForm(values: LoginFormValues): FieldErrors<LoginFormValues> {
	const errs: FieldErrors<LoginFormValues> = {}
	const e = validateEmail(values.email)
	const p = validatePassword(values.password)
	if (e) errs.email = e
	if (p) errs.password = p
	return errs
}

export default validateLoginForm

