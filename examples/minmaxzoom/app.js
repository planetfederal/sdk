/** Min/max zoom level example.
 *
 *  Contains a Map and demonstrates setting min and max zoom level on the map and layer level.
 *
 */

import {createStore, combineReducers} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

import {connect, Provider} from 'react-redux';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';
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

  // Restrict the zoom levels of the map
  store.dispatch(mapActions.updateMetadata({
    'bnd:minzoom': 3,
    'bnd:maxzoom': 20,
  }));

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

  // Function to recenter the map on null-island.
  const zoomToNullIsland = () => {
    store.dispatch(mapActions.setView([0, 0], 5));
  };

  // Updates minzoom level on Null Island layer to 2.
  const updateMinzoom = () => {
    store.dispatch(mapActions.updateLayer('null-island', {
      minzoom: 5,
    }));
  };

  let ZoomLevel = (props) => {
    return (
      <form><label>Zoom level: </label><output name='zoom'>{props.zoom}</output></form>
    );
  };

  function zoomLevelStateToProps(state) {
    return {
      zoom: state.map.zoom,
    };
  }

  ZoomLevel = connect(zoomLevelStateToProps)(ZoomLevel);

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl />
      <SdkZoomSlider />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <Provider store={store}><ZoomLevel /></Provider>
      <button className='sdk-btn' onClick={zoomToNullIsland}>Zoom to Null Island</button>
      <button className='sdk-btn' onClick={updateMinzoom}>Change Minimum Zoom Level on Null Island to 5</button>
    </div>
  ), document.getElementById('controls'));
}

main();
