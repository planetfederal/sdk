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

/** @module components/map/popup
 * @desc SDK Popup Component
 */

import React from 'react';
import PropTypes from 'prop-types';

/** Popup Component.
 */
export default class Popup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.state = {
      closed: false,
    };
  }

  close(evt) {
    if (evt) {
      evt.stopPropagation();
    }
    this.setState({closed: true});
    this.setState({closed: true}, () => {
      if (this.map) {
        this.map.updatePopups();
      }
    });
    this.props.onClose();
  }

  setMap(map) {
    this.map = map;
  }

  renderPopup(children) {
    let close_btn = false;
    if (this.props.closeable) {
      close_btn = (<i tabIndex={0} role='link' onClick={() => {
        this.close();
      }} ref={(c) => {
        if (c) {
          c.addEventListener('click', this.close);
        }
      }
      } className='sdk-popup-closer' />);
    }
    if (this.state.closed) {
      return false;
    }
    let className = 'sdk-popup-root';
    if (this.props.className) {
      className = `${className} ${this.props.className}`;
    }

    return (
      <div style={this.props.style} className={className}>
        { close_btn }
        <div id='sdk-popup-container'>
          { React.Children.only(children) }
        </div>
      </div>
    );
  }

  render() {
    return this.renderPopup(this.props.children);
  }
}

Popup.propTypes = {
  // this unused prop warning is ignored because the coordinate is
  //  a required prop to rightly render the popup on the map.
  // eslint-disable-next-line
  /** Coordinate where to render the popup in the map. */
  coordinate: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]).isRequired,
  /** Child component(s). */
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.element),
  ]),
  /** Should we be able to close the popup? */
  closeable: PropTypes.bool,
  /** onClose callback function. */
  onClose: PropTypes.func,
  /** Style config object. */
  style: PropTypes.object,
  /** Css class name to apply. */
  className: PropTypes.string,
};

Popup.defaultProps = {
  children: '',
  closeable: false,
  onClose: () => {
    // do nothing
  },
};
