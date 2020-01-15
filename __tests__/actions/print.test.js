/* global describe, it, expect */

import * as actions from 'webmap-sdk/actions/print';
import {PRINT} from 'webmap-sdk/action-types';

describe('print actions', () => {
  it('should create an action to export image', () => {
    const expectedAction = {
      type: PRINT.EXPORT_IMAGE,
    };
    expect(actions.exportMapImage()).toEqual(expectedAction);
  });

  it('should create an action to finish export image', () => {
    const expectedAction = {
      type: PRINT.RECEIVE_IMAGE,
    };
    expect(actions.receiveMapImage()).toEqual(expectedAction);
  });
});
