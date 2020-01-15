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
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {METERS_PER_UNIT} from 'ol/proj/Units';
import {fromLonLat, get, getPointResolution} from 'ol/proj';

const DEGREES = 'degrees';
const IMPERIAL = 'imperial';
const NAUTICAL = 'nautical';
const METRIC = 'metric';
const US = 'us';

const LEADING_DIGITS = [1, 2, 5];

/** @module components/map/scaleline
 *
 * @desc Provides a scale line control.
 */
export class ScaleLine extends React.Component {
  shouldComponentUpdate(nextProps) {
    // compare center
    if (this.props.map && nextProps.map && this.props.map.center && nextProps.map.center && (nextProps.map.center[0] !== this.props.map.center[0] || nextProps.map.center[1] !== this.props.map.center[1])) {
      return true;
    }
    // compare resolution
    if (this.props.mapinfo && nextProps.mapinfo && nextProps.mapinfo.resolution !== this.props.mapinfo.resolution) {
      return true;
    }
    // compare units
    if (nextProps.units !== undefined && nextProps.units !== this.props.units) {
      return true;
    }
    return false;
  }
  calculateProperties() {
    const center = fromLonLat(this.props.map.center);
    const units = this.props.units;
    const pointResolutionUnits = units === DEGREES ? DEGREES : 'm';
    const projection = get(this.props.mapinfo.projection);
    const resolution = this.props.mapinfo.resolution;
    let pointResolution = getPointResolution(projection, resolution, center, pointResolutionUnits);
    if (units !== DEGREES) {
      pointResolution *= projection.getMetersPerUnit();
    }
    let nominalCount = this.props.minWidth * pointResolution;
    let suffix = '';
    if (units === DEGREES) {
      const metersPerDegree = METERS_PER_UNIT[DEGREES];
      if (projection.getUnits() === DEGREES) {
        nominalCount *= metersPerDegree;
      } else {
        pointResolution /= metersPerDegree;
      }
      if (nominalCount < metersPerDegree / 60) {
        suffix = '\u2033'; // seconds
        pointResolution *= 3600;
      } else if (nominalCount < metersPerDegree) {
        suffix = '\u2032'; // minutes
        pointResolution *= 60;
      } else {
        suffix = '\u00b0'; // degrees
      }
    } else if (units === IMPERIAL) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution /= 0.0254;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.3048;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.344;
      }
    } else if (units === NAUTICAL) {
      pointResolution /= 1852;
      suffix = 'nm';
    } else if (units === METRIC) {
      if (nominalCount < 0.001) {
        suffix = 'μm';
        pointResolution *= 1000000;
      } else if (nominalCount < 1) {
        suffix = 'mm';
        pointResolution *= 1000;
      } else if (nominalCount < 1000) {
        suffix = 'm';
      } else {
        suffix = 'km';
        pointResolution /= 1000;
      }
    } else if (units === US) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution *= 39.37;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.30480061;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.3472;
      }
    }
    return {
      suffix,
      pointResolution,
    };
  }
  render() {
    if (this.props.mapinfo && this.props.mapinfo.resolution !== null) {
      let className = 'sdk-scale-line';
      if (this.props.className) {
        className += ' ' + this.props.className;
      }
      const properties = this.calculateProperties();
      const pointResolution = properties.pointResolution;
      const suffix = properties.suffix;
      let i = 3 * Math.floor(
        Math.log(this.props.minWidth * pointResolution) / Math.log(10));
      let count, width;
      /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
      while (true) {
        count = LEADING_DIGITS[((i % 3) + 3) % 3] *
          Math.pow(10, Math.floor(i / 3));
        width = Math.round(count / pointResolution);
        if (isNaN(width)) {
          return false;
        } else if (width >= this.props.minWidth) {
          break;
        }
        i += 1;
      }
      let html = count + ' ' + suffix;
      return (
        <div style={this.props.style} className={className}>
          <div className='sdk-scale-line-inner' style={{width: width}} dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
      );
    } else {
      return false;
    }
  }
}

ScaleLine.propTypes = {
  /**
   * Minimal width in pixels.
   */
  minWidth: PropTypes.number,
  /**
   * The units to use for the scale line.
   */
  units: PropTypes.oneOf([DEGREES, IMPERIAL, NAUTICAL, METRIC, US]),
  /**
   * Css className for the root div.
   */
  className: PropTypes.string,
  /**
   * Style config object for root div.
   */
  style: PropTypes.object,
};

ScaleLine.defaultProps = {
  units: METRIC,
  minWidth: 64,
};

function mapStateToProps(state) {
  return {
    map: state.map,
    mapinfo: state.mapinfo,
  };
}

export default connect(mapStateToProps)(ScaleLine);
