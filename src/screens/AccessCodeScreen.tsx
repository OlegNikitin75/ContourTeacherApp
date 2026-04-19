import { ROUTES } from '@/core/lib/routes'
import { supabase } from '@/core/lib/supabase'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'
import { AppStatusMessage } from '@/shared/components/AppStatusMessage' // Импортируем
import { useRouter } from 'expo-router'
import { styled } from 'nativewind'
import { ComponentProps, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'

type KeyPressEvent = ComponentProps<typeof TextInput>['onKeyPress']
const StyledInput = styled(TextInput)

export default function AccessCodeScreen() {
	const [code, setCode] = useState(['', '', '', ''])
	const inputs = useRef<TextInput[]>([])
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	
	// Приводим стейт сообщения к единому стандарту объекта
	const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

	const isSuccess = statusMessage?.type === 'success'

	const verify = async (codeToVerify?: string) => {
		const fullCode = codeToVerify || code.join('')
		
		if (fullCode.length < 4 || loading || isSuccess) return

		try {
			setLoading(true)
			setStatusMessage(null)
			
			const { data: isValid, error } = await supabase.rpc('verify_and_consume_code', { 
				input_code: fullCode 
			})

			if (error) throw error

			if (isValid) {
				setStatusMessage({ text: 'Доступ разрешен', type: 'success' })
				Keyboard.dismiss()
				
				setTimeout(() => {
					router.replace({ 
						pathname: `/(auth)${ROUTES.SIGNUP}`, 
						params: { verified: 'true' } 
					})
				}, 1000)
			} else {
				setStatusMessage({ text: 'Неверный код доступа', type: 'error' })
				setCode(['', '', '', ''])
				inputs.current[0]?.focus()
			}
		} catch (e) {
			setStatusMessage({ text: 'Ошибка сети или сервера', type: 'error' })
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (text: string, index: number) => {
		const char = text.replace(/[^0-9]/g, '').slice(-1)
		const newCode = [...code]
		newCode[index] = char
		setCode(newCode)

		if (statusMessage) setStatusMessage(null)

		if (char && index < 3) {
			inputs.current[index + 1]?.focus()
		}

		if (newCode.join('').length === 4) {
			verify(newCode.join(''))
		}
	}

	const handleKeyPress = (e: Parameters<NonNullable<KeyPressEvent>>[0], index: number) => {
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
			disabled={loading || isSuccess}
		>
			<View className='flex-col items-center gap-4 mb-6'>
				<View
					className='flex-row justify-center items-center gap-3'
					pointerEvents={loading || isSuccess ? 'none' : 'auto'}
				>
					{code.map((digit, index) => (
						<StyledInput
							key={index}
							ref={el => {
								if (el) inputs.current[index] = el
							}}
							className={`w-14 h-16 rounded-xl text-center text-l1 font-jetbrains-medium border-2 ${
								statusMessage?.type === 'success'
									? 'border-app-success'
									: statusMessage?.type === 'error'
										? 'border-app-error'
										: 'border-transparent bg-app-light-gray focus:border-app-gray'
							}`}
							maxLength={1}
							keyboardType='number-pad'
							value={digit}
							onChangeText={text => handleChange(text, index)}
							onKeyPress={e => handleKeyPress(e, index)}
							editable={!loading && !isSuccess}
							contextMenuHidden 
						/>
					))}
				</View>

				<AppStatusMessage 
					message={statusMessage?.text} 
					type={statusMessage?.type} 
				/>
			</View>
		</AppScreenAuthLayout>
	)
}
