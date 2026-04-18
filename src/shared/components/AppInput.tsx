import { colors } from '@/core/constants/theme'
import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native'
import { BaseIcon, IconContent } from './BaseIcon'

interface AppInputProps extends TextInputProps {
	label?: string
	error?: string
	icon?: IconContent
	onIconPress?: () => void
}

export const AppInput = ({ label, error, icon: Icon, onIconPress, ...props }: AppInputProps) => {
	const [isFocused, setIsFocused] = useState(false)

	return (
		<View className='mb-4 w-full'>
			{label && <Text className='text-h4 text-app-black mb-3'>{label}</Text>}

			<View
				className={`
        bg-app-light-gray border-2 rounded-lg px-5 py-2
        flex-row items-center justify-between
        ${error ? 'border-app-error' : isFocused ? 'border-black' : 'border-transparent'}
    `}
			>
				<TextInput
					{...props}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className='text-app-black text-l1 flex-1'
					placeholderTextColor={colors.appGray}
					autoCapitalize='none'
					autoCorrect={false}
				/>

				{Icon && (
					<TouchableOpacity onPress={onIconPress} className='ml-2 p-1'>
						<BaseIcon icon={Icon} />
					</TouchableOpacity>
				)}
			</View>

			{error && <Text className='text-app-error text-l3 mt-1 ml-1'>{error}</Text>}
		</View>
	)
}
