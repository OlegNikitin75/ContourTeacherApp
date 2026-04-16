import { useState, useRef } from 'react'
import { Alert, TextInput, View, Keyboard } from 'react-native'
import { styled } from 'nativewind'
import { useRouter } from 'expo-router'
import { supabase } from '@/core/lib/supabase'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { ROUTES } from '@/core/lib/routes'
const StyledInput = styled(TextInput)

export default function AccessCode() {
	const [code, setCode] = useState(['', '', '', ''])
	const inputs = useRef<TextInput[]>([])
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const verify = async (codeToVerify?: string) => {
		const fullCode = codeToVerify || code.join('')
		if (fullCode.length < 4) return Alert.alert('ошибка', 'введите полный код')

		try {
			setLoading(true) // Включаем загрузку
			Keyboard.dismiss()

			const { data: isValid } = await supabase.rpc('verify_and_consume_code', {
				input_code: fullCode
			})

			if (isValid) {
			router.push({ 
        pathname: `/(auth)${ROUTES.SIGNUP}`, 
        params: { verified: 'true' } 
    })
			} else {
				Alert.alert('ошибка', 'код недействителен', [
					{
						text: 'ОК',
						onPress: () => {
							setCode(['', '', '', ''])
							setTimeout(() => inputs.current[0]?.focus(), 100)
						}
					}
				])
			}
		} catch (e) {
			Alert.alert('Ошибка', 'Что-то пошло не так')
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (text: string, index: number) => {
		const char = text.slice(-1)
		const newCode = [...code]
		newCode[index] = char
		setCode(newCode)

		if (char && index < 3) {
			inputs.current[index + 1]?.focus()
		}

		const fullCode = newCode.join('')
		if (fullCode.length === 4) {
			verify(fullCode)
		}
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
			isLoading={loading}
			sourceImg={0}
		>
			<View className='flex-row justify-center items-center gap-3 mb-6'>
				{code.map((digit, index) => (
					<StyledInput
						key={index}
						ref={el => {
							inputs.current[index] = el!
						}}
						selectTextOnFocus={true}
						autoComplete='one-time-code'
						className='w-14 h-16 rounded-xl text-center text-l1 font-jetbrains-medium bg-app-light-gray focus:border-2 border-app-gray'
						maxLength={1}
						keyboardType='number-pad'
						value={digit}
						onChangeText={text => handleChange(text, index)}
						onKeyPress={e => handleKeyPress(e, index)}
						textContentType='oneTimeCode'
					/>
				))}
			</View>
		</AppScreenAuthLayout>
	)
}
