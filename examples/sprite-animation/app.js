/** Sprite animation example.
 *
 *  Contains a Map and demonstrates how to animate features with a sprite icon.
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkMap from 'webmap-sdk/components/map';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import * as mapActions from 'webmap-sdk/actions/map';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
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

  // 'geojson' sources allow rendering a vector layer
  // with all the features stored as GeoJSON.
  store.dispatch(mapActions.addSource('points', {
    type: 'geojson',
  }));

  // Show our layer of spinning helicopters in red.
  store.dispatch(mapActions.addLayer({
    id: 'red_helicopters',
    metadata: {
      'bnd:animate-sprite': {
        src: 'chopper-small.png',
        color: [255, 0, 0],
        width: 30.5,
        height: 32,
        frameRate: 200,
        spriteCount: 4,
        rotation: {
          property: 'rotation'
        },
      }
    },
    source: 'points',
    type: 'symbol',
    filter: ['==', 'visible', 1],
  }));

  // show the other set of spinning helicopters
  store.dispatch(mapActions.addLayer({
    id: 'helicopters',
    metadata: {
      'bnd:animate-sprite': {
        src: 'chopper-small.png',
        width: 30.5,
        height: 32,
        frameRate: 200,
        spriteCount: 4,
        rotation: {
          property: 'rotation'
        },
      }
    },
    source: 'points',
    type: 'symbol',
    filter: ['==', 'visible', 0],
  }));

  // Adds 10 random points to the map
  const addRandomPoints = () => {
    // loop over adding points one-by-one to the map.
    for (let i = 0; i < 10; i++) {
      // 'points' refers to the SOURCE which will get the point feature,
      // the feature is a normal GeoJSON feature definition.
      store.dispatch(mapActions.addFeatures('points', [{
        type: 'Feature',
        properties: {
          visible: i % 2,
          rotation: (Math.random() * 360) / Math.PI,
        },
        geometry: {
          type: 'Point',
          // this generates a random point somewhere on the planet, unbounded.
          coordinates: [(Math.random() * 360) - 180, (Math.random() * 180) - 90],
        },
      }]));
    }
  };

  // add 10 helicopters
  addRandomPoints();

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap>
      <SdkZoomControl />
      <SdkZoomSlider />
    </SdkMap>
  </Provider>, document.getElementById('map'));
}

main();
