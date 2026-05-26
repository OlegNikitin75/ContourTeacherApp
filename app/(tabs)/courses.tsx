import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors, spacing, typography } from '@/core/constants/theme'
import HeaderTitle from '@/shared/components/HeaderTitle'

export default function Courses() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<HeaderTitle firstItemTitle='контур' secondItemTitle='препод' />

			<View style={styles.content}>
				<Text style={styles.title}>courses</Text>
				{/* Здесь будет список курсов */}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.appLightGray
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing(4)
	},
	title: {
		...typography.h2,
		color: colors.appAccent,
		marginBottom: spacing(4)
	}
})
