import React from 'react'
import { Text, View } from 'react-native'

interface AppStatusMessageProps {
	message: string | null | undefined
	type?: 'error' | 'success'
	containerStyle?: string 
}

export function AppStatusMessage  ({ 
	message, 
	type = 'error', 
	containerStyle = '' 
}: AppStatusMessageProps)  {
	if (!message) return <View className="h-6" /> 
	return (
		<View className={`h-6 mb-3 px-4 justify-center items-center ${containerStyle}`}>
			<Text
				className={`text-l3 text-center ${
					type === 'success' ? 'text-app-success' : 'text-app-error'
				}`}
			>
				{message}
			</Text>
		</View>
	)
}
