import React, { useState } from 'react'

import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'

import { colors, corner, spacing, typography } from '@/core/constants/theme'

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
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}

			<View
				style={[
					styles.inputWrapper,
					error ? styles.borderError : isFocused ? styles.borderFocused : styles.borderDefault
				]}
			>
				<TextInput
					{...props}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					style={styles.input}
					placeholderTextColor={colors.appGray}
					autoCapitalize='none'
					autoCorrect={false}
				/>

				{Icon && (
					<TouchableOpacity onPress={onIconPress} style={styles.iconButton} activeOpacity={0.7}>
						<BaseIcon icon={Icon} />
					</TouchableOpacity>
				)}
			</View>

			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	label: {
		...typography.h4,
		color: colors.appBlack,
		marginBottom: spacing(2)
	},
	inputWrapper: {
		backgroundColor: colors.appLightGray,
		borderWidth: 2,
		borderRadius: corner(2),
		paddingHorizontal: spacing(5),
		height: spacing(13),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	borderDefault: {
		borderColor: 'transparent'
	},
	borderFocused: {
		borderColor: colors.appBlack
	},
	borderError: {
		borderColor: colors.appError
	},
	input: {
		...typography.l1,
		color: colors.appBlack,
		flex: 1,
		height: '100%',
		padding: 0
	},
	iconButton: {
		marginLeft: spacing(2),
		padding: spacing(1)
	},
	errorText: {
		...typography.l3,
		color: colors.appError,
		marginTop: spacing(1),
		marginLeft: spacing(1)
	}
})
