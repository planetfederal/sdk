/** SDK  showing filters application example.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import RendererSwitch from '../rendererswitch';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import * as mapActions from 'webmap-sdk/actions/map';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([0, 0], 1));

  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  const loadJson = (sourceName) => {
    store.dispatch(mapActions.addSource('shapes', {type: 'geojson', data: 'shapes.geojson'}));
    store.dispatch(mapActions.addLayer({
      id: 'shapes_fill',
      source: 'shapes',
      type: 'fill',
      paint: {
        'fill-opacity': 0.7,
        'fill-color': '#feb24c',
        'fill-outline-color': '#f03b20',
      },
    }));
    store.dispatch(mapActions.addLayer({
      id: 'shapes_line',
      source: 'shapes',
      type: 'line',
      paint: {
        'line-color': '#005500',
        'line-width': 1,
      },
    }));
    store.dispatch(mapActions.addLayer({
      id: 'shapes_point',
      source: 'shapes',
      type: 'circle',
      paint: {
        'circle-color': '#7F0303',
        'circle-stroke-width': 1,
        'circle-radius': 5,
      },
    }));
  };
  loadJson();
  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl />
      <SdkZoomSlider />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <Provider store={store}>
      </Provider>
    </div>
  ), document.getElementById('controls'));
}


main();
