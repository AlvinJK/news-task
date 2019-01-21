import {createAppContainer, createStackNavigator} from 'react-navigation'; // Version can be specified in package.json

import HomeScreen from './components/HomeScreen';
import NewsListScreen from './components/NewsListScreen';
import NewsScreen from './components/NewsScreen';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    NewsList: {
      screen: NewsListScreen,
    },
    News: {
      screen: NewsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default createAppContainer(AppNavigator);
