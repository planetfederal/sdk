/* global it, beforeEach, describe, expect */

import * as actions from 'webmap-sdk/actions/esri';
import reducer from 'webmap-sdk/reducers/esri';

describe('Esri reducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      sources: {},
    });
  });

  const SOURCE_CONF = {
    onlineResource: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/',
    featureLayer: '0',
  };

  function addDummySource() {
    const state = reducer(undefined, actions.addSource('test', SOURCE_CONF));
    expect(state).toEqual({
      sources: {
        test: SOURCE_CONF
      },
    });

    return state;
  }

  it('should add a source', () => {
    addDummySource();
  });

  it('should remove a source', () => {
    let state = addDummySource();
    expect(reducer(state, actions.removeSource('test'))).toEqual({
      sources: {},
    });
  });

});
