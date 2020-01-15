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
import * as mapActions from '../../actions/map';
import {DEFAULT_ZOOM} from '../../constants';

/** @module components/map/zoom-slider
 * @example
 * import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';
 * import { Provider } from 'react-redux';
 * import SdkMap from 'webmap-sdk/components/map';
 * import ReactDOM from 'react-dom';
 *
 * ReactDOM.render(<Provider store={store}>
 *   <SdkMap>
 *     <SdkZoomSlider />
 *   </SdkMap>
 * </Provider>, document.getElementById('map'));
 *
 * @desc Provides a vertical slider to zoom the map.
 */
class ZoomSlider extends React.Component {
  render() {
    const minZoom = this.props.metadata && this.props.metadata['bnd:minzoom'] !== undefined ? this.props.metadata['bnd:minzoom'] : DEFAULT_ZOOM.MIN;
    const maxZoom = this.props.metadata && this.props.metadata['bnd:maxzoom'] !== undefined ? this.props.metadata['bnd:maxzoom'] : DEFAULT_ZOOM.MAX;
    let className = 'sdk-slider-control';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <div style={this.props.style} className={className}>
        <input className='sdk-zoom-slider' min={minZoom} max={maxZoom} value={this.props.zoom} onChange={(evt) => {
          this.props.onChange(evt.target.value);
        }} type='range' />
      </div>
    );
  }
}

ZoomSlider.propTypes = {
  /**
   * Css className to use on the root div.
   */
  className: PropTypes.string,
  /**
   * Style config for the root div.
   */
  style: PropTypes.object,
};


function mapStateToProps(state) {
  return {
    zoom: state.map.zoom,
    metadata: state.map.metadata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value) => {
      dispatch(mapActions.setZoom(value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoomSlider);
