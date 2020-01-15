/* global MAPBOX_API_KEY */
/** Realtime data example.
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import RendererSwitch from '../rendererswitch';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkMapboxReducer from 'webmap-sdk/reducers/mapbox';
import * as mapActions from 'webmap-sdk/actions/map';
import * as mapboxActions from 'webmap-sdk/actions/mapbox';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
  mapbox: SdkMapboxReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/bright-v8';
  store.dispatch(mapboxActions.configure({baseUrl, accessToken: MAPBOX_API_KEY}));

  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // set the sprite so we can use icon-image
  store.dispatch(mapActions.setSprite('mapbox://sprites/mapbox/bright-v8'));

  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  const url = 'https://wanderdrone.appspot.com/';

  // add our drone source
  store.dispatch(mapActions.addSource('drone', {type: 'geojson', data: url}));

  // add our drone layer with an icon-image from the sprite
  store.dispatch(mapActions.addLayer({
    id: 'drone',
    type: 'symbol',
    source: 'drone',
    layout: {
      'icon-image': 'rocket-15'
    }
  }));

  // update the data every 2 seconds
  window.setInterval(function() {
    store.dispatch(mapActions.updateSource('drone', {data: url}));
  }, 2000);

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));
}

main();
