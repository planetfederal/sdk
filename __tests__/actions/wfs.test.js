/* global describe, it, expect */

import * as actions from 'webmap-sdk/actions/wfs';
import {WFS} from 'webmap-sdk/action-types';

describe('test that wfs actions are properly created', () => {
  const DUMMY_FEATURE = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [1, 1],
    },
    properties: {
      label: 'silly',
    },
  };

  const DUMMY_SOURCE = 'Onion';

  function testWfsOperation(actionFn, type) {
    const action = actionFn(DUMMY_SOURCE, DUMMY_FEATURE);
    expect(action).toEqual({
      type,
      sourceName: DUMMY_SOURCE,
      feature: DUMMY_FEATURE,
    });
  }

  it('should create an insert action', () => {
    testWfsOperation(actions.insertFeature, WFS.INSERT);
  });


  it('should create an update action', () => {
    testWfsOperation(actions.updateFeature, WFS.UPDATE);
  });

  it('should create an delete action', () => {
    testWfsOperation(actions.deleteFeature, WFS.DELETE);
  });

  it('should issue a finish operation', () => {
    const id = 'abcdef';
    expect(actions.finishedAction(id)).toEqual({
      type: WFS.FINISHED,
      id,
    });
  });

  it('should issue an action to configure a source', () => {
    const source_meta = {
      featureNS: 'http://example.com/',
      featurePrefix: 'exmpl',
      typeName: 'examples',
      onlineResource: 'http://example.com/wfs',
      geometryName: 'wkb_geometry',
    };

    expect(actions.addSource(DUMMY_SOURCE, source_meta)).toEqual({
      type: WFS.ADD_SOURCE,
      sourceName: DUMMY_SOURCE,
      sourceDef: source_meta,
    });
  });

  it('should issue an aciton to remove a configured source', () => {
    expect(actions.removeSource(DUMMY_SOURCE)).toEqual({
      type: WFS.REMOVE_SOURCE,
      sourceName: DUMMY_SOURCE,
    });
  });


});

