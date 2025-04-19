import { Text, View } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

const PeopleSwipeScreen = () => {
  return (
    <View>
      <Text>PeopleSwipeScreen</Text>
      <BottomNavBar currentScreen="PeopleSwipe" />
    </View>
  )
}

export default PeopleSwipeScreen;
