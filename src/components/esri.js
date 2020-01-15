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

import fetchJsonp from 'fetch-jsonp';

import PropTypes from 'prop-types';
import {Component} from 'react';
import {connect} from 'react-redux';

import View from 'ol/View';
import EsriJsonFormat from 'ol/format/EsriJSON';
import GeoJsonFormat from 'ol/format/GeoJSON';
import {fromLonLat} from 'ol/proj';

import {encodeQueryObject} from '../util';
import {updateSource} from '../actions/map';

/** @module components/esri
 * @desc Provides a component which will handle ArcGIS Rest Feature Service interaction.
 */
class EsriController extends Component {
  constructor(props) {
    super(props);
    this.esri_format = new EsriJsonFormat();
    this.geojson_format = new GeoJsonFormat();
    this.view = new View();
  }

  componentDidMount() {
    this.fetchData();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.map.center[0] !== this.props.map.center[0] || nextProps.map.center[1] !== this.props.map.center[1] || nextProps.map.zoom !== this.props.map.zoom || nextProps.sources !== this.props.sources) {
      this.fetchData();
    }
    // This should always return false to keep
    // render() from being called.
    return false;
  }

  fetchData() {
    this.view.setCenter(fromLonLat(this.props.map.center));
    this.view.setZoom(this.props.map.zoom + 1);
    const extent = this.view.calculateExtent(this.props.mapinfo.size);
    for (let key in this.props.sources) {
      const source = this.props.sources[key];
      const bbox = JSON.stringify({
        xmin: extent[0],
        ymin: extent[1],
        xmax: extent[2],
        ymax: extent[3],
        spatialReference: {
          wkid: 102100,
        }
      });
      const params = {
        f: 'json',
        returnGeometry: true,
        spatialRel: 'esriSpatialRelIntersects',
        geometry: bbox,
        geometryType: 'esriGeometryEnvelope',
        inSR: '102100',
        outFields: '*',
        outSR: '4326',
      };
      const url = `${source.onlineResource}${source.featureLayer}/query/?${encodeQueryObject(params)}`;
      fetchJsonp(url, {timeout: this.props.timeout}).then(
        response => response.json(),
      ).then((json) => {
        const features = this.esri_format.readFeatures(json);
        this.props.dispatch(updateSource(key, {data: this.geojson_format.writeFeaturesObject(features)}));
      }).catch(function(error) {
        console.error('An error occured.', error);
      });
    }
  }

  render() {
    // never render anything.
    return false;
  }
}

EsriController.propTypes = {
  /** Request timeout in milliseconds */
  timeout: PropTypes.number,
  /** List of map sources. */
  sources: PropTypes.object,
};

EsriController.defaultProps = {
  timeout: 30000,
  sources: {},
};

function mapStateToProps(state) {
  return {
    sources: state.esri.sources,
    map: state.map,
    mapinfo: state.mapinfo,
  };
}

export default connect(mapStateToProps)(EsriController);
