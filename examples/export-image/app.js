/* global saveAs */
/** Demo of using the drawing, modify, and select interactions.
 *
 */

import {createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkMap from 'webmap-sdk/components/map';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkPrintReducer from 'webmap-sdk/reducers/print';
import * as mapActions from 'webmap-sdk/actions/map';
import * as printActions from 'webmap-sdk/actions/print';

import * as ContextSagas from 'webmap-sdk/sagas/context';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

// create the saga middleware
const saga_middleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  map: SdkMapReducer,
  print: SdkPrintReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
applyMiddleware(saga_middleware));

saga_middleware.run(ContextSagas.handleContext);

function main() {
  const url = 'wms.json';
  store.dispatch(mapActions.fetchContext({url}));

  const exportMapImage = (blob) => {
    saveAs(blob, 'map.png');
    store.dispatch(printActions.receiveMapImage());
  };

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap onExportImage={exportMapImage}>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map'));

  // called by the onExportImage prop of the SdkMap.
  const exportImage = () => {
    store.dispatch(printActions.exportMapImage());
  };

  // add a button to demo the action.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <button className='sdk-btn' onClick={exportImage}>Export map image</button>
    </div>
  ), document.getElementById('controls'));
}

main();
