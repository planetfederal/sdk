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

/**
 *  A collection of useful constants.
 *  @ignore
 */

export const LAYER_VERSION_KEY = 'bnd:layer-version';
export const SOURCE_VERSION_KEY = 'bnd:source-version';
export const SOURCES_FETCH_OPTIONS_KEY = 'bnd-sources-fetch-options';
export const TITLE_KEY = 'bnd:title';
export const TIME_KEY = 'bnd:time';
export const TIME_START_KEY = 'bnd:start-time';
export const TIME_END_KEY = 'bnd:end-time';
export const DATA_VERSION_KEY = 'bnd:data-version';
export const GROUPS_KEY = 'mapbox:groups';
export const GROUP_KEY = 'mapbox:group';
export const LAYERLIST_HIDE_KEY = 'bnd:hide-layerlist';
export const QUERYABLE_KEY = 'bnd:queryable';
export const QUERY_ENDPOINT_KEY = 'bnd:query-endpoint';
export const QUERY_TYPE_KEY = 'bnd:query-type';
export const QUERY_PARAMS_KEY = 'bnd:query-params';
export const GEOMETRY_NAME_KEY = 'bnd:geometry-name';
export const MIN_ZOOM_KEY = 'bnd:minzoom';
export const MAX_ZOOM_KEY = 'bnd:maxzoom';
export const LEGEND_TYPE = 'bnd:legend-type';
export const LEGEND_CONTENT = 'bnd:legend-content';

export const QUERY_TYPE_WFS = 'WFS';

export const DEFAULT_ZOOM = {
  MIN: 0,
  MAX: 22,
};

export const INTERACTIONS = {
  modify: 'Modify',
  select: 'Select',
  point: 'Point',
  line: 'LineString',
  polygon: 'Polygon',
  box: 'Box',
  measure_point: 'measure:Point',
  measure_line: 'measure:LineString',
  measure_polygon: 'measure:Polygon',
};

// useful for deciding what is or is not a drawing interaction
INTERACTIONS.drawing = [
  INTERACTIONS.point,
  INTERACTIONS.line,
  INTERACTIONS.polygon,
  INTERACTIONS.box
];

// determine which is a measuring interaction
INTERACTIONS.measuring = [
  INTERACTIONS.measure_point,
  INTERACTIONS.measure_line,
  INTERACTIONS.measure_polygon,
];

/** Export all the const's in a convenient Object.
 */
export default {
  LAYER_VERSION_KEY,
  SOURCE_VERSION_KEY,
  TITLE_KEY,
  TIME_KEY,
  GROUP_KEY,
  GROUPS_KEY,
  TIME_START_KEY,
  TIME_END_KEY,
  DATA_VERSION_KEY,
  INTERACTIONS,
  DEFAULT_ZOOM,
};
