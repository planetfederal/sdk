/* global it, beforeEach, describe, expect */

import deepFreeze from 'deep-freeze';

import * as actions from 'webmap-sdk/actions/wfs';
import reducer from 'webmap-sdk/reducers/wfs';
import  {WFS} from 'webmap-sdk/action-types';

describe('wfs reducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      sources: {},
      actions: {},
    });
  });

  const SOURCE_CONF = {
    featureNS: 'http://example.com/',
    featurePrefix: 'exmpl',
    typeName: 'examples',
    onlineResource: 'http://example.com/wfs',
    geometryName: 'wkb_geometry',
  };

  function addDummySource() {
    const state = reducer(undefined, actions.addSource('test', SOURCE_CONF));
    expect(state).toEqual({
      sources: {
        test: SOURCE_CONF
      },
      actions: {},
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
      actions: {},
    });
  });

  function addAction() {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1, 1],
      },
      properties: { },
    };
    deepFreeze(feature);
    const action = actions.insertFeature('test', feature);
    deepFreeze(action);
    const state = reducer(undefined, action);
    const action_ids = Object.keys(state.actions);
    expect(action_ids.length).toEqual(1);

    expect(state.actions[action_ids[0]]).toEqual({
      type: WFS.INSERT,
      sourceName: 'test',
      feature,
    });

    return state;
  }

  it('should add an action', () => {
    addAction();
  });

  it('should remove an action when finished', () => {
    let state = addAction();
    let action_id = Object.keys(state.actions)[0];
    state = reducer(state, actions.finishedAction(action_id));

    expect(state).toEqual({
      sources: {},
      actions: {},
    });
  });
});
