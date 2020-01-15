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

/** @module actions/esri
 *  @desc Actions for dealing with Esri ArcGIS Rest Feature Services.
 */

import {ESRI} from '../action-types';

/** Esri add source action.
 *  @param {string} sourceName The source name to be added.
 *  @param {Object} options source definition options.
 *
 *  @returns {Object} Action object to pass to reducer.
 */
export function addSource(sourceName, options) {
  return {
    type: ESRI.ADD_SOURCE,
    sourceName,
    sourceDef: options,
  };
}

/** Esri remove source action.
 *  @param {string} sourceName The source name that will be removed.
 *
 *  @returns {Object} Action object to pass to reducer.
 */
export function removeSource(sourceName) {
  return {
    type: ESRI.REMOVE_SOURCE,
    sourceName,
  };
}
