/* global describe, it, expect */

import * as actions from 'webmap-sdk/actions/esri';
import {ESRI} from 'webmap-sdk/action-types';

describe('test that esri actions are properly created', () => {

  const DUMMY_SOURCE = 'Onion';

  it('should issue an action to add a source', () => {
    const source_meta = {
      onlineResource: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/',
      featureLayer: '0',
    };

    expect(actions.addSource(DUMMY_SOURCE, source_meta)).toEqual({
      type: ESRI.ADD_SOURCE,
      sourceName: DUMMY_SOURCE,
      sourceDef: source_meta,
    });
  });

  it('should issue an action to remove a configured source', () => {
    expect(actions.removeSource(DUMMY_SOURCE)).toEqual({
      type: ESRI.REMOVE_SOURCE,
      sourceName: DUMMY_SOURCE,
    });
  });

});

