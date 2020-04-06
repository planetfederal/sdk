/* global it, describe, expect, afterEach */

import React from 'react';
import {mount, configure} from 'enzyme';
import nock from 'nock';
import  Adapter from 'enzyme-adapter-react-16';

import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

import EsriReducer from 'webmap-sdk/reducers/esri';
import MapReducer from 'webmap-sdk/reducers/map';
import MapInfoReducer from 'webmap-sdk/reducers/mapinfo';
import EsriController from 'webmap-sdk/components/esri';
import * as mapActions from 'webmap-sdk/actions/map';
import {addSource} from 'webmap-sdk/actions/esri';

configure({adapter: new Adapter()});

describe('EsriController component.', () => {
  let store = null;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
      mapinfo: MapInfoReducer,
      esri: EsriReducer,
    }));
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('creates the controller', () => {
    mount(<Provider store={store}><EsriController /></Provider>);
  });

  it('fetches data', (done) => {
    const url = 'http://foo/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/';

    const sourceName = 'esri';
    store.dispatch(mapActions.addSource(sourceName, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }));

    store.dispatch(addSource(sourceName, {
      onlineResource: url,
      featureLayer: '0',
    }));

    // eslint-disable-next-line
    const response = {"objectIdFieldName": "objectid", "globalIdFieldName": "", "features":[{"geometry":{"rings":[[[-96.278091885138821,38.927731181630165],[-96.280418736945592,38.927737073779312],[-96.280440509314062,38.929547635844841],[-96.280462500984058,38.931375718977456],[-96.28048433805975,38.93319192415305],[-96.280506153566108,38.935006154465796],[-96.278178333415923,38.934984698019115],[-96.275853148336566,38.934963228985943],[-96.273520745139592,38.9349417149799],[-96.2711838389382,38.934920115535732],[-96.271163479319469,38.933108556253835],[-96.271143232031477,38.931308125812144],[-96.271122947885075,38.929505744788827],[-96.271102646660637,38.927702079565265],[-96.273046333798135,38.927718145962622],[-96.273433074164174,38.927719167105799],[-96.275762977436827,38.927725235520825],[-96.278091885138821,38.927731181630165]]]},"attributes":{"objectid":6355,"field_kid":"1000152586","approxacre":159,"field_name":"MILL CREEK SOUTHWEST","status":"Active","prod_gas":"No","prod_oil":"Yes","activeprod":"OIL","cumm_oil":49233.029999999999,"maxoilwell":2,"lastoilpro":63.770000000000003,"lastoilwel":1,"lastodate":"3-2002","cumm_gas":0,"maxgaswell":0,"lastgaspro":0,"lastgaswel":0,"lastgdate":" ","avgdepth":3182,"avgdepthsl":1985,"polydate":1193788800000,"field_type":"OIL","field_kidn":1000152586}}]};

    nock('http://foo')
      .get('/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-489196.98102512804%2C%22ymin%22%3A-489196.98102512874%2C%22xmax%22%3A489196.98102512804%2C%22ymax%22%3A489196.98102512734%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=4326')
      .reply(200, response);

    expect(store.getState().map.sources[sourceName].data.features).toHaveLength(0);

    mount(<Provider store={store}><EsriController /></Provider>);

    setTimeout(() => {
      expect(store.getState().map.sources[sourceName].data.features).toHaveLength(1);
      done();
    }, 500);
  });
});
