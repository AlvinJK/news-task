import React from 'react';
import {View, ActivityIndicator, WebView, Text} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';

import globalStyle from '../styles/global';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}
interface State {
  isLoading: boolean;
}
export default class NewsScreen extends React.Component<Props, State> {
  state = {
    isLoading: true,
  };
  static navigationOptions = (props: Props) => {
    let {navigation} = props;
    return {
      title: navigation.getParam('title', 'News'),
      headerStyle: globalStyle.headerStyle,
    };
  };
  render() {
    let {navigation} = this.props;
    let {isLoading} = this.state;
    let url = navigation.getParam('url', 'NO-URL');
    let content;
    if (url !== 'NO-URL') {
      content = (
        <View style={{flex: 1}}>
          <WebView
            onLoad={() => this._stopLoading()}
            style={{flex: 1}}
            source={{uri: this.props.navigation.state.params.url}}
          />
          {isLoading && (
            <ActivityIndicator
              style={globalStyle.activityIndicator}
              size="large"
            />
          )}
        </View>
      );
    } else {
      content = (
        <View style={{flex: 1}}>
          <Text>URL NOT PROVIDED</Text>
        </View>
      );
    }
    return content;
  }
  _stopLoading() {
    this.setState({
      isLoading: false,
    });
  }
}
