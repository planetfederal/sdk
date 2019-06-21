/** Demo of layer list in an SDK map.
 *
 *  Contains a Map and demonstrates adding many types of layers
 *  And a layer list component to manage the layers
 *
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {types, layerListItemSource, layerListItemTarget, collect, collectDrop} from '@boundlessgeo/sdk/components/layer-list-item';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';
import SdkLayerListItem from '@boundlessgeo/sdk/components/layer-list-item';

import {Provider} from 'react-redux';

// Colors from http://colorbrewer2.org
const colors = [
  ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
  ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
  ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529']
];

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class LayerListItem extends SdkLayerListItem {
  render() {
    const layer = this.props.layer;
    const checkbox = this.getVisibilityControl(layer);

    const moveButtons = (
      <span>
        <button className='sdk-btn' onClick={() => {
          this.moveLayerUp();
        }}>
          {this.props.labels.up}
        </button>
        <button className='sdk-btn' onClick={() => {
          this.moveLayerDown();
        }}>
          {this.props.labels.down}
        </button>
        <button className='sdk-btn' onClick={() => {
          this.removeLayer();
        }}>
          {this.props.labels.remove}
        </button>
      </span>
    );

    return this.props.connectDragSource(this.props.connectDropTarget((
      <li className='layer'>
        <span className='checkbox'>{checkbox}</span>
        <span className='name'>{layer.id}</span>
        <span className='btn-container'>{moveButtons}</span>
      </li>
    )));
  }
}

LayerListItem.defaultProps = {
  labels: {
    up: 'Move up',
    down: 'Move down',
    remove: 'Remove layer',
  },
};

// Set up drag and drop
LayerListItem = DropTarget(types, layerListItemTarget, collectDrop)(DragSource(types, layerListItemSource, collect)(LayerListItem));

function main() {
  // Start with a reasonable global view of hte map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // Setup 2 groups - base and loader
  store.dispatch(mapActions.updateMetadata({
    'mapbox:groups': {
      base: {
        name: 'Base Maps',
      },
      loader: {
        name: 'Loader',
      },
    },
  }));

  // Background layers change the background color of
  // the map. They are not attached to a source.
  store.dispatch(mapActions.addLayer({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#eee',
    },
    metadata: {
      'bnd:hide-layerlist': true,
    },
  }));

  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
    metadata: {
      'mapbox:group': 'base'
    }
  }));

  // ESRI Layer
  const baseUrl = 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/';

  // add the ArcGIS rest source
  store.dispatch(mapActions.addSource('esri', {
    type: 'raster',
    tileSize: 256,
    crossOrigin: null, /* service does not support CORS */
    tiles: [
      `${baseUrl}export?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=256%2C256&BBOX={bbox-epsg-3857}&BBOXSR=3857&IMAGESR=3857&DPI=90`,
    ],
  }));

  // Add the highway layer and mark it as queryable, and set query endpoint
  store.dispatch(mapActions.addLayer({
    id: 'highway',
    source: 'esri',
    type: 'raster',
    metadata: {
      'mapbox:group': 'base',
      'bnd:queryable': true,
      'bnd:query-endpoint': `${baseUrl}identify`
    },
  }));

  // Helper function for loading local .json data
  const runFetchGeoJSON = (name, type) => {
    const baseColor = Math.floor(Math.random() * 3);
    store.dispatch(mapActions.addSource(`${name}-source`,
      {type: 'geojson', data: `./data/${name}.json`}));
    if (type === 'circle') {
      // Render Circles
      store.dispatch(mapActions.addLayer({
        id: `${name}-layer`,
        type: 'circle',
        source: `${name}-source`,
        metadata: {
          'mapbox:group': 'loader',  // Add to loader group
        },
        paint: {
          'circle-radius': 5,
          'circle-color': colors[baseColor][Math.floor(Math.random() * 10)],
          'circle-stroke-color': colors[baseColor][Math.floor(Math.random() * 10)],
        },
      }));
    } else if (type === 'fill') {
      //Render Fill
      store.dispatch(mapActions.addLayer({
        id: `${name}-layer`,
        type: 'fill',
        source: `${name}-source`,
        metadata: {
          'mapbox:group': 'loader',  // Add to loader group
        },
        paint: {
          'fill-opacity': 0.7,
          'fill-color': colors[baseColor][Math.floor(Math.random() * 10)],
          'fill-outline-color': colors[baseColor][Math.floor(Math.random() * 10)]
        },
      }));
    }
  };
  runFetchGeoJSON('airports', 'circle');
  runFetchGeoJSON('states', 'fill');
  runFetchGeoJSON('canada', 'fill');

  // 'geojson' sources allow rendering a vector layer
  // with all the features stored as GeoJSON. "data" can
  // be an individual Feature or a FeatureCollection.
  store.dispatch(mapActions.addSource('points', {
    type: 'geojson',
    clusterRadius: 50,
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  }));

  // Show the points in a random colour.
  store.dispatch(mapActions.addLayer({
    id: 'random-points',
    source: 'points',
    type: 'circle',
    paint: {
      'circle-radius': 3,
      'circle-color': colors[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 10)],
      'circle-stroke-color': colors[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 10)],
    },
    filter: ['!has', 'point_count'],
  }));

  // Add a random point to the map
  const addRandomPoints = (nPoints = 10) => {
    // loop over adding a point to the map.
    for (let i = 0; i < nPoints; i++) {
      // the feature is a normal GeoJSON feature definition,
      // 'points' referes to the SOURCE which will get the feature.
      store.dispatch(mapActions.addFeatures('points', [{
        type: 'Feature',
        properties: {
          title: 'Random Point',
          isRandom: true,
        },
        geometry: {
          type: 'Point',
          // this generates a point somewhere on the planet, unbounded.
          coordinates: [(Math.random() * 360) - 180, (Math.random() * 180) - 90],
        },
      }]));
    }
  };

  // add 200 random points to the map on startup
  addRandomPoints(200);

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map'));

  // Add dran and drop to the LayerList
  const DragDropLayerList = DragDropContext(HTML5Backend)(SdkLayerList);

  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <div className='sdk-layerlist'>
        <Provider store={store}>
          <DragDropLayerList layerClass={LayerListItem} />
        </Provider>
      </div>
    </div>
  ), document.getElementById('controls'));
}

main();
