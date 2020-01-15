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

/** @module reducers/wfs
 * @desc WFS Reducer
 *
 *  Handles WFS requests.
 *
 */

import uuid from 'uuid';

import {WFS} from '../action-types';
import {addSource, removeSource} from './source';

const defaultState = {
  sources: {},
  actions: {},
};

/** Add a WFS action to the state.
 * @param {Object} state Current state.
 * @param {Object} action Action to handle.
 *
 * @returns {Object} The new state.
 */
function addAction(state, action) {
  const action_id = uuid.v4();

  const new_action = {};
  new_action[action_id] = action;

  const new_actions = Object.assign({}, state.actions, new_action);
  return Object.assign({}, state, {actions: new_actions});
}

/** Record a WFS action as finished in the state.
 * @param {Object} state Current state.
 * @param {Object} action Action to handle.
 *
 * @returns {Object} The new state.
 */
function finishedAction(state, action) {
  const new_actions = Object.assign({}, state.actions);
  delete new_actions[action.id];
  return Object.assign({}, state, {actions: new_actions});
}

/** Wfs reducer.
 *  @param {Object} state The redux state.
 *  @param {Object} action The selected action object.
 *
 *  @returns {Object} The new state object.
 */
export default function WfsReducer(state = defaultState, action) {
  switch (action.type) {
    // add a source to the WFS configuration
    case WFS.ADD_SOURCE:
      return addSource(state, action);
    // remove a source from the WFS configuration
    case WFS.REMOVE_SOURCE:
      return removeSource(state, action);
    case WFS.INSERT:
    case WFS.UPDATE:
    case WFS.DELETE:
      return addAction(state, action);
    case WFS.FINISHED:
      return finishedAction(state, action);
    default:
      return state;
  }
}
