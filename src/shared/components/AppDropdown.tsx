import { colors } from '@/core/constants/theme'
import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

interface AppDropdownProps {
	label?: string
	data: { label: string; value: string }[]
	value: string | null
	placeholder?: string
	error?: string
	onChange: (value: string) => void
	onBlur?: () => void
	onFocus?: () => void
	disabled?: boolean // 1. Добавляем в интерфейс
}

export default function AppDropdown({
	label,
	data,
	value,
	placeholder,
	error,
	onChange,
	onBlur,
	onFocus,
	disabled 
}: AppDropdownProps) {
	const [isFocus, setIsFocus] = useState(false)

	return (
		<View className='w-full mb-4' style={disabled && { opacity: 0.6 }}> 
			{label && <Text className='text-h4 text-app-black mb-3'>{label}</Text>}
			<Dropdown
				style={[
					styles.dropdown,
					isFocus && { borderColor: colors.appBlack },
					error && { borderColor: colors.appError },
				]}
				disable={disabled} 
				placeholderStyle={styles.placeholderStyle}
				selectedTextStyle={styles.selectedTextStyle}
				itemTextStyle={styles.itemTextStyle}
				data={data}
				labelField='label'
				valueField='value'
				placeholder={!isFocus ? placeholder || 'Выберите...' : '...'}
				value={value}
				onFocus={() => {
					if (disabled) return
					setIsFocus(true)
					if (onFocus) onFocus()
				}}
				onBlur={() => {
					setIsFocus(false)
					if (onBlur) onBlur()
				}}
				onChange={item => {
					onChange(item.value)
					setIsFocus(false)
				}}
			/>

			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	)
}


const styles = StyleSheet.create({
	label: { fontSize: 14, marginBottom: 8, color: '#333', fontWeight: '500' },
	dropdown: {
		height: 56,
		borderColor: colors.appLightGray,
		borderWidth: 2,
		borderRadius: 8,
		paddingHorizontal: 24,
		backgroundColor: colors.appLightGray
	},
	placeholderStyle: {
		fontSize: 16,
		color: colors.appGray,
		textTransform: 'lowercase',
		fontFamily: 'JetBrainsMono-Medium'
	},
	selectedTextStyle: {
		fontSize: 16,
		color: colors.appBlack,
		textTransform: 'lowercase',
		fontFamily: 'JetBrainsMono-Medium'
	},
	itemTextStyle: {
		fontSize: 16,
		color: colors.appBlack,
		textTransform: 'lowercase',
		fontFamily: 'JetBrainsMono-Medium'
	},
	errorText: { color: colors.appError, fontSize: 12, marginTop: 4, marginLeft: 4 }
})
