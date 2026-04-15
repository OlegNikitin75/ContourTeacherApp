import { EyeHiddenIcon } from '@/assets/icons/icons_svg_components'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { router } from 'expo-router'
import { useState } from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	Keyboard,
	View,
	Alert
} from 'react-native'

export default function SignupScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
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
			title='Добро пожаловать в Контур'
			titleBtn={loading ? 'регистрация...' : 'зарегистрироваться'}
			actionBtn={handleSignup}
			bottomText='уже есть аккаунт?'
			bottomLinkText='войти'
			hrefLink={ROUTES.SIGNIN}
		>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
						<View className='flex-1 gap-y-4 py-6'>
							<AppInput
								label='ваш емейл'
								placeholder='hello@contour.com'
								value={email}
								onChangeText={val => {
									setEmail(val)
									setErrors({ ...errors, email: '' })
								}}
								error={errors.email}
								autoCapitalize='none'
							/>
							<AppInput
								label='ваш пароль'
								placeholder='минимум 6 символов'
								value={password}
								onChangeText={val => {
									setPassword(val)
									setErrors({ ...errors, password: '' })
								}}
								error={errors.password}
								icon={EyeHiddenIcon}
								secureTextEntry
							/>
							<AppInput
								label='повторите ваш пароль'
								placeholder='******'
								value={confirmPassword}
								onChangeText={val => {
									setConfirmPassword(val)
									setErrors({ ...errors, confirmPassword: '' })
								}}
								error={errors.confirmPassword}
								icon={EyeHiddenIcon}
								secureTextEntry
							/>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</AppScreenAuthLayout>
	)
}
