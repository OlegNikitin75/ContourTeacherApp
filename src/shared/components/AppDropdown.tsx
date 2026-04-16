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
}

export default function AppDropdown({
	label,
	data,
	value,
	placeholder,
	error,
	onChange,
	onBlur,
	onFocus
}: AppDropdownProps) {
	const [isFocus, setIsFocus] = useState(false)

	return (
		<View className='w-full mb-4'>
			{label && <Text className='text-h4 text-app-black mb-3'>{label}</Text>}
			<Dropdown
				style={[
					styles.dropdown,
					isFocus && { borderColor: colors.appBlack },
					error && { borderColor: colors.appError }
				]}
				placeholderStyle={styles.placeholderStyle}
				selectedTextStyle={styles.selectedTextStyle}
				itemTextStyle={styles.itemTextStyle}
				data={data}
				labelField='label'
				valueField='value'
				placeholder={!isFocus ? placeholder || 'Выберите...' : '...'}
				value={value}
				onFocus={() => {
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
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: colors.appLightGray
	},
	placeholderStyle: { fontSize: 16, color: colors.appGray },
	selectedTextStyle: { fontSize: 16, color: colors.appBlack },
	itemTextStyle: { fontSize: 16, color: colors.appBlack },
	errorText: { color: colors.appError, fontSize: 12, marginTop: 4, marginLeft: 4 }
})
