// @flow
import {createStore, applyMiddleware, Middleware, AnyAction} from 'redux';
import {NewsSource} from '../types/News';
import {Dispatch} from 'react';

const fetchSourcesMiddleware: Middleware = (dataStore) => (next) => (
  action,
) => {
  let {dispatch} = dataStore;

  if (action.type === 'FETCH_SOURCES') {
    fetchSources(dispatch);
  } else {
    next(action);
  }
};

async function fetchSources(dispatch: Dispatch<AnyAction>) {
  let url = 'https://newsapi.org/v2/sources';
  let data = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: '6b81f4029cd3429c8bc0c3194efbc9c3',
    },
  }).then((res) => res.json());

  console.log(url);
  dispatch({type: 'SOURCES_FETCHED', data: data});
}

let dataStore = createStore(reducer, applyMiddleware(fetchSourcesMiddleware));

function reducer(
  state = {sourceList: new Array<NewsSource>(), sourceLoading: true},
  action: any,
) {
  switch (action.type) {
    case 'SOURCES_FETCHED': {
      console.log('FETCHED DISPATCHED');
      let sources = action.data.sources;
      let sourceList = new Array();
      for (let item of sources) {
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
      return {sourceList: sourceList, sourceLoading: false};
    }
    default: {
      return state;
    }
  }
}

export default dataStore;
