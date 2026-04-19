import { EyeHiddenIcon, EyeShownIcon } from '@/assets/icons/icons_svg_components'
import { useForm } from '@/core/hooks/useForm'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { translateError } from '@/shared/utils/errorMessages'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { BackHandler, Text, View } from 'react-native'

export default function SignupScreen() {
	const { values, errors, setErrors, handleChange } = useForm({
		email: '',
		password: '',
		confirmPassword: ''
	})

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => true
			const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
			return () => subscription.remove()
		}, [])
	)

	const validate = (e: string, p: string, cp: string) => {
		const newErrors: { [key: string]: string } = {}

		if (!e) {
			newErrors.email = 'Введите емейл'
		} else if (!/\S+@\S+\.\S+/.test(e)) {
			newErrors.email = 'Некорректный формат емейл'
		}

		if (!p) {
			newErrors.password = 'Введите пароль'
		} else if (p.length < 6) {
			newErrors.password = 'Минимум 6 символов'
		}

		if (cp !== p) {
			newErrors.confirmPassword = 'Пароли не совпадают'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (field: 'email' | 'password' | 'confirmPassword', text: string) => {
		handleChange(field, text)
		if (statusMessage) setStatusMessage(null)
	}

		const handleSignup = async () => {
		const trimmedEmail = values.email.trim().toLowerCase()
		const trimmedPassword = values.password.trim()

		if (!validate(trimmedEmail, trimmedPassword, values.confirmPassword.trim())) return

		try {
        setLoading(true)
        setStatusMessage(null)

        const data = await authService.signUp(trimmedEmail, trimmedPassword)

        if (data) {
            setLoading(false) 
            setStatusMessage({ text: 'Регистрация прошла успешно!', type: 'success' })
            
            setTimeout(() => {
                router.replace(`/(auth)${ROUTES.PROFILE_FILL}`)
            }, 2000) 
        }
		} catch (error: any) {
			setLoading(false)
			const msg = error.message.toLowerCase()
			const friendlyMessage = translateError(msg)

			if (msg.includes('registered') || msg.includes('already exists')) {
				setErrors({ email: friendlyMessage })
			} else {
				setStatusMessage({ text: friendlyMessage, type: 'error' })
			}
		}
	}

	return (
		<AppScreenAuthLayout
			title={`Добро пожаловать \nв Контур`}
			titleBtn='зарегистрироваться'
			actionBtn={handleSignup}
			isLoading={loading}
			bottomText='уже есть аккаунт?'
			bottomLinkText='войти'
			disabled={loading || statusMessage?.type === 'success'}
			hrefLink={ROUTES.SIGNIN}
		>
			<View className='gap-y-4'>
				<AppInput
					label='ваш емейл'
					placeholder='hello@contour.com'
					value={values.email}
					onChangeText={text => handleInputChange('email', text)}
					error={errors.email}
					autoCapitalize='none'
					keyboardType='email-address'
					editable={!loading && statusMessage?.type !== 'success'}
				/>
				<AppInput
					label='ваш пароль'
					placeholder='минимум 6 символов'
					value={values.password}
					onChangeText={text => handleInputChange('password', text)}
					icon={showPassword ? EyeShownIcon : EyeHiddenIcon}
					onIconPress={() => setShowPassword(!showPassword)}
					secureTextEntry={!showPassword}
					error={errors.password}
					autoCapitalize='none'
					editable={!loading && statusMessage?.type !== 'success'}
				/>
				<AppInput
					label='повторите ваш пароль'
					placeholder='******'
					value={values.confirmPassword}
					onChangeText={text => handleInputChange('confirmPassword', text)}
					icon={showConfirmPassword ? EyeShownIcon : EyeHiddenIcon}
					onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
					secureTextEntry={!showConfirmPassword}
					error={errors.confirmPassword}
					autoCapitalize='none'
					editable={!loading && statusMessage?.type !== 'success'}
				/>

				<View className='min-h-7.5 px-4 justify-center items-center'>
					{statusMessage && (
						<Text
							className={`${
								statusMessage.type === 'success' ? 'text-app-success' : 'text-app-error'
							} text-l3 text-center`}
						>
							{statusMessage.text}
						</Text>
					)}
				</View>
			</View>
		</AppScreenAuthLayout>
	)
}
