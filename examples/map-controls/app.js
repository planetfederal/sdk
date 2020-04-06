/** Map Controls example.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';
import SdkMousePosition from 'webmap-sdk/components/map/mouseposition';
import SdkScaleLine from 'webmap-sdk/components/map/scaleline';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkMapInfoReducer from 'webmap-sdk/reducers/mapinfo';
import * as mapActions from 'webmap-sdk/actions/map';

import RendererSwitch from '../rendererswitch';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
  mapinfo: SdkMapInfoReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkScaleLine />
      <SdkMousePosition style={{position: 'absolute', top: 20, right: 12, zIndex: 1, width: '5em'}} />
      <SdkZoomControl />
      <SdkZoomSlider />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

}

main();
