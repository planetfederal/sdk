/** Rotating map application example.
 *
 *  Contains a Map and demonstrates dynamically updating its rotation.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import RendererSwitch from '../rendererswitch';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import * as mapActions from 'webmap-sdk/actions/map';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  const rotate = (dir) => {
    const bearing = store.getState().map.bearing;
    let calc, interval = 15;
    if (dir === 'pos') {
      calc = bearing + interval;
    } else if (dir === 'neg') {
      calc = bearing - interval;
    }
    const new_bearing = calc % 360;
    store.dispatch(mapActions.setBearing(new_bearing));
  };

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <button className='sdk-btn' onClick={() => {
        rotate('neg');
      }}>Rotate Clockwise</button>
      <button className='sdk-btn' onClick={() => {
        rotate('pos');
      }}>Rotate Counter Clockwise</button>
    </div>
  ), document.getElementById('controls'));
}

main();
