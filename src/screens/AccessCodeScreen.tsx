import { AppInput } from '@/shared/components/AppInput'
import AppScreenOnboardingLayout from '@/shared/components/AppScreenOnboardingLayout'
import { AppStatusMessage } from '@/shared/components/AppStatusMessage'
import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/core/lib/supabase'
import { ROUTES } from '@/core/lib/routes'

export default function AccessCodeScreen() {
	const [accessCode, setAccessCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

	const handleCodeChange = (value: string) => {
		setAccessCode(value)
		if (error) setError(null)
		if (statusMessage) setStatusMessage(null)
	}

	const handleVerifyCode = async () => {
		// Очищаем пробелы и переводим в нижний регистр для точного совпадения
		const trimmedCode = accessCode.trim().toLowerCase()
		
		if (!trimmedCode) {
			setError('введите ключ доступа')
			return
		}

		try {
			setLoading(true)
			setStatusMessage(null)

			const { data, error: sbError } = await supabase
				.from('access_keys')
				.select('role')
				.eq('key_value', trimmedCode)
				.maybeSingle()

			if (sbError) {
				console.error('Ошибка Supabase при запросе:', sbError)
				throw new Error('Ошибка связи с сервером. Попробуйте позже')
			}

			if (!data) {
				console.warn('Ключ не найден в таблице access_keys:', trimmedCode)
				throw new Error('неверный ключ доступа, обратитесь к руководителю')
			}

			console.log('Ключ верный! Получена роль:', data.role)

			// Сохраняем ключ и роль локально в память устройства
			await AsyncStorage.setItem('access_key', trimmedCode)
			await AsyncStorage.setItem('user_role', data.role)

			setStatusMessage({ text: 'ключ успешно подтвержден!', type: 'success' })

			// Переходим на экран заполнения профиля преподавателя
			setTimeout(() => {
				router.replace(`/(onboarding)/${ROUTES.PROFILE_FILL}`)
			}, 1500)

		} catch (err: any) {
			setStatusMessage({ 
				text: err.message || 'ошибка проверки ключа', 
				type: 'error' 
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<AppScreenOnboardingLayout
			title='введите ключ доступа'
			titleBtn='продолжить'
			actionBtn={handleVerifyCode}
			isLoading={loading}
			disabled={loading || statusMessage?.type === 'success'}
		>
			<View className='gap-y-4'>
				<AppInput
					label='ваш секретный ключ'
					placeholder='например: admin_key_777'
					value={accessCode}
					onChangeText={handleCodeChange}
					error={error || undefined}
					editable={!loading && statusMessage?.type !== 'success'}
					autoCapitalize='none'
					autoCorrect={false}
				/>

				<AppStatusMessage
					message={statusMessage?.text}
					type={statusMessage?.type}
				/>
			</View>
		</AppScreenOnboardingLayout>
	)
}
