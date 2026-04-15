import { EyeHiddenIcon, EyeShownIcon } from '@/assets/icons/icons_svg_components'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { router } from 'expo-router'
import { useState } from 'react'
import { View, Alert } from 'react-native'

export default function SignupScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<{ [key: string]: string }>({})

	const validate = () => {
		const newErrors: { [key: string]: string } = {}

		if (!email) {
			newErrors.email = 'Введите емейл'
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Некорректный формат емейл'
		}

		if (!password) {
			newErrors.password = 'Введите пароль'
		} else if (password.length < 6) {
			newErrors.password = 'Минимум 6 символов'
		}

		if (confirmPassword !== password) {
			newErrors.confirmPassword = 'Пароли не совпадают'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSignup = async () => {
		if (!validate()) return

		try {
			setLoading(true)
			const data = await authService.signUp(email, password)

			if (data) {
				router.replace(`/(auth)/${ROUTES.PROFILE_FILL}`)
			}
		} catch (error: any) {
			if (error.message?.includes('registered')) {
				setErrors({ email: 'Этот email уже занят' })
			} else {
				Alert.alert('Ошибка', error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<AppScreenAuthLayout
			title='Добро пожаловать в Контур'
			titleBtn={loading ? 'регистрация...' : 'зарегистрироваться'}
			actionBtn={handleSignup}
			isLoading={loading} 
			bottomText='уже есть аккаунт?'
			bottomLinkText='войти'
			hrefLink={ROUTES.SIGNIN}
		>
			<View className='gap-y-4'>
				<AppInput
					label='ваш емейл'
					placeholder='hello@contour.com'
					value={email}
					onChangeText={setEmail}
					error={errors.email}
				/>
				<AppInput
					label='ваш пароль'
					placeholder='минимум 6 символов'
					value={password}
					onChangeText={setPassword}
					icon={showPassword ? EyeShownIcon : EyeHiddenIcon}
					onIconPress={() => setShowPassword(!showPassword)}
					secureTextEntry={!showPassword}
					error={errors.password}
				/>
				<AppInput
					label='повторите ваш пароль'
					placeholder='******'
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					icon={showConfirmPassword ? EyeShownIcon : EyeHiddenIcon}
					onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
					secureTextEntry={!showConfirmPassword}
					error={errors.confirmPassword}
				/>
			</View>
		</AppScreenAuthLayout>
	)
}
