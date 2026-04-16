import { Dropdown } from 'react-native-element-dropdown'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { router } from 'expo-router'
import { useState } from 'react'
import { View, Alert} from 'react-native'
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

	const validate = () => {
		const newErrors: { [key: string]: string } = {}

		const checkField = (value: string, fieldName: string, label: string, isRequired = true) => {
			const trimmed = value?.trim() || ''

			if (isRequired && trimmed.length === 0) {
				newErrors[fieldName] = `Введите ${label}`
			} else if (trimmed.length > 0 && trimmed.length < 2) {
				newErrors[fieldName] = 'Слишком короткое значение'
			}
		}

		checkField(firstName, 'firstName', 'ваше имя')
		checkField(lastName, 'lastName', 'вашу фамилию')
		checkField(middleName, 'middleName', 'ваше отчество', false)
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSignup = async () => {
		if (!validate()) return
		try {
			setLoading(true)
			await authService.completeProfile(firstName, lastName, middleName, position!, department!)
			router.replace(`/(tabs)/${ROUTES.HOME}`)
		} catch (error: any) {
			Alert.alert('Ошибка', error.message || 'Не удалось сохранить профиль')
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
			>
				<View className='gap-y-4'>
					<AppInput
						label='ваша фамилия'
						placeholder='круглов'
						value={lastName}
						onChangeText={setLastName}
						error={errors.lastName}
					/>
					<AppInput
						label='ваше имя'
						placeholder='контур'
						value={firstName}
						onChangeText={setFirstName}
						error={errors.firstName}
					/>
					<AppInput
						label='ваше отчество'
						placeholder='чертежевич'
						value={middleName}
						onChangeText={setMiddleName}
						error={errors.middleName}
					/>
					<AppDropdown
						label='Ваша должность'
						placeholder='Руководитель отдела кругов'
						onChange={position => {
							setPosition(position)
						}}
						error={!position ? 'Выберите вашу должность' : undefined}
						data={positions}
						value={position}
					/>
					<AppDropdown
						label='Ваше подразделение'
						placeholder='Отдел кругов'
						onChange={department => {
							setDepartment(department)
						}}
						error={!position ? 'Выберите ваше подразделение' : undefined}
						data={departments}
						value={department}
					/>
				</View>
			</AppScreenAuthLayout>
		)
	}
