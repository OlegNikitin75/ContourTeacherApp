import { colors, spacing, corner, typography } from '@/core/constants/theme'
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
	disabled?: boolean
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
		<View style={[styles.container, disabled && styles.disabledContainer]}> 
			{label && <Text style={styles.label}>{label}</Text>}
			
			<Dropdown
				style={[
					styles.dropdown,
					isFocus && styles.borderFocused,
					error && styles.borderError,
				]}
				disable={disabled} 
				placeholderStyle={styles.placeholderStyle}
				selectedTextStyle={styles.selectedTextStyle}
				containerStyle={styles.popupContainer} 
				itemTextStyle={styles.itemTextStyle}
				activeColor={colors.appLightGray}выборе
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
	container: {
		width: '100%',
	},
	disabledContainer: {
		opacity: 0.6,
	},
	label: {
		...typography.h4,
		color: colors.appBlack,
		marginBottom: spacing(2),
	},
	dropdown: {
		height: spacing(11),
		borderColor: 'transparent',
		borderWidth: 2,
		borderRadius: corner(2), 
		paddingHorizontal: spacing(5),
		backgroundColor: colors.appLightGray,
	},
	borderFocused: {
		borderColor: colors.appBlack,
	},
	borderError: {
		borderColor: colors.appError,
	},
	placeholderStyle: {
		...typography.l1,
		color: colors.appGray,
	},
	selectedTextStyle: {
		...typography.l1,
		color: colors.appBlack,
	},
	popupContainer: {
		borderRadius: corner(2),
		backgroundColor: colors.appWhite,
		marginTop: spacing(1),
	},
	itemTextStyle: {
		...typography.l1,
		color: colors.appBlack,
	},
	errorText: {
		...typography.l3,
		color: colors.appError,
		marginTop: spacing(1),
		marginLeft: spacing(1),
	}
})
