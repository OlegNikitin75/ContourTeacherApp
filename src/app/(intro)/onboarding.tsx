import { colors } from '@/constants/theme'
import HeaderTitle from '@/src/components/HeaderTitle'
import { View, Text } from 'react-native'

export default function Onboarding() {
	return (
		<View>
			<HeaderTitle firstItemTitle='контур' secondItemTitle='препод'  />
		</View>
	)
}
