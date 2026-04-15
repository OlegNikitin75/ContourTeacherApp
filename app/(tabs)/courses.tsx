import HeaderTitle from '@/shared/components/HeaderTitle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text } from 'react-native'

export default function Courses() {
	return (
<SafeAreaView className='flex-1 bg-app-light-gray'>
  <HeaderTitle 
    firstItemTitle='контур' 
    secondItemTitle='препод' 
  />
  
  <View className='flex-1 px-4'>
    <Text className='text-xl font-bold text-blue-500 mb-4'>Courses</Text>
    {/* Здесь будет список курсов */}
  </View>
</SafeAreaView>
	)
}
