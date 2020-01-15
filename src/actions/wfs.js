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

/** @module actions/wfs
 * @desc Actions for handling WFS updates.
 */

import {WFS} from '../action-types';

/** Helper function to define WFS actions.
 *  @param {string} type WFS action type.
 *  @param {string} sourceName The source name on which the relevant feature will be located.
 *  @param {Object} feature Feature on which the action takes place.
 *
 *  @returns {Object} Action object to return for WFS actions.
 */
function wfsAction(type, sourceName, feature) {
  return {type, sourceName, feature};
}

/** WFS feature insert action.
 *  @param {string} sourceName The source name on which the relevant feature will be located.
 *  @param {Object} feature Feature on which the action takes place.
 *
 *  @returns {Object} Action object.
 */
export function insertFeature(sourceName, feature) {
  return wfsAction(WFS.INSERT, sourceName, feature);
}

/** WFS feature update action.
 *  @param {string} sourceName The source name on which the relevant feature will be located.
 *  @param {Object} feature Feature on which the action takes place.
 *
 *  @returns {Object} Action object.
 */
export function updateFeature(sourceName, feature) {
  return wfsAction(WFS.UPDATE, sourceName, feature);
}

/** WFS delete feature action.
 *  @param {string} sourceName The source name on which the relevant feature will be located.
 *  @param {Object} feature Feature on which the action takes place.
 *
 *  @returns {Object} Action object.
 */
export function deleteFeature(sourceName, feature) {
  return wfsAction(WFS.DELETE, sourceName, feature);
}

/** WFS add source action.
 *  @param {string} sourceName The source name to be added.
 *  @param {Object} options ource definition options.
 *
 *  @returns {Object} Action object to pass to reducer.
 */
export function addSource(sourceName, options) {
  return {
    type: WFS.ADD_SOURCE,
    sourceName,
    sourceDef: options,
  };
}

/** WFS remove source action.
 *  @param {string} sourceName The source name that will be removed.
 *
 *  @returns {Object} Action object to pass to reducer.
 */
export function removeSource(sourceName) {
  return {
    type: WFS.REMOVE_SOURCE,
    sourceName,
  };
}

/** WFS action to indicate finished state.
 *  @param {string} actionId The id of the relevant action.
 *
 *  @returns {Object} Action object to pass to reducer.
 */
export function finishedAction(actionId) {
  return {
    type: WFS.FINISHED,
    id: actionId
  };
}
