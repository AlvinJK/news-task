import React from 'react';
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

import globalStyle from '../styles/global';

interface News {
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}
interface Props {
  navigation: NavigationScreenProp<any, any>;
}
interface State {
  newsList: Array<News>;
  searchText: string;
  isLoading: boolean;
}
export default class NewsListScreen extends React.Component<Props, State> {
  state = {
    newsList: new Array<News>(),
    searchText: '',
    isLoading: true,
  };
  static navigationOptions = {
    title: 'News List',
  };
  componentDidMount() {
    let {navigation} = this.props;
    let sourceId = navigation.getParam('sourceId', 'NO-ID');
    if (sourceId !== 'NO-ID') {
      try {
        this._loadNews(sourceId);
      } catch (error) {
        console.log(error);
      }
    }
  }
  render() {
    let {newsList, searchText, isLoading} = this.state;
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
                <Image
                  source={{uri: item.urlToImage}}
                  style={style.newsListImage}
                />
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
  _loadNews = async (sourceId: string) => {
    let url = `https://newsapi.org/v2/top-headlines?sources=${sourceId}`;
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: '6b81f4029cd3429c8bc0c3194efbc9c3',
      },
    }).then((res) => res.json());

    if (data) {
      let newsList = new Array<News>();
      for (let item of data.articles) {
        let article = {
          author: item.author,
          title: item.title,
          description: item.description,
          url: item.url,
          urlToImage: item.urlToImage,
          publishedAt: item.publishedAt,
        };
        newsList.push(article);
      }
      if (newsList.length > 0) {
        this.setState({
          newsList: newsList,
          isLoading: false,
        });
      }
    }
  };
}

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
