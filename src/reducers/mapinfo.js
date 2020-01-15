/*
 * Copyright 2015-present Planet Federal Inc., http://www.planet.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations
 * under the License.
 */

/** @module reducers/mapinfo
 * @desc Map Info Reducer
 */

import {MAPINFO} from '../action-types';

const defaultState = {
  size: null,
  mouseposition: {
    lngLat: null,
    coordinate: null,
  },
  requestedRedraws: 0,
  extent: null,
  resolution: null,
  projection: 'EPSG:3857',
  sourceErrors: {},
  sourceRedraws: {},
  loading: false,
};

function requestRedraw(state) {
  const next_redraw = state.requestedRedraws + 1;
  return Object.assign({}, state, {
    requestedRedraws: next_redraw,
  });
}

function requestSourceRedraw(state, action) {
  const mixin = {};
  mixin[action.srcName] = (new Date()).getTime();
  return Object.assign({}, state, {
    sourceRedraws: Object.assign({}, state.sourceRedraws, mixin),
  });
}

function setSourceError(state, action) {
  const err_mixin = {};
  err_mixin[action.srcName] = true;
  return Object.assign({}, state, {
    sourceErrors: Object.assign({}, state.sourceErrors, err_mixin),
  });
}

/** Map info reducer.
 *  @param {Object} state The redux state.
 *  @param {Object} action The selected action object.
 *
 *  @returns {Object} The new state object.
 */
export default function mapInfoReducer(state = defaultState, action) {
  switch (action.type) {
    case MAPINFO.SET_EXTENT:
      return Object.assign({}, state, {extent: action.extent});
    case MAPINFO.SET_SIZE:
      return Object.assign({}, state, {size: action.size});
    case MAPINFO.SET_MOUSE_POSITION:
      return Object.assign({}, state, {mouseposition: {lngLat: action.lngLat, coordinate: action.coordinate}});
    case MAPINFO.SET_RESOLUTION:
      return Object.assign({}, state, {resolution: action.resolution});
    case MAPINFO.SET_PROJECTION:
      return Object.assign({}, state, {projection: action.projection});
    case MAPINFO.REQUEST_REDRAW:
      return requestRedraw(state);
    case MAPINFO.REQUEST_SOURCE_REDRAW:
      return requestSourceRedraw(state, action);
    case MAPINFO.SET_SOURCE_ERROR:
      return setSourceError(state, action);
    case MAPINFO.CLEAR_SOURCE_ERRORS:
      return Object.assign({}, state, {sourceErrors: {}});
    case MAPINFO.SET_MAP_LOADING:
      return Object.assign({}, state, {loading: true});
    case MAPINFO.SET_MAP_LOADED:
      return Object.assign({}, state, {loading: false});
    default:
      return state;
  }
}
