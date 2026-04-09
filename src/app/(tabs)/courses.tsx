import { colors } from '@/constants/theme'
import HeaderTitle from '@/src/components/HeaderTitle'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
