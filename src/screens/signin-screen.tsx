import { IMAGES } from '@/assets'
import { EyeHiddenIcon, EyeShownIcon } from '@/assets/icons/icons_svg_components'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { useAlert } from '@/providers/AlertContext'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { translateError } from '@/shared/utils/errorMessages'
import { router } from 'expo-router'
import { useState } from 'react'
import { View, Keyboard } from 'react-native'

export default function SigninScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<{ [key: string]: string }>({})

	const { showAlert } = useAlert()

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
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSignin = async () => {
		if (!validate()) return

		try {
			setLoading(true)

			Keyboard.dismiss()

			const data = await authService.signIn(email, password)

			if (data?.session) router.replace(ROUTES.HOME)
		} catch (error: any) {
			const message = error.message.toLowerCase()

			// 1. Ошибка учетных данных (самая частая)
			if (message.includes('invalid login credentials')) {
				showAlert('Ошибка', 'Неверный email или пароль')
			}
			// 3. Слишком много попыток (защита от брутфорса)
			else if (message.includes('rate limit')) {
				showAlert('Ой!', 'Слишком много попыток. Попробуйте чуть позже')
			}
			// 4. Остальные ошибки
			else {
				const friendlyMessage = translateError(error.message)
				showAlert('Ошибка', friendlyMessage)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<AppScreenAuthLayout
			sourceImg={IMAGES.SigninBG}
			className='w-45 h-45'
			title='рады видеть вас снова в контуре'
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
					value={email}
					onChangeText={setEmail}
					error={errors.email}
				/>
				<AppInput
					label='ваш пароль'
					placeholder='******'
					value={password}
					onChangeText={setPassword}
					icon={showPassword ? EyeShownIcon : EyeHiddenIcon}
					onIconPress={() => setShowPassword(!showPassword)}
					secureTextEntry={!showPassword}
					error={errors.password}
				/>
			</View>
		</AppScreenAuthLayout>
	)
}
