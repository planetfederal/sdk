/** Very basic SDK application example with a feature table and some data fetch
 *
 *  Contains a Map and demonstrates some of the dynamics of
 *  using the store.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkMap from 'webmap-sdk/components/map';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMapReducer from 'webmap-sdk/reducers/map';

import SdkTable from './table';

import * as mapActions from 'webmap-sdk/actions/map';

import fetch from 'isomorphic-fetch';


// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a view of the sample data location
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
  store.dispatch(mapActions.addSource('dynamic-source', {type: 'geojson'}));

  // Fetch the geoJson file from a url and add it to the map at the named source
  const addLayerFromGeoJSON = (url, sourceName) => {
    store.dispatch(mapActions.addLayer({
      id: 'dynamic-layer',
      type: 'symbol',
      source: 'dynamic-source',
      layout: {
        'text-font': [
          'FontAwesome normal',
        ],
        'text-size': 18,
        'icon-optional': true,
        // airplane icon
        'text-field': '\uf072',
      },
      paint: {
        'text-color': '#CF5300',
      },
    }));

    // Fetch URL
    fetch(url)
      .then(
        response => response.json(),
        error => console.error('An error occured.', error),
      )
      // addFeatures with the features, source name
      .then(json => store.dispatch(mapActions.addFeatures(sourceName, json)))
      .catch((exception) => {
        console.error('An error occurred.', exception);
      });
  };

  // This is called by the onClick, keeping the onClick HTML clean
  const runFetchGeoJSON = () => {
    const url = './data/airports.json';
    addLayerFromGeoJSON(url, 'dynamic-source');
  };

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <button className='sdk-btn' onClick={runFetchGeoJSON}>Fetch Data</button>
      <div>
        <Provider store={store}>
          <SdkTable />
        </Provider>
      </div>
    </div>
  ), document.getElementById('controls'));
}

main();
