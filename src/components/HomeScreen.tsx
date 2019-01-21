import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';

import globalStyle from '../styles/global';

import * as Types from '../types/News';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}
interface State {
  sourceList: Array<Types.NewsSource>;
  isLoading: boolean;
}

export default class HomeScreen extends React.Component<Props, State> {
  state = {
    sourceList: new Array<Types.NewsSource>(),
    isLoading: true,
  };
  static navigationOptions = {
    title: 'Source List',
    headerStyle: globalStyle.headerStyle,
  };
  componentDidMount() {
    this._loadSources();
  }
  render() {
    let {sourceList, isLoading} = this.state;
    return (
      <View style={globalStyle.container}>
        {isLoading && (
          <ActivityIndicator
            style={globalStyle.activityIndicator}
            size="large"
          />
        )}
        <ScrollView style={globalStyle.mainContent}>
          {sourceList.length > 0 ? (
            <FlatList
              data={sourceList}
              renderItem={({item}) => (
                <View style={style.sourceListBlock}>
                  <Text
                    onPress={() =>
                      this.props.navigation.navigate('NewsList', {
                        sourceId: item.id,
                      })
                    }
                    style={style.sourceListText}
                  >
                    {item.name}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : null}
        </ScrollView>
      </View>
    );
  }

  _loadSources = async () => {
    let url = 'https://newsapi.org/v2/sources';
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: '6b81f4029cd3429c8bc0c3194efbc9c3',
      },
    }).then((res) => res.json());

    let sourceList = [];
    if (data) {
      for (let item of data.sources) {
        let source = {
          id: item.id,
          name: item.name,
          description: item.description,
          url: item.url,
          category: item.category,
          language: item.language,
          country: item.country,
        };
        sourceList.push(source);
      }
      if (sourceList.length > 0) {
        this.setState({
          sourceList: sourceList,
          isLoading: false,
        });
      }
    }
  };
}

const style = StyleSheet.create({
  sourceListBlock: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  sourceListText: {
    fontSize: 20,
  },
});
