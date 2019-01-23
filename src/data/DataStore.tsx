// @flow
import {createStore, applyMiddleware, Middleware, AnyAction} from 'redux';
import {NewsSource, News} from '../types/News';
import {Dispatch} from 'react';

const fetchingMiddleware: Middleware = (dataStore) => (next) => (action) => {
  let {dispatch} = dataStore;

  switch (action.type) {
    case 'FETCH_SOURCES':
      fetchSources(dispatch);
      break;
    case 'FETCH_NEWS':
      let {sourceId} = action;
      fetchNews(dispatch, sourceId);
      next(action);
      break;
    default:
      next(action);
      break;
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
  dispatch({type: 'SOURCES_FETCHED', data: data});
}

async function fetchNews(dispatch: Dispatch<AnyAction>, sourceId: string) {
  let url = `https://newsapi.org/v2/top-headlines?sources=${sourceId}`;
  let data = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: '6b81f4029cd3429c8bc0c3194efbc9c3',
    },
  }).then((res) => res.json());
  dispatch({type: 'NEWS_FETCHED', data: data});
}

let dataStore = createStore(reducer, applyMiddleware(fetchingMiddleware));

interface rootState {
  sourceList: Array<NewsSource>;
  newsList: Array<News>;
  sourceLoading: boolean;
  newsListLoading: boolean;
}
function reducer(
  state: rootState = {
    sourceList: new Array<NewsSource>(),
    newsList: new Array<News>(),
    sourceLoading: true,
    newsListLoading: false,
  },
  action: any,
) {
  switch (action.type) {
    case 'SOURCES_FETCHED': {
      let sources = action.data.sources;
      let sourceList = new Array<NewsSource>();
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
      return {...state, sourceList: sourceList, sourceLoading: false};
    }
    case 'FETCH_NEWS': {
      return {...state, newsList: new Array<News>(), newsListLoading: true};
    }
    case 'NEWS_FETCHED': {
      let articles = action.data.articles;
      let newsList = new Array<News>();
      for (let item of articles) {
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
      return {...state, newsList: newsList, newsListLoading: false};
    }
    default: {
      return state;
    }
  }
}

export default dataStore;
