/* global it, describe, expect */

import React from 'react';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';
import createSagaMiddleware from 'redux-saga';
import TileLayer from 'ol/layer/Tile';
import TileWMSSource from 'ol/source/TileWMS';
import XYZSource from 'ol/source/XYZ';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import ConnectedMap from '@boundlessgeo/sdk/components/map';
import MapReducer from '@boundlessgeo/sdk/reducers/map';
import * as MapActions from '@boundlessgeo/sdk/actions/map';
import * as ContextSagas from '@boundlessgeo/sdk/sagas/context';

configure({adapter: new Adapter()});

const sagaMiddleware = createSagaMiddleware();

describe('Map component context documents', () => {
  it('should correctly reload context documents', (done) => {
    const store = createStore(combineReducers({
      map: MapReducer,
    }), applyMiddleware(sagaMiddleware));

    sagaMiddleware.run(ContextSagas.handleContext);

    const ref = React.createRef();
    mount(<Provider store={store}><ConnectedMap ref={ref} /></Provider>);
    const map = ref.current;

    const wmsJson = {
      version: 8,
      name: 'states-wms',
      center: [-98.78906130124426, 37.92686191312036],
      zoom: 4,
      sources: {
        states: {
          type: 'raster',
          maxzoom: 12,
          tileSize: 256,
          tiles: ['https://ahocevar.com/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&SRS=EPSG:900913&LAYERS=topp:states&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}'],
        },
      },
      layers: [
        {
          id: 'states-wms',
          source: 'states',
        },
      ],
    };
    store.dispatch(MapActions.fetchContext({json: wmsJson}));
    window.setTimeout(() => {
      let layers = map.map.getLayers().getArray();
      expect(layers[0]).toBeInstanceOf(TileLayer);
      expect(layers[0].getSource()).toBeInstanceOf(TileWMSSource);
      const osmJson = {
        version: 8,
        name: 'osm',
        center: [-98.78906130124426, 37.92686191312036],
        zoom: 4,
        sources: {
          osm: {
            type: 'raster',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
            tileSize: 256,
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
          },
        },
        layers: [
          {
            id: 'osm',
            source: 'osm',
          },
        ],
      };
      store.dispatch(MapActions.fetchContext({json: osmJson}));
      window.setTimeout(() => {
        layers = map.map.getLayers().getArray();
        expect(layers[0]).toBeInstanceOf(TileLayer);
        expect(layers[0].getSource()).toBeInstanceOf(XYZSource);
        done();
      }, 0);
    }, 0);
  });
});
