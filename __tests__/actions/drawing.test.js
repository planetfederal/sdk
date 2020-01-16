/* global describe, it, expect */

import * as actions from 'webmap-sdk/actions/drawing';
import {DRAWING} from 'webmap-sdk/action-types';
import {INTERACTIONS} from 'webmap-sdk/constants';

describe('drawing actions', () => {
  it('should create an action to start drawing', () => {
    const geo_type = 'Point';
    const source = 'test-points';

    const expectedAction = {
      type: DRAWING.START,
      interaction: geo_type,
      sourceName: source,
    };
    expect(actions.startDrawing(source, geo_type)).toEqual(expectedAction);
  });

  it('should create an action to start modifying', () => {
    const source = 'test-points';

    const expectedAction = {
      type: DRAWING.START,
      interaction: INTERACTIONS.modify,
      sourceName: source,
    };
    expect(actions.startModify(source)).toEqual(expectedAction);
  });

  it('should create an action to start select', () => {
    const source = 'test-points';

    const expectedAction = {
      type: DRAWING.START,
      interaction: INTERACTIONS.select,
      sourceName: source,
    };
    expect(actions.startSelect(source)).toEqual(expectedAction);
  });

  it('should create an action to end drawing', () => {
    expect(actions.endDrawing()).toEqual({type: DRAWING.END});
  });

  it('should create an action to end modify', () => {
    expect(actions.endModify()).toEqual({type: DRAWING.END});
  });

  it('should create an action to end select', () => {
    expect(actions.endSelect()).toEqual({type: DRAWING.END});
  });

  it('should create an action to set measure feature and segments', () => {
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

    const expected_action = {
      type: DRAWING.SET_MEASURE_FEATURE,
      feature: line,
      segments: segs,
    };

    const action = actions.setMeasureFeature(line, segs);

    expect(action).toEqual(expected_action);
  });

  it('should create an action to clear the measure feature', () => {
    expect(actions.clearMeasureFeature()).toEqual({type: DRAWING.CLEAR_MEASURE_FEATURE});
  });

  it('should create an action to finalize the measure feature', () => {
    expect(actions.finalizeMeasureFeature()).toEqual({type: DRAWING.FINALIZE_MEASURE_FEATURE});
  });

  it('should create an action to finish the measure geometry', () => {
    expect(actions.finishMeasureGeometry()).toEqual({type: DRAWING.FINISH_MEASURE_GEOMETRY});
  });

  it('should start a measuring tool', () => {
    expect(actions.startMeasure(INTERACTIONS.measure_point)).toEqual({
      type: DRAWING.START,
      interaction: INTERACTIONS.measure_point,
      sourceName: null,
    });
  });

  it('should change the edit style', () => {
    const style = {
      id: 'style1',
      type: 'fill'
    };
    expect(actions.setEditStyle(style)).toEqual({
      type: DRAWING.SET_EDIT_STYLE,
      editStyle: style
    });
  });

  it('should change the select style function', () => {
    const style = {
      id: 'style1',
      type: 'fill'
    };
    expect(actions.setSelectStyle(style)).toEqual({
      type: DRAWING.SET_SELECT_STYLE,
      selectStyle: style
    });
  });

  it('should change the modify style function', () => {
    const style = {
      id: 'style1',
      type: 'fill'
    };
    expect(actions.setModifyStyle(style)).toEqual({
      type: DRAWING.SET_MODIFY_STYLE,
      modifyStyle: style
    });
  });

  it('should change the measure style function', () => {
    const style = {
      id: 'style1',
      type: 'fill'
    };
    expect(actions.setMeasureStyle(style)).toEqual({
      type: DRAWING.SET_MEASURE_STYLE,
      measureStyle: style
    });
  });

});
