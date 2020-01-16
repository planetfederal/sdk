/* global saveAs */
/** Demo adding a map through mapbox style and exporting the map's endpoints to a file.
 *
 */
import {createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkMap from 'webmap-sdk/components/map';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import * as mapActions from 'webmap-sdk/actions/map';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

import ContextSelector from './context-selector';

import * as ContextSagas from 'webmap-sdk/sagas/context';

const saga_middleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
applyMiddleware(saga_middleware));

saga_middleware.run(ContextSagas.handleContext);

function main() {
  // add a background layer
  store.dispatch(mapActions.addLayer({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#eee',
    },
  }));

  const exportMapSpec = () => {
    const map_spec = store.getState().map;
    const text = JSON.stringify(map_spec);
    const file = new File([text], 'my_map', {type: 'application/json'});
    saveAs(file, 'my_map.json');
  };

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map'));

  // add a button to demo the action.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <Provider store={store}>
        <ContextSelector />
      </Provider>
      <h1>Save a Map</h1>
      <h2>To <a href='https://www.mapbox.com/mapbox-gl-js/style-spec/'>Mapbox Style Specification</a></h2>
      <button className='sdk-btn' onClick={exportMapSpec}>Save Map</button>
    </div>
  ), document.getElementById('controls'));
}

main();
