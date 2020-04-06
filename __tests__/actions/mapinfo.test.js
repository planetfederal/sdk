/* global describe, it, expect */

import * as actions from 'webmap-sdk/actions/mapinfo';
import {MAPINFO} from 'webmap-sdk/action-types';

describe('test that mapinfo actions are properly created', () => {

  it('should issue an action to set the map size', () => {
    const size = [1000, 500];
    expect(actions.setMapSize(size)).toEqual({
      type: MAPINFO.SET_SIZE,
      size,
    });
  });

  it('should issue an action to set the map extent', () => {
    const extent = [-90, -45, 90, 45];
    expect(actions.setMapExtent(extent)).toEqual({
      type: MAPINFO.SET_EXTENT,
      extent,
    });
  });

  it('should issue an action to change the mouse position', () => {
    const lngLat = {lng: 50, lat: 45};
    const coordinate = [100000, 80000];
    expect(actions.setMousePosition(lngLat, coordinate)).toEqual({
      type: MAPINFO.SET_MOUSE_POSITION,
      lngLat,
      coordinate,
    });
  });

  it('should issue an action to request a map redraw', () => {
    expect(actions.requestRedraw()).toEqual({
      type: MAPINFO.REQUEST_REDRAW,
    });
  });

  it('should issue an action to set a source error', () => {
    expect(actions.setSourceError('test')).toEqual({
      type: MAPINFO.SET_SOURCE_ERROR,
      srcName: 'test'
    });
  });

  it('should issue an action to request a source redraw', () => {
    expect(actions.requestSourceRedraw('test')).toEqual({
      type: MAPINFO.REQUEST_SOURCE_REDRAW,
      srcName: 'test'
    });
  });

  it('should clear the source errors', () => {
    expect(actions.clearSourceErrors()).toEqual({
      type: MAPINFO.CLEAR_SOURCE_ERRORS,
    });
  });

  it('should set the map to loading', () => {
    expect(actions.setMapLoading()).toEqual({
      type: MAPINFO.SET_MAP_LOADING,
    });
  });

  it('should set the map to loaded', () => {
    expect(actions.setMapLoaded()).toEqual({
      type: MAPINFO.SET_MAP_LOADED,
    });
  });

});

