/** Demonstrate working with WFS-T
 *
 *  Uses a tracts layer served from GeoServer to
 *  do WFS-T stuff.
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import SdkHashHistory from '@boundlessgeo/sdk/components/history';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import SdkDrawingReducer from '@boundlessgeo/sdk/reducers/drawing';
import SdkWfsReducer from '@boundlessgeo/sdk/reducers/wfs';

import * as SdkDrawingActions from '@boundlessgeo/sdk/actions/drawing';
import * as SdkWfsActions from '@boundlessgeo/sdk/actions/wfs';


import WfsController from '@boundlessgeo/sdk/components/wfs';

import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

// This will have webpack include all of the SDK styles.
import '@boundlessgeo/sdk/stylesheet/sdk.scss';

import EditPanel from './edit-panel';

const store = createStore(combineReducers({
  map: SdkMapReducer,
  drawing: SdkDrawingReducer,
  wfs: SdkWfsReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(SdkMapActions.setView([-93, 45], 2));

  // add the OSM source
  store.dispatch(SdkMapActions.addOsmSource('osm'));

  const tracts_url = 'https://demo.boundlessgeo.com/geoserver/wfs?SRSNAME=EPSG:3857&REQUEST=GetFeature&TYPENAME=opengeo:tracts&VERSION=1.1.0&OUTPUTFORMAT=JSON';

  store.dispatch(SdkMapActions.addSource('tracts', {
    type: 'geojson',
    data: tracts_url,
  }));

  // this will configure the source for WFS editing.
  store.dispatch(SdkWfsActions.addSource('tracts', {
    onlineResource: 'https://demo.boundlessgeo.com/geoserver/wfs',
    featureNS: 'http://www.opengeo.org',
    featurePrefix: 'opengeo',
    typeName: 'opengeo:tracts',
    geometryName: 'geom',
  }));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(SdkMapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  const colors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];

  for (let i = 0, ii = colors.length; i < ii; i++) {
    store.dispatch(SdkMapActions.addLayer({
      id: `tracts-${i}`,
      type: 'fill',
      source: 'tracts',
      paint: {
        'fill-color': colors[i],
        'fill-opacity': 0.5,
        'fill-outline-color': 'black',
      },
      filter: ['==', 'color', i],
    }));
  }

  let edit_panel = null;

  const selectFeature = (map, coordinate, collection) => {
    let feature;
    if (collection && collection.features && collection.features.length > 0) {
      feature = collection.features[0];
    }
    edit_panel.setState({feature});
  };

  const updateFeature = (feature, color) => {
    if (feature) {
      // change the color
      feature.properties.color = color;
      // clear the selected feature from the panel
      edit_panel.setState({feature: null});
      // trigger a WFS update.
      store.dispatch(SdkWfsActions.updateFeature('tracts', feature));
    }
  };

  const onError = (error, action, id) => {
    store.dispatch(SdkDrawingActions.endSelect());
    store.dispatch(SdkDrawingActions.startSelect('tracts'));
    alert(error.message);
  };

  const onFinish = (response, action) => {
    store.dispatch(SdkMapActions.updateSource(action.sourceName, {
      data: `${tracts_url}&_random=${Math.random()}`,
    }));
    store.dispatch(SdkDrawingActions.endSelect());
    store.dispatch(SdkDrawingActions.startSelect('tracts'));
  };

  store.dispatch(SdkDrawingActions.startSelect('tracts'));

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap onFeatureSelected={selectFeature} style={{position: 'relative'}}>
      <SdkZoomControl style={{position: 'absolute', top: 20, left: 20}} />
    </SdkMap>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <p>
        <b>Click on a Census Tract to change its color.</b><br/>
      </p>
      <Provider store={store}>
        <SdkHashHistory />

        <EditPanel onChange={ updateFeature } colors={colors} ref={ (pnl) => {
          edit_panel = pnl;
        }} />

        <WfsController onRequestError={ onError } onFinishTransaction={ onFinish }/>
      </Provider>
    </div>
  ), document.getElementById('controls'));
}

main();
