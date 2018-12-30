/** Demonstrate working with ArcGIS Rest Feature Services
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import RendererSwitch from '../rendererswitch';

import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import SdkMapInfoReducer from '@boundlessgeo/sdk/reducers/mapinfo';
import SdkEsriReducer from '@boundlessgeo/sdk/reducers/esri';

import SdkHashHistory from '@boundlessgeo/sdk/components/history';

import * as SdkEsriActions from '@boundlessgeo/sdk/actions/esri';

import EsriController from '@boundlessgeo/sdk/components/esri';

import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

// This will have webpack include all of the SDK styles.
import '@boundlessgeo/sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
  esri: SdkEsriReducer,
  mapinfo: SdkMapInfoReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(SdkMapActions.setView([-93, 45], 2));

  // add the OSM source
  store.dispatch(SdkMapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(SdkMapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  const url = 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/';

  const sourceName = 'ksfields';

  // add an empty source that will be fed by the ArcGIS source
  store.dispatch(SdkMapActions.addSource(sourceName, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  }));

  // this will configure the source for ArcGIS Rest.
  store.dispatch(SdkEsriActions.addSource(sourceName, {
    onlineResource: url,
    featureLayer: '0',
  }));

  // add layer for our ksfields source
  store.dispatch(SdkMapActions.addLayer({
    id: 'ksfields',
    source: sourceName,
    type: 'fill',
    paint: {
      'fill-opacity': 0.7,
      'fill-color': '#feb24c',
      'fill-outline-color': '#f03b20',
    },
  }));

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch defaultRenderer='mapbox' style={{position: 'relative'}}>
      <SdkZoomControl style={{position: 'absolute', top: 20, left: 20}} />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  ReactDOM.render((
    <div>
      <Provider store={store}>
        <SdkHashHistory />
        <EsriController />
      </Provider>
    </div>
  ), document.getElementById('controls'));
}

main();
