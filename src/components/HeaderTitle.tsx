import { Text, View } from 'react-native'

interface HeaderTitleProps {
	firstItemTitle: string
	secondItemTitle: string
}
export default function HeaderTitle({ firstItemTitle, secondItemTitle }: HeaderTitleProps) {
	return (
		<View className='flex-row items-center justify-center gap-1 py-4'>
			<Text className='font-jetbrains-mono text-h3 text-app-black dark:text-app-light-gray'>{firstItemTitle}</Text>
			<Text className='font-jetbrains-mono text-h3 text-app-black dark:text-app-dark-gray'>|</Text>
			<Text className='font-jetbrains-mono text-h3 accent-color'>{secondItemTitle}</Text>
		</View>
	)
}
