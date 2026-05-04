import { Stack } from 'expo-router'

export default function OnboardingLayout() {
	
	return (
		<Stack
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name='index' />
			<Stack.Screen name='access-code' />
			<Stack.Screen name='profile-fill' />
		</Stack>
	)
}
