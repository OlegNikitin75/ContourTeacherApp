import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { departments, positions } from '@/core/constants/data'
import { spacing } from '@/core/constants/theme'
import AppDropdown from '@/shared/components/AppDropdown'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenOnboardingLayout'
import { AppStatusMessage } from '@/shared/components/AppStatusMessage'

export default function ProfileFillScreen() {
	const [firstName, setFirstName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [lastName, setLastName] = useState('')
	const [position, setPosition] = useState<string | null>(null)
	const [department, setDepartment] = useState<string | null>(null)

	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

	const isInteractionDisabled = loading || statusMessage?.type === 'success'

const handleFieldChange = <T extends string | null>(
	field: string, 
	setter: (v: T) => void, 
	value: T
) => {
	setter(value)
	if (statusMessage) setStatusMessage(null)
	if (errors[field]) {
		setErrors(prev => {
			const next = { ...prev }
			delete next[field]
			return next
		})
	}
}

	const validate = () => {
		const newErrors: Record<string, string> = {}

		// Упрощенная и понятная проверка полей
		if (!lastName.trim()) newErrors.lastName = 'Введите фамилию'
		if (!firstName.trim()) newErrors.firstName = 'Введите имя'
		if (!position) newErrors.position = 'Выберите должность'
		if (!department) newErrors.department = 'Выберите подразделение'

		// Проверка на минимальную длину (если поле заполнено)
		const checkLength = (val: string, field: string) => {
			if (val.trim() && val.trim().length < 2) newErrors[field] = 'Минимум 2 символа'
		}
		checkLength(lastName, 'lastName')
		checkLength(firstName, 'firstName')
		checkLength(middleName, 'middleName')

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleCompleteProfile = async () => {
		if (!validate()) return

		try {
			setLoading(true)
			setStatusMessage(null)

			const profileData = {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				middleName: middleName.trim(),
				position,
				department,
				isComplete: true
			}

			// Сохраняем данные пачкой
			await AsyncStorage.multiSet([
				['user_profile', JSON.stringify(profileData)],
				['user_role', 'teacher']
			])

			setLoading(false)
			setStatusMessage({ text: 'профиль успешно заполнен!', type: 'success' })

			setTimeout(() => router.replace('/(tabs)'), 2000)
		} catch {
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
			disabled={isInteractionDisabled}
		>
			<View 
				style={styles.container} 
				pointerEvents={isInteractionDisabled ? 'none' : 'auto'}
			>
				<AppInput
					label='ваша фамилия'
					placeholder='круглов'
					value={lastName}
					onChangeText={(v) => handleFieldChange('lastName', setLastName, v)}
					error={errors.lastName}
				/>
				<AppInput
					label='ваше имя'
					placeholder='контур'
					value={firstName}
					onChangeText={(v) => handleFieldChange('firstName', setFirstName, v)}
					error={errors.firstName}
				/>
				<AppInput
					label='ваше отчество'
					placeholder='чертежевич'
					value={middleName}
					onChangeText={(v) => handleFieldChange('middleName', setMiddleName, v)}
					error={errors.middleName}
				/>

				<AppDropdown
					label='Ваша должность'
					placeholder='Выберите из списка'
					data={positions}
					value={position}
					onChange={(v) => handleFieldChange('position', setPosition, v)}
					error={errors.position}
				/>

				<AppDropdown
					label='Ваше подразделение'
					placeholder='Выберите из списка'
					data={departments}
					value={department}
					onChange={(v) => handleFieldChange('department', setDepartment, v)}
					error={errors.department}
				/>

				<AppStatusMessage
					message={statusMessage?.text}
					type={statusMessage?.type}
				/>
			</View>
		</AppScreenAuthLayout>
	)
}

const styles = StyleSheet.create({
	container: {
		rowGap: spacing(4), 
		paddingVertical: spacing(2),
	}
})
