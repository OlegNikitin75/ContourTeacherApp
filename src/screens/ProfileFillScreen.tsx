import { departments, positions } from '@/core/constants/data'
import AppDropdown from '@/shared/components/AppDropdown'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenOnboardingLayout'
import { AppStatusMessage } from '@/shared/components/AppStatusMessage'
import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage' // Импортируем AsyncStorage

export default function ProfileFillScreen() {
	const [firstName, setFirstName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [lastName, setLastName] = useState('')
	const [position, setPosition] = useState<string | null>(null)
	const [department, setDepartment] = useState<string | null>(null)

	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<{ [key: string]: string }>({})
	const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

	const isSuccess = statusMessage?.type === 'success'

	const handleFieldChange = (field: string, setter: (v: any) => void, value: any) => {
		setter(value)
		if (statusMessage) setStatusMessage(null)
		if (errors[field]) {
			setErrors(prev => {
				const newErrs = { ...prev }
				delete newErrs[field]
				return newErrs
			})
		}
	}

	const validate = () => {
		const newErrors: { [key: string]: string } = {}

		const checkText = (value: string, field: string, label: string, required = true) => {
			const val = value.trim()
			if (required && !val) {
				newErrors[field] = `Введите ${label}`
			} else if (val && val.length < 2) {
				newErrors[field] = 'Минимум 2 символа'
			}
		}

		checkText(lastName, 'lastName', 'фамилию')
		checkText(firstName, 'firstName', 'имя')
		checkText(middleName, 'middleName', 'отчество', false)

		if (!position) newErrors.position = 'Выберите должность'
		if (!department) newErrors.department = 'Выберите подразделение'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleCompleteProfile = async () => {
		if (!validate()) return

		try {
			setLoading(true)
			setStatusMessage(null)

			// 1. Формируем локальный объект профиля преподавателя
			const profileData = {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				middleName: middleName.trim(),
				position: position!,
				department: department!,
				isComplete: true
			}

			// 2. Сохраняем в AsyncStorage
			await AsyncStorage.setItem('user_profile', JSON.stringify(profileData))
			
			// Также сохраняем статус, чтобы RootLayout понимал, что онбординг пройден
			await AsyncStorage.setItem('user_role', 'teacher') // По умолчанию или из ключа доступа

			setLoading(false)
			setStatusMessage({ text: 'профиль успешно заполнен!', type: 'success' })

			// 3. Перенаправляем на вкладки
			setTimeout(() => {
				router.replace('/(tabs)')
			}, 2000)

		} catch (error: any) {
			setLoading(false)
			setStatusMessage({ text: 'не удалось сохранить профиль локально', type: 'error' })
		}
	}

	return (
		<AppScreenAuthLayout
			title='расскажите немного о себе'
			titleBtn='завершить'
			actionBtn={handleCompleteProfile}
			isLoading={loading}
			disabled={loading || isSuccess}
		>
			<View className='gap-y-4'>
				<AppInput
					label='ваша фамилия'
					placeholder='круглов'
					value={lastName}
					onChangeText={(v) => handleFieldChange('lastName', setLastName, v)}
					error={errors.lastName}
					editable={!loading && !isSuccess}
				/>
				<AppInput
					label='ваше имя'
					placeholder='контур'
					value={firstName}
					onChangeText={(v) => handleFieldChange('firstName', setFirstName, v)}
					error={errors.firstName}
					editable={!loading && !isSuccess}
				/>
				<AppInput
					label='ваше отчество'
					placeholder='чертежевич'
					value={middleName}
					onChangeText={(v) => handleFieldChange('middleName', setMiddleName, v)}
					error={errors.middleName}
					editable={!loading && !isSuccess}
				/>

				<AppDropdown
					label='Ваша должность'
					placeholder='Выберите из списка'
					data={positions}
					value={position}
					onChange={(v) => handleFieldChange('position', setPosition, v)}
					error={errors.position}
					disabled={loading || isSuccess}
				/>

				<AppDropdown
					label='Ваше подразделение'
					placeholder='Выберите из списка'
					data={departments}
					value={department}
					onChange={(v) => handleFieldChange('department', setDepartment, v)}
					error={errors.department}
					disabled={loading || isSuccess}
				/>

				<AppStatusMessage
					message={statusMessage?.text}
					type={statusMessage?.type}
				/>
			</View>
		</AppScreenAuthLayout>
	)
}
