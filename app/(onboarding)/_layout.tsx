import { Stack } from 'expo-router'

export default function AuthLayout() {
	
	return (
		<Stack
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name='intro' />
			<Stack.Screen name='access-code' />
			<Stack.Screen name='profile-fill' />
		</Stack>
	)
}
