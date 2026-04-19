import { IMAGES } from '@/assets'
import { EyeHiddenIcon, EyeShownIcon } from '@/assets/icons/icons_svg_components'
import { useForm } from '@/core/hooks/useForm'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { translateError } from '@/shared/utils/errorMessages'
import { router } from 'expo-router'
import { useState } from 'react'
import { Keyboard, Text, View } from 'react-native'

export default function SigninScreen() {
	const { values, errors, setErrors, handleChange } = useForm({
		email: '',
		password: ''
	})

	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	// Новое состояние для общей ошибки сервера
	const [formError, setFormError] = useState<string | null>(null)

	const validate = (email: string, pass: string) => {
		const newErrors: { [key: string]: string } = {}

		if (!email) {
			newErrors.email = 'Введите емейл'
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Некорректный формат емейл'
		}

		if (!pass) {
			newErrors.password = 'Введите пароль'
		} else if (pass.length < 6) {
			newErrors.password = 'Минимум 6 символов'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (field: 'email' | 'password', text: string) => {
		handleChange(field, text)
		if (formError) setFormError(null) // Убираем общую ошибку, если юзер начал что-то менять
	}

	const handleSignin = async () => {
		setFormError(null)
		const cleanEmail = values.email.trim().toLowerCase()
		const cleanPassword = values.password.trim()

		if (!validate(cleanEmail, cleanPassword)) return

		try {
			setLoading(true)
			Keyboard.dismiss()

			const data = await authService.signIn(cleanEmail, cleanPassword)

			if (data?.session) {
				router.replace('/(tabs)/') 
			}
		} catch (error: any) {
			const message = error.message.toLowerCase()

			if (message.includes('invalid login credentials')) {
				setFormError('Неверный емейл или пароль')
			} else if (message.includes('rate limit')) {
				setFormError('Слишком много попыток. Попробуйте позже')
			} else {
				setFormError(translateError(error.message))
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<AppScreenAuthLayout
			sourceImg={IMAGES.SigninBG}
			imageHeight={160}
			title={`рады видеть вас\nв контуре`}
			titleBtn='войти'
			actionBtn={handleSignin}
			isLoading={loading}
			bottomText='нет аккаунта?'
			bottomLinkText='зарегистрироваться'
			hrefLink={ROUTES.SIGNUP}
		>
			<View className='gap-y-4'>
				<AppInput
					label='ваш емейл'
					placeholder='hello@contour.com'
					value={values.email}
					onChangeText={(text) => handleInputChange('email', text)}
					error={errors.email}
					autoCapitalize='none'
					keyboardType='email-address'
				/>
				<AppInput
					label='ваш пароль'
					placeholder='******'
					value={values.password}
					onChangeText={(text) => handleInputChange('password', text)}
					icon={showPassword ? EyeShownIcon : EyeHiddenIcon}
					onIconPress={() => setShowPassword(!showPassword)}
					secureTextEntry={!showPassword}
					error={errors.password}
					autoCapitalize='none'
				/>
				<View className="h-5 justify-center items-center">
					{formError && (
						<Text className="text-app-error text-xs font-jetbrains-medium">
							{formError}
						</Text>
					)}
				</View>
			</View>
		</AppScreenAuthLayout>
	)
}
