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
			<Stack.Screen name='signup' />
			<Stack.Screen name='invite' />
			<Stack.Screen name='profile-fill' />
			<Stack.Screen name='signin' />
			
		</Stack>
	)
}
