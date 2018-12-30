/** Very basic SDK application example.
 *
 *  Contains a Map and demonstrates some of the dynamics of
 *  using the store.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import SdkHashHistory from '@boundlessgeo/sdk/components/history';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import SdkMapInfoReducer from '@boundlessgeo/sdk/reducers/mapinfo';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

import RendererSwitch from '../rendererswitch';

// This will have webpack include all of the SDK styles.
import '@boundlessgeo/sdk/stylesheet/sdk.scss';

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

  // 'geojson' sources allow rendering a vector layer
  // with all the features stored as GeoJSON. "data" can
  // be an individual Feature or a FeatureCollection.
  store.dispatch(mapActions.addSource('points', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {
        title: 'Null Island',
      },
    },
  }));

  // Show null island as a layer.
  store.dispatch(mapActions.addLayer({
    id: 'null-island',
    source: 'points',
    type: 'circle',
    paint: {
      'circle-radius': 3,
      'circle-color': '#feb24c',
      'circle-stroke-color': '#f03b20',
    },
    filter: ['==', 'title', 'Null Island'],
  }));

  // The points source has both null island
  // and random points on it. This layer
  // will style all random points as purple instead
  // of orange.
  store.dispatch(mapActions.addLayer({
    id: 'random-points',
    source: 'points',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#756bb1',
      'circle-stroke-color': '#756bb1',
    },
    filter: ['==', 'isRandom', true],
  }));

  // Function to recenter the map on null-island.
  const zoomToNullIsland = () => {
    store.dispatch(mapActions.setView([0, 0], 5));
  };

  // Adds 10 random points to the map
  const addRandomPoints = () => {
    // loop over adding points one-by-one to the map.
    for (let i = 0; i < 10; i++) {
      // 'points' refers to the SOURCE which will get the point feature,
      // the feature is a normal GeoJSON feature definition.
      store.dispatch(mapActions.addFeatures('points', [{
        type: 'Feature',
        properties: {
          title: 'Random Point',
          isRandom: true,
        },
        geometry: {
          type: 'Point',
          // this generates a random point somewhere on the planet, unbounded.
          coordinates: [(Math.random() * 360) - 180, (Math.random() * 180) - 90],
        },
      }]));
    }
  };

  // Removing features uses Mapbox GL Spec filters https://www.mapbox.com/mapbox-gl-js/style-spec/#types-filter.
  const removeRandomPoints = () => {
    store.dispatch(mapActions.removeFeatures('points', ['==', 'isRandom', true]));
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
      <button className='sdk-btn' onClick={zoomToNullIsland}>Zoom to Null Island</button>
      <button className='sdk-btn' onClick={addRandomPoints}>Add 10 random points</button>
      <button className='sdk-btn blue' onClick={removeRandomPoints}>Remove random points</button>

      {/*SdkHashHistory provides a log of coordinates in the url hash*/}
      <Provider store={store}>
        <SdkHashHistory />
      </Provider>

    </div>
  ), document.getElementById('controls'));
}

main();
