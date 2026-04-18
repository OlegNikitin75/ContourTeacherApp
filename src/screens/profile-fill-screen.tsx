import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { router } from 'expo-router'
import { useState } from 'react'
import { View, Text } from 'react-native'
import { departments, positions } from '@/core/constants/data'
import AppDropdown from '@/shared/components/AppDropdown'

export default function ProfileFillScreen() {
	const [firstName, setFirstName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [lastName, setLastName] = useState('')
	const [position, setPosition] = useState<string | null>(null)
	const [department, setDepartment] = useState<string | null>(null)
	
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<{ [key: string]: string }>({})
	const [formError, setFormError] = useState<string | null>(null)

	// Очистка ошибок при взаимодействии
	const handleFieldChange = (field: string, setter: (v: any) => void, value: any) => {
		setter(value)
		if (formError) setFormError(null)
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

	const handleSignup = async () => {
		setFormError(null)
		if (!validate()) return

		try {
			setLoading(true)
			await authService.completeProfile(
				firstName.trim(), 
				lastName.trim(), 
				middleName.trim(), 
				position!, 
				department!
			)
			// RootLayout увидит обновление is_complete через refreshSession в сервисе
			router.replace(`/(tabs)/`)
		} catch (error: any) {
			setFormError(error.message || 'Не удалось сохранить профиль')
		} finally {
			setLoading(false)
		}
	}

	return (
		<AppScreenAuthLayout
			title='расскажите немного о себе'
			titleBtn='завершить'
			actionBtn={handleSignup}
			isLoading={loading}
			// Блокируем кнопку, если уже идет загрузка
			disabled={loading}
		>
			<View className='gap-y-4'>
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

				{/* Блок для системной ошибки над кнопкой */}
				<View className="h-5 justify-center items-center">
					{formError && (
						<Text className="text-app-error text-l3">
							{formError}
						</Text>
					)}
				</View>
			</View>
		</AppScreenAuthLayout>
	)
}
