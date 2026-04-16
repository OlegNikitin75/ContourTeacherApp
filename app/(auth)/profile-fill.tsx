import { Dropdown } from 'react-native-element-dropdown'
import { ROUTES } from '@/core/lib/routes'
import { authService } from '@/features/auth/api/auth.service'
import { AppInput } from '@/shared/components/AppInput'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { router } from 'expo-router'
import { useState } from 'react'
import { View, Alert, Text } from 'react-native'
import { departments, positions } from '@/core/constants/data'
import { colors } from '@/core/constants/theme'

export default function ProfileFillScreen() {
	const [firstName, setFirstName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [lastName, setLastName] = useState('')
	const [position, setPosition] = useState(null)
	const [department, setDepartment] = useState(null)
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
				<View className='w-full mb-4'>
						<Text className='text-h4 text-app-black mb-3'>ваша должность</Text>
					<Dropdown
						style={{
							height: 56,
							backgroundColor: colors.appLightGray,
							borderColor: 'gray',
							borderWidth: 1,
							borderRadius: 8,
							paddingHorizontal: 20,
							paddingVertical: 8
						}}
					
						placeholderStyle={{
							fontSize: 16,
							color: colors.appGray
						}}
						selectedTextStyle={{
							fontSize: 16,
							color: colors.appBlack
						}}
						itemTextStyle={{
							fontSize: 16,
							color: colors.appBlack
						}}
						data={positions}
						labelField='label'
						valueField='value'
						placeholder='Выберите подразделение'
						value={position}
						onChange={item => {
							setPosition(item.value)
						}}
					/>
				</View>
				);
			</View>
		</AppScreenAuthLayout>
	)
}
