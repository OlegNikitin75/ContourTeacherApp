import { colors } from '@/core/constants/theme'
import React, { ComponentType, useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface AppInputProps extends TextInputProps {
	label?: string
	error?: string
	icon?: ComponentType<SvgProps>
}

export const AppInput = ({ label, error, icon: Icon, ...props }: AppInputProps) => {
	const [isFocused, setIsFocused] = useState(false)

	return (
		<View className='mb-4 w-full'>
			{label && <Text className='text-h4 text-app-black mb-3'>{label}</Text>}

			<View
				className={`
        bg-app-light-gray border rounded-lg px-5 py-2
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
				/>

				{Icon && (
					<View className='ml-2 bg-amber-600'>
						<Icon width={24} height={24} />
					</View>
				)}
			</View>

			{error && <Text className='text-app-error text-l3 mt-1 ml-1'>{error}</Text>}
		</View>
	)
}
