/** Tests for cluster sources in the map.
 *
 */

/* global it, describe, expect, beforeEach */

import React from 'react';
import VectorSource from 'ol/source/Vector';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import SdkClusterSource from 'webmap-sdk/source/cluster';
import SdkMap from 'webmap-sdk/components/map';
import MapReducer from 'webmap-sdk/reducers/map';
import * as MapActions from 'webmap-sdk/actions/map';

configure({adapter: new Adapter()});

describe('tests for cluster map sources', () => {
  let map;
  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
    }));

    const ref = React.createRef();
    mount(<Provider store={store}><SdkMap ref={ref} /></Provider>);
    map = ref.current;
  });

  const data = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [5, 5],
      },
      properties: {
        sample: 'value',
      },
    }, {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [6, 6],
      },
      properties: {
        sample: 'value2',
      },
    }],
  };

  it('generates cluster geometry in correct projection', (done) => {
    expect.hasAssertions();
    store.dispatch(MapActions.setView([-93, 45], 5));
    const src_name = 'test-source';
    store.dispatch(MapActions.addSource(src_name, {
      type: 'geojson',
      data,
    }));

    setTimeout(() => {
      const src = map.sources[src_name];
      const features = src.getFeatures();
      expect(features.length).toBe(2);
      expect(src).toBeInstanceOf(VectorSource);
      store.dispatch(MapActions.clusterPoints(src_name, true));
      setTimeout(() => {
        const extent = [
          -14679659.940941697,
          3958251.750706631,
          -6025765.346607184,
          7284791.221677501,
        ];
        const resolution = 4891.96981025128;
        const proj = 'EPSG:3857';
        map.sources[src_name].loadFeatures(extent, resolution, proj);
        let cluster = map.sources[src_name];
        expect(cluster).toBeInstanceOf(SdkClusterSource);
        expect(cluster.getDistance()).toBe(50);
        expect(cluster.getFeatures().length).toBe(1);
        const feature = cluster.getFeatures()[0];
        expect(feature.getGeometry().getCoordinates()[0]).not.toBe(5.5);
        store.dispatch(MapActions.setClusterRadius(src_name, 10));
        window.setTimeout(() => {
          cluster = map.sources[src_name];
          expect(cluster.getDistance()).toBe(10);
          store.dispatch(MapActions.clusterPoints(src_name, false));
          window.setTimeout(() => {
            cluster = map.sources[src_name];
            expect(cluster).toBeInstanceOf(VectorSource);
            // re cluster and check radius
            store.dispatch(MapActions.clusterPoints(src_name, true));
            window.setTimeout(() => {
              cluster = map.sources[src_name];
              expect(cluster).toBeInstanceOf(SdkClusterSource);
              expect(cluster.getDistance()).toBe(10);
              done();
            }, 0);
          }, 0);
        }, 0);
      }, 100);
    }, 100);
  });
});
