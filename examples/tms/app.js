/** TMS SDK application example.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import * as mapActions from 'webmap-sdk/actions/map';

import RendererSwitch from '../rendererswitch';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // add the TMS source
  store.dispatch(mapActions.addSource('tms', {
    type: 'raster',
    scheme: 'tms',
    tileSize: 256,
    attribution: '<a href="http://mapbox.com">MapBox</a> | <a href="http://mapbox.com/tos">Terms of Service</a>',
    maxzoom: 8,
    tiles: [
      'http://a.tiles.mapbox.com/v1/mapbox.geography-class/{z}/{x}/{y}.png',
      'http://b.tiles.mapbox.com/v1/mapbox.geography-class/{z}/{x}/{y}.png',
      'http://c.tiles.mapbox.com/v1/mapbox.geography-class/{z}/{x}/{y}.png',
      'http://d.tiles.mapbox.com/v1/mapbox.geography-class/{z}/{x}/{y}.png',
    ],
  }));

  // add the TMS layer
  store.dispatch(mapActions.addLayer({
    id: 'geographyclass',
    source: 'tms',
    type: 'raster',
  }));

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl /><SdkZoomSlider />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

}

main();
