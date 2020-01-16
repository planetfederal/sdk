/* global MAPBOX_API_KEY */
/** Demonstrate the loading of a Mapbox GL Style Spec document into SDK
 *
 */

import {createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import {Provider} from 'react-redux';

import RendererSwitch from '../rendererswitch';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkLegend from 'webmap-sdk/components/legend';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkPrintReducer from 'webmap-sdk/reducers/print';
import SdkMapboxReducer from 'webmap-sdk/reducers/mapbox';
import * as mapActions from 'webmap-sdk/actions/map';
import * as mapboxActions from 'webmap-sdk/actions/mapbox';
import * as ContextSagas from 'webmap-sdk/sagas/context';
// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

// create the saga middleware
const saga_middleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  map: SdkMapReducer,
  print: SdkPrintReducer,
  mapbox: SdkMapboxReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
applyMiddleware(saga_middleware));

saga_middleware.run(ContextSagas.handleContext);

class LegendControl extends React.Component {
  render() {
    const legendItems = [];
    const layers = this.props.map.layers;
    for (let i = 0, ii = layers.length; i < ii; ++i) {
      const layer = layers[i];
      if (layer.type !== 'background') {
        legendItems.push(<div style={{display: 'flex', alignItems: 'center'}} key={i}><SdkLegend layerId={layer.id} /><span>{layer.id}</span></div>);
      }
    }
    return (<div style={{maxHeight: 200, overflow: 'auto'}}>{legendItems}</div>);
  }
}

function mapStateToProps(state) {
  return {
    map: state.map
  };
}

LegendControl = connect(mapStateToProps)(LegendControl);

function main() {
  const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/bright-v8';
  store.dispatch(mapboxActions.configure({baseUrl, accessToken: MAPBOX_API_KEY}));

  const url = `https://api.mapbox.com/styles/v1/mapbox/bright-v8?access_token=${MAPBOX_API_KEY}`;
  store.dispatch(mapActions.fetchContext({url}));

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch defaultRenderer='mapbox'>
      <SdkZoomControl />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  ReactDOM.render(<Provider store={store}>
    <div>
      <h4>Legend</h4>
      <LegendControl/>
    </div>
  </Provider>, document.getElementById('controls'));

}

main();
