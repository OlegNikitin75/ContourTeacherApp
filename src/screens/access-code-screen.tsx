import { useState, useRef } from 'react'
import { TextInput, View, Keyboard, Text } from 'react-native'
import { styled } from 'nativewind'
import { useRouter } from 'expo-router'
import { supabase } from '@/core/lib/supabase'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { ROUTES } from '@/core/lib/routes'
import { useAlert } from '@/providers/AlertContext'

const StyledInput = styled(TextInput)

export default function AccessCodeScreen() {
	const [code, setCode] = useState(['', '', '', ''])
	const inputs = useRef<TextInput[]>([])
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState<'default' | 'success' | 'error'>('default')

	const { showAlert } = useAlert()
	const isSuccess = status === 'success'

	const verify = async (codeToVerify?: string) => {
		const fullCode = codeToVerify || code.join('')
		if (fullCode.length < 4 || loading || isSuccess) return

		try {
			setLoading(true)
			const { data: isValid } = await supabase.rpc('verify_and_consume_code', { input_code: fullCode })

			if (isValid) {
				setStatus('success')
				Keyboard.dismiss()
				setTimeout(() => {
					router.replace({ pathname: `/(auth)${ROUTES.SIGNUP}`, params: { verified: 'true' } })
				}, 1500)
			} else {
				setStatus('error')
				setCode(['', '', '', ''])
				inputs.current[0]?.focus()
			}
		} catch (e) {
			setStatus('error')
			showAlert('Ошибка сети', 'Не удалось связаться с сервером')
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (text: string, index: number) => {
		const char = text.slice(-1)
		const newCode = [...code]
		newCode[index] = char
		setCode(newCode)

		if (status === 'error') setStatus('default')

		if (char && index < 3) {
			inputs.current[index + 1]?.focus()
		}

		if (newCode.join('').length === 4) verify(newCode.join(''))
	}

	const handleKeyPress = (e: any, index: number) => {
		if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
			inputs.current[index - 1]?.focus()
		}
	}

	return (
		<AppScreenAuthLayout
			title='Проверим доступ к приложению преподавателя'
			subtitle='Админ кафедры выдал вам уникальный код для доступа'
			titleBtn='проверить код'
			actionBtn={() => verify()}
			isLoading={loading || isSuccess} 
			sourceImg={0}
		>
			<View className='flex-col items-center gap-4 mb-6'>
				<View
					className='flex-row justify-center items-center gap-3'
					pointerEvents={loading || isSuccess ? 'none' : 'auto'} // Глобальная блокировка кликов
				>
					{code.map((digit, index) => (
						<StyledInput
							key={index}
							ref={el => {
								if (el) inputs.current[index] = el
							}}
							className={`w-14 h-16 rounded-xl text-center text-l1 font-jetbrains-medium border-2 ${
								status === 'success'
									? 'border-app-success'
									: status === 'error'
										? 'border-app-error '
										: 'border-transparent bg-app-light-gray focus:border-app-gray'
							}`}
							maxLength={1}
							keyboardType='number-pad'
							value={digit}
							onChangeText={text => handleChange(text, index)}
							onKeyPress={e => handleKeyPress(e, index)}
							editable={!loading && !isSuccess}
						/>
					))}
				</View>

				<View className='h-6'>
					{status === 'success' && (
						<Text className='text-app-success text-l3 '>Доступ разрешен</Text>
					)}
					{status === 'error' && (
						<Text className='text-app-error text-l3 '>Неверный код доступа</Text>
					)}
				</View>
			</View>
		</AppScreenAuthLayout>
	)
}
