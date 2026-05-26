import React, { useState } from 'react'

import { router } from 'expo-router'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { colors, corner, spacing, typography } from '@/core/constants/theme'
import { ROUTES } from '@/core/lib/routes'
import AppSnackbar from '@/shared/components/AppSnackbar'

export default function ProfileScreen() {
	const [snackbarVisible, setSnackbarVisible] = useState(false)

	const triggerLogoutProcess = () => {
		setSnackbarVisible(true)
	}

	const handleLogoutConfirm = async () => {
		try {
			await AsyncStorage.multiRemove(['access_key', 'user_role', 'user_profile'])
			router.replace(ROUTES.INTRO)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>профиль преподавателя</Text>
			</View>

			<TouchableOpacity onPress={triggerLogoutProcess} activeOpacity={0.7} style={styles.logoutButton}>
				<Text style={styles.logoutText}>выйти из профиля</Text>
			</TouchableOpacity>

			<AppSnackbar
				visible={snackbarVisible}
				message='выход из профиля будет выполнен через %seconds% сек...'
				actionLabel='отмена'
				onActionPress={() => setSnackbarVisible(false)}
				onDismiss={handleLogoutConfirm}
				duration={4000}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'space-between', padding: spacing(4), backgroundColor: colors.appWhite },
	title: { ...typography.h3, color: colors.appBlack },
	logoutButton: {
		borderWidth: 1,
		borderColor: colors.appLightGray,
		backgroundColor: colors.appLightGray,
		borderRadius: corner(3),
		padding: spacing(4),
		marginBottom: spacing(4),
		alignItems: 'center'
	},
	logoutText: { ...typography.l1, color: colors.appError }
})
