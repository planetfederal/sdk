import React from 'react';
import PropTypes from 'prop-types';
import SdkMapbox from 'webmap-sdk/components/mapboxgl';
import SdkMap from 'webmap-sdk/components/map';

export default class RendererSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderer: props.defaultRenderer
    };
  }
  render() {
    const select = (<div style={{margin: 10}}><h4>Map renderer</h4>
      <select value={this.state.renderer} onChange={(evt) => {
        this.setState({renderer: evt.target.value});
      }}>
        <option value='ol'>OpenLayers</option>
        <option value='mapbox'>Mapbox GL JS</option>
      </select>
    </div>);
    let mapMarkup = this.state.renderer === 'ol' ? (
      <SdkMap {...this.props}/>
    ) : (
      <SdkMapbox {...this.props}/>
    );
    return (<div>{select}{mapMarkup}</div>);
  }
}

RendererSwitch.propTypes = {
  defaultRenderer: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

RendererSwitch.defaultProps = {
  defaultRenderer: 'ol'
};
