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

import React from 'react';
import PropTypes from 'prop-types';

export function MapRender() {
  let className = 'sdk-map';
  if (this.props.className) {
    className = `${className} ${this.props.className}`;
  }
  return (
    <div style={this.props.style} ref={(c) => {
      this.mapdiv = c;
    }} className={className}>
      <div className='controls'>
        {this.props.children}
      </div>
    </div>
  );
}

/**
 * @module components/map-common
 * @ignore
 */
export default class MapCommon extends React.Component {
}

MapCommon.propTypes = {
  /** Should we wrap the world? If yes, data will be repeated in all worlds. */
  wrapX: PropTypes.bool,
  /** Should we handle map hover to show mouseposition? */
  hover: PropTypes.bool,
  /** Projection of the map, normally an EPSG code. */
  projection: PropTypes.string,
  /** Map configuration, modelled after the Mapbox Style specification. */
  map: PropTypes.shape({
    /** Center of the map. */
    center: PropTypes.array,
    /** Zoom level of the map. */
    zoom: PropTypes.number,
    /** Rotation of the map in degrees. */
    bearing: PropTypes.number,
    /** Extra information about the map. */
    metadata: PropTypes.object,
    /** List of map layers. */
    layers: PropTypes.array,
    /** List of layer sources. */
    sources: PropTypes.object,
    /** Sprite sheet to use. */
    sprite: PropTypes.string,
  }),
  /** Child components. */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** Mapbox specific configuration. */
  mapbox: PropTypes.shape({
    /** Base url to use for mapbox:// substitutions. */
    baseUrl: PropTypes.string,
    /** Access token for the Mapbox account to use. */
    accessToken: PropTypes.string,
  }),
  /** Style configuration object. */
  style: PropTypes.object,
  /** Css className. */
  className: PropTypes.string,
  /** Drawing specific configuration. */
  drawing: PropTypes.shape({
    /** Current interaction to use for drawing. */
    interaction: PropTypes.string,
    /** Current source name to use for drawing. */
    sourceName: PropTypes.string,
  }),
  /** Initial popups to display in the map. */
  initialPopups: PropTypes.arrayOf(PropTypes.object),
  /** setView callback function, triggered on moveend.
   * @ignore
   */
  setView: PropTypes.func,
  /** setSize callback function, triggered on change size.
   * @ignore
   */
  setSize: PropTypes.func,
  /** setMousePosition callback function, triggered on pointermove.
   * @ignore
   */
  setMousePosition: PropTypes.func,
  /** setProjection callback function.
   * @ignore
   */
  setProjection: PropTypes.func,
  /** Should we include features when the map is clicked? */
  includeFeaturesOnClick: PropTypes.bool,
  /** onClick callback function, triggered on singleclick. */
  onClick: PropTypes.func,
  /** onFeatureDrawn callback, triggered on drawend of the draw interaction. */
  onFeatureDrawn: PropTypes.func,
  /** onFeatureModified callback, triggered on modifyend of the modify interaction. */
  onFeatureModified: PropTypes.func,
  /** setMeasureGeometry callback, called when the measure geometry changes.
   * @ignore
   */
  setMeasureGeometry: PropTypes.func,
  /** clearMeasureFeature callback, called when the measure feature is cleared.
   * @ignore
   */
  clearMeasureFeature: PropTypes.func,
  /**
   * Should we be interactive? I.e. respond to mouse and keyboard events?
   */
  interactive: PropTypes.bool,
};

MapCommon.defaultProps = {
  wrapX: true,
  hover: true,
  projection: 'EPSG:3857',
  map: {
    center: [0, 0],
    zoom: 2,
    bearing: 0,
    metadata: {},
    layers: [],
    sources: {},
    sprite: undefined,
  },
  drawing: {
    interaction: null,
    source: null,
  },
  mapbox: {
    baseUrl: '',
    accessToken: '',
  },
  initialPopups: [],
  setView: () => {
    // swallow event.
  },
  setSize: () => { },
  setMousePosition: () => {
    // swallow event.
  },
  setProjection: () => { },
  includeFeaturesOnClick: false,
  onClick: () => {
  },
  onFeatureDrawn: () => {
  },
  onFeatureModified: () => {
  },
  setMeasureGeometry: () => {
  },
  clearMeasureFeature: () => {
  },
  interactive: true,
};
