/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
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

import {LAYERLIST_HIDE_KEY, GROUP_KEY, GROUPS_KEY} from '../constants';
import SdkLayerListItem from './layer-list-item';

export class SdkList extends React.Component {
  render() {
    return (
      <ul style={this.props.style} className={this.props.className}>
        {this.props.children}
      </ul>
    );
  }
}

SdkList.PropTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export class SdkLayerListGroup extends React.Component {

  render() {
    const children = [];

    for (let i = 0, ii = this.props.layers.length; i < ii; i++) {
      children.push(
        <this.props.layerClass
          exclusive={this.props.group.exclusive}
          key={i}
          layer={this.props.layers[i]}
          groupId={this.props.groupId}
        />
      );
    }

    return (<li>{this.props.group.name}<ul>{children}</ul></li>);
  }
}

SdkLayerListGroup.PropTypes = {
  groupId: PropTypes.string.isRequired,
  group: PropTypes.shape({
    name: PropTypes.string,
    exclusive: PropTypes.bool,
  }).isRequired,
  layerClass: PropTypes.func.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
};

/** @module components/layer-list
 *
 * @desc Provides a layer list control.
 */
class SdkLayerList extends React.Component {
  constructor(props) {
    super(props);

    this.groupClass = connect()(this.props.groupClass);
    this.layerClass = connect()(this.props.layerClass);
  }

  render() {
    let className = 'sdk-layer-list';
    if (this.props.className) {
      className = `${className} ${this.props.className}`;
    }
    const layers = [];
    const groups = this.props.metadata ? this.props.metadata[GROUPS_KEY] : undefined;
    let groupName, group_layers;
    for (let i = 0, ii = this.props.layers.length; i < ii; i++) {
      const item = this.props.layers[i];
      if (item.metadata && item.metadata[GROUP_KEY]) {
        if (groupName !== item.metadata[GROUP_KEY]) {
          if (group_layers && group_layers.length > 0) {
            layers.unshift(
              <this.groupClass
                key={groupName}
                groupId={groupName}
                group={groups[groupName]}
                layers={group_layers}
                layerClass={this.layerClass}
              />
            );
          }
          group_layers = [];
        }
        groupName = item.metadata[GROUP_KEY];
        if (item.metadata[LAYERLIST_HIDE_KEY] !== true) {
          group_layers.unshift(item);
        }
      } else if (!item.metadata || item.metadata[LAYERLIST_HIDE_KEY] !== true) {
        layers.unshift(<this.layerClass key={i} layers={this.props.layers} layer={item} />);
      }
    }
    if (group_layers && group_layers.length) {
      layers.unshift(
        <this.groupClass
          key={groupName}
          groupId={groupName}
          group={groups[groupName]}
          layers={group_layers}
          layerClass={this.layerClass}
        />
      );
    }
    return (
      <this.props.listClass style={this.props.style} className={className}>
        { layers }
      </this.props.listClass>
    );
  }
}

SdkLayerList.propTypes = {
  /**
   * React.Component to use for rendering layer groups.
   */
  groupClass: PropTypes.func,
  /**
   * React.Component to use for rendering layers.
   */
  layerClass: PropTypes.func,
  /**
   * React.Component to use for rendering lists. The default implementation uses <ul>.
   */
  listClass: PropTypes.func,
  /**
   * List of layers to use.
   */
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
  /**
   * Style config object for the root element.
   */
  style: PropTypes.object,
  /**
   * Css className for the root element.
   */
  className: PropTypes.string,
};

SdkLayerList.defaultProps = {
  layerClass: SdkLayerListItem,
  groupClass: SdkLayerListGroup,
  listClass: SdkList,
};

function mapStateToProps(state) {
  return {
    layers: state.map.layers,
    metadata: state.map.metadata,
  };
}

export default connect(mapStateToProps)(SdkLayerList);