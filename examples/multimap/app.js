/** Multiple map SDK application example.
 *
 *  Contains two Maps with separate stores and shows how to sync them.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkMapInfoReducer from 'webmap-sdk/reducers/mapinfo';
import * as mapActions from 'webmap-sdk/actions/map';

import SdkMap from 'webmap-sdk/components/map';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store1 = createStore(combineReducers({
  map: SdkMapReducer,
  mapinfo: SdkMapInfoReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const store2 = createStore(combineReducers({
  map: SdkMapReducer,
  mapinfo: SdkMapInfoReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the two maps.
  store1.dispatch(mapActions.setView([-93, 45], 2));
  store2.dispatch(mapActions.setView([-93, 45], 2));

  // add the OSM source to map 1
  store1.dispatch(mapActions.addOsmSource('osm'));

  // add carto source to map 2
  store2.dispatch(mapActions.addSource('cartolight', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    type: 'raster',
    tileSize: 256,
    tiles: [
      'http://s.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    ],
  }));

  // and an OSM layer to the store of the first map.
  store1.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  // add a carto light layer to the store of the second map
  store2.dispatch(mapActions.addLayer({
    type: 'raster',
    id: 'cartolight',
    source: 'cartolight',
  }));

  // handle change of the synchronize maps checkbox
  const handleChange = () => {
    const state = store1.getState();
    const center = state.map.center;
    const zoom = state.map.zoom;
    store2.dispatch(mapActions.setView(center, zoom));
  };

  // listen for changes on the first store for center and zoom and apply to the second store
  let unsubscribe;
  const syncMaps = (evt) => {
    if (evt.target.checked && !unsubscribe) {
      unsubscribe = store1.subscribe(handleChange);
    } else {
      unsubscribe();
      unsubscribe = null;
    }
  };

  // place the first map on the page.
  ReactDOM.render(<Provider store={store1}>
    <SdkMap>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map1'));

  // place the second map on the page.
  ReactDOM.render(<Provider store={store2}>
    <SdkMap>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map2'));

  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <p>
        <span className='input'><input type='checkbox' onChange={syncMaps} /></span> Synchronize maps
      </p>
    </div>
  ), document.getElementById('controls'));
}

main();
