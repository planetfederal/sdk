/** Show some sprites on the map
 *
 *  Duck, duck, GOOSE!
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
  // setup the map sprites.
  const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
  store.dispatch(mapActions.setSprite(`${baseUrl}/sprites`));

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
    data: {},
  }));

  // Define a layer to render the features from
  // the points source as icons.
  store.dispatch(mapActions.addLayer({
    id: 'symbols',
    source: 'points',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
    },
  }));

  // Add a Point with an Icon to the points source.
  const addSymbol = (x, y, icon) => {
    store.dispatch(mapActions.addFeatures('points', [{
      type: 'Feature',
      properties: {
        // ensure the icon property is set.
        icon,
      },
      geometry: {
        type: 'Point',
        coordinates: [x, y],
      },
    }]));
  };

  // These are syntactically correct but philosophically wrong,
  //  as the game is technically "Duck, Duck, Grey Duck"
  addSymbol(-45, 0, 'duck');
  addSymbol(0, 0, 'duck');

  store.dispatch(mapActions.addSource('points-change', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [45, 0],
      },
    },
  }));

  store.dispatch(mapActions.addLayer({
    id: 'symbols-change',
    source: 'points-change',
    type: 'symbol',
    layout: {
      'icon-image': 'grey-duck',
    },
  }));

  const updateSprite = (icon) => {
    store.dispatch(mapActions.updateLayer('symbols-change', {
      layout: {
        'icon-image': icon,
      },
    }));
  };

  const duckToGoose = () => {
    updateSprite('goose');
  };

  const gooseToDuck = () => {
    updateSprite('grey-duck');
  };

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <button className='sdk-btn' onClick={duckToGoose}>Duck, Duck, Goose</button>
      <button className='sdk-btn' onClick={gooseToDuck}>Duck, Duck, Grey Duck</button>
    </div>
  ), document.getElementById('controls'));
}

main();
