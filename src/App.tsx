import {createAppContainer, createStackNavigator} from 'react-navigation'; // Version can be specified in package.json
import React from 'react';
import {Provider} from 'react-redux';

import HomeScreen from './components/HomeScreen';
import NewsListScreen from './components/NewsListScreen';
import NewsScreen from './components/NewsScreen';

import dataStore from './data/DataStore';

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

const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component<any, any> {
  render() {
    return (
      <Provider store={dataStore}>
        <AppContainer />
      </Provider>
    );
  }
}
export default App;
