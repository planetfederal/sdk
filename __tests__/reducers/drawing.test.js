/* global it, describe, expect */

import deepFreeze from 'deep-freeze';

import * as actions from 'webmap-sdk/actions/drawing';
import reducer from 'webmap-sdk/reducers/drawing';
import {DRAWING} from 'webmap-sdk/action-types';

describe('drawing reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      interaction: null,
      sourceName: null,
      feature: null,
      measureFeature: null,
      measureSegments: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      measureDone: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    });
  });

  it('should set the interaction and sourceName', () => {
    const source_name = 'points-test';
    const geo_type = 'Point';

    const test_action = {
      type: DRAWING.START,
      interaction: geo_type,
      sourceName: source_name,
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: geo_type,
      sourceName: source_name,
      measureFeature: null,
      measureSegments: null,
      currentMode: undefined,
      afterMode: undefined,
      currentModeOptions: undefined,
      measureDone: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
  });

  it('should set the feature for modification', () => {
    const source_name = 'points-test';

    const test_action = {
      type: DRAWING.START,
      interaction: 'Modify',
      sourceName: source_name,
      feature: {
        type: 'Feature',
        properties: {
          foo: 'bar'
        },
        geometry: {
          type: 'Point',
          coordinates: [125.6, 10.1]
        }
      },
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: 'Modify',
      sourceName: source_name,
      feature: test_action.feature,
      measureFeature: null,
      measureSegments: null,
      currentMode: undefined,
      afterMode: undefined,
      currentModeOptions: undefined,
      measureDone: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
  });

  it('should null out all the things', () => {
    const initial_state = {
      interaction: 'Point',
      sourceName: 'test-points',
    };
    deepFreeze(initial_state);

    const expected_state = {
      interaction: null,
      sourceName: null,
      currentMode: undefined,
      afterMode: undefined,
      currentModeOptions: null,
      measureDone: false,
      measureFeature: null,
      measureSegments: null,
    };

    expect(reducer(initial_state, {type: DRAWING.END})).toEqual(expected_state);
  });

  it('should set and clear the measure feature and segments', () => {
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Line',
        coordinates: [
          [0, 0], [1, 1], [2, 2],
        ],
      },
    };
    const segs = [1, 1];

    deepFreeze(line);
    deepFreeze(segs);

    const state = reducer(undefined, actions.setMeasureFeature(line, segs));
    deepFreeze(state);

    expect(state).toEqual({
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: line,
      measureSegments: segs,
      measureDone: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    });

    const cleared_state = reducer(state, actions.clearMeasureFeature(line, segs));
    expect(cleared_state).toEqual({
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    });
  });

  it('should finalize the measure feature', () => {
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Line',
        coordinates: [
          [0, 0], [1, 1], [2, 2],
        ],
      },
    };
    const segs = [1, 1];

    deepFreeze(line);
    deepFreeze(segs);

    let state = reducer(undefined, actions.setMeasureFeature(line, segs));
    state = reducer(state, actions.finalizeMeasureFeature());
    deepFreeze(state);

    expect(state).toEqual({
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: line,
      measureSegments: segs,
      measureDone: true,
      measureFinishGeometry: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    });
  });

  it('should finish the measure geometry', () => {
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Line',
        coordinates: [
          [0, 0], [1, 1], [2, 2],
        ],
      },
    };
    const segs = [1, 1];

    deepFreeze(line);
    deepFreeze(segs);

    let state = reducer(undefined, actions.setMeasureFeature(line, segs));
    state = reducer(state, actions.finishMeasureGeometry());
    deepFreeze(state);

    expect(state).toEqual({
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: line,
      measureSegments: segs,
      measureDone: false,
      measureFinishGeometry: true,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: null
    });
  });

  it('should change the select style', () => {
    const selectStyle = 'Point';

    const test_action = {
      type: DRAWING.SET_SELECT_STYLE,
      selectStyle: selectStyle
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: null,
      modifyStyle: null,
      measureStyle: null,
      selectStyle: selectStyle
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
  });

  it('should change the modify style', () => {
    const modifyStyle = 'Point';

    const test_action = {
      type: DRAWING.SET_MODIFY_STYLE,
      modifyStyle: modifyStyle
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: null,
      measureStyle: null,
      modifyStyle: modifyStyle,
      selectStyle: null
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
  });

  it('should change the edit style', () => {
    const editStyle = 'Point';

    const test_action = {
      type: DRAWING.SET_EDIT_STYLE,
      editStyle: editStyle
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: editStyle,
      measureStyle: null,
      modifyStyle: null,
      selectStyle: null
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
  });

  it('should change the measure style', () => {
    const measureStyle = 'MEASURE';

    const test_action = {
      type: DRAWING.SET_MEASURE_STYLE,
      measureStyle,
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      feature: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: null,
      measureStyle: 'MEASURE',
      modifyStyle: null,
      selectStyle: null
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
  });


  it('should keep the style even if drawing end', () => {
    const editStyle = 'Point';

    const test_action = {
      type: DRAWING.SET_EDIT_STYLE,
      editStyle: editStyle
    };
    deepFreeze(test_action);

    const expected_state = {
      interaction: null,
      sourceName: null,
      currentMode: null,
      afterMode: null,
      currentModeOptions: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      feature: null,
      editStyle: editStyle,
      measureStyle: null,
      modifyStyle: null,
      selectStyle: null
    };

    expect(reducer(undefined, test_action)).toEqual(expected_state);
    const source_name = 'points-test';
    const geo_type = 'Point';

    const test_action_start = {
      type: DRAWING.START,
      interaction: geo_type,
      sourceName: source_name,
    };
    const expected_state_in_between = {
      interaction: geo_type,
      sourceName: source_name,
      currentMode: undefined,
      afterMode: undefined,
      currentModeOptions: undefined,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: editStyle,
      measureStyle: null,
      modifyStyle: null,
      selectStyle: null
    };

    const expected_end_state = {
      interaction: null,
      sourceName: null,
      currentMode: undefined,
      afterMode: undefined,
      currentModeOptions: null,
      measureFeature: null,
      measureSegments: null,
      measureDone: false,
      editStyle: editStyle,
      measureStyle: null,
      modifyStyle: null,
      selectStyle: null
    };

    deepFreeze(test_action_start);
    expect(reducer(expected_state, test_action_start)).toEqual(expected_state_in_between);
    expect(reducer(expected_state_in_between, {type: DRAWING.END})).toEqual(expected_end_state);
  });

});
