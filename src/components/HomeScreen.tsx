import React from 'react';
import {connect} from 'react-redux';
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
  sourcesList: Array<Types.NewsSource>;
  fetchSource: () => void;
  isLoading: boolean;
}
interface State {}

export class HomeScreenBasic extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Source List',
    headerStyle: globalStyle.headerStyle,
  };
  componentDidMount() {
    // DISPATCH?
    let {fetchSource} = this.props;
    fetchSource();
  }
  render() {
    let {sourcesList, isLoading} = this.props;
    let showList = false;
    if (sourcesList != null) {
      if (sourcesList.length > 0) {
        showList = true;
      }
    }
    return (
      <View style={globalStyle.container}>
        {isLoading && (
          <ActivityIndicator
            style={globalStyle.activityIndicator}
            size="large"
          />
        )}
        <ScrollView style={globalStyle.mainContent}>
          {showList ? (
            <FlatList
              data={sourcesList}
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
}

interface ConnectedState {
  sourceLoading: boolean;
  sourceList: Array<Object>;
}
let mapStateToProps = (state: ConnectedState) => {
  return {
    isLoading: state.sourceLoading,
    sourcesList: state.sourceList,
  };
};

let mapDispatchToProps = (dispatch: any) => {
  return {
    fetchSource: () => {
      console.log(dispatch);
      console.log('FETCHING');
      dispatch({type: 'FETCH_SOURCES'});
    },
  };
};

let HomeScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreenBasic);

export default HomeScreen;

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
