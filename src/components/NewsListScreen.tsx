import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';

import * as Types from '../types/News';
import globalStyle from '../styles/global';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  newsList: Array<Types.News>;
  fetchNews: (sourceId: string) => void;
  isLoading: boolean;
}
interface State {
  searchText: string;
}
export class NewsListScreenBasic extends React.Component<Props, State> {
  state = {
    searchText: '',
  };
  static navigationOptions = {
    title: 'News List',
  };
  componentDidMount() {
    // DISPATCH?
    let {fetchNews, navigation} = this.props;
    let sourceId = navigation.getParam('sourceId', 'NO-SOURCE');
    fetchNews(sourceId);
  }
  render() {
    let {isLoading, newsList} = this.props;
    let {searchText} = this.state;
    let content;
    let filteredList = newsList.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()),
    );
    if (newsList.length > 0) {
      content = (
        <FlatList
          data={filteredList}
          renderItem={({item}) => (
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate('News', {
                  url: item.url,
                  title: item.title,
                })
              }
            >
              <View style={style.newsListBlock}>
                {item.urlToImage != null && (
                  <Image
                    source={{uri: item.urlToImage}}
                    style={style.newsListImage}
                  />
                )}
                <View style={style.newsListTextBlock}>
                  <Text style={style.newsListTextTitle}>{item.title}</Text>
                  <Text style={style.newsListTextDesc}>{item.description}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }

    return (
      <View style={globalStyle.container}>
        <TextInput
          style={style.searchInput}
          value={searchText}
          placeholder={'Search'}
          onChangeText={(text) => this._changeSearchText(text)}
        />
        <ScrollView style={globalStyle.mainContent}>
          {isLoading && (
            <ActivityIndicator
              style={globalStyle.activityIndicator}
              size="large"
            />
          )}
          {content}
        </ScrollView>
      </View>
    );
  }

  _changeSearchText = (text: string) => {
    this.setState({searchText: text});
  };
}

interface ConnectedState {
  newsListLoading: boolean;
  newsList: Array<Types.News>;
}
let mapStateToProps = (state: ConnectedState) => {
  return {
    isLoading: state.newsListLoading,
    newsList: state.newsList,
  };
};

let mapDispatchToProps = (dispatch: any) => {
  return {
    fetchNews: (sourceId: string) => {
      dispatch({type: 'FETCH_NEWS', sourceId: sourceId});
    },
  };
};

let NewsListScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsListScreenBasic);

export default NewsListScreen;

const style = StyleSheet.create({
  searchInput: {
    height: 32,
    width: '95%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingHorizontal: 4,
    marginVertical: 4,
  },

  newsListBlock: {
    height: 120,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    flexDirection: 'row',
  },
  newsListImage: {
    flex: 1,
  },
  newsListTextBlock: {
    flex: 3,
    paddingLeft: 5,
    flexDirection: 'column',
  },
  newsListTextTitle: {
    fontSize: 14,
  },
  newsListTextDesc: {
    fontSize: 10,
  },
});
