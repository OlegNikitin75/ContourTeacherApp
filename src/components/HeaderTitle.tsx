import { Text, View } from 'react-native'

interface HeaderTitleProps {
	firstItemTitle: string
	secondItemTitle: string
}
export default function HeaderTitle({ firstItemTitle, secondItemTitle }: HeaderTitleProps) {
	return (
		<View className='flex-row items-center justify-center gap-1'>
			<Text className='font-jetbrains-mono text-h3 text-app-black'>{firstItemTitle}</Text>
			<Text className='font-jetbrains-mono text-h3 text-app-black'>|</Text>
			<Text className='font-jetbrains-mono text-h3 accent-color'>{secondItemTitle}</Text>
		</View>
	)
}
