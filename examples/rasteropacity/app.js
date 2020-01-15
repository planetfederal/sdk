/** Raster opacity example.
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkMapInfoReducer from 'webmap-sdk/reducers/mapinfo';
import {getLayerById} from 'webmap-sdk/util';
import * as mapActions from 'webmap-sdk/actions/map';

import RendererSwitch from '../rendererswitch';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
  mapinfo: SdkMapInfoReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
    paint: {
      'raster-opacity': .5,
    },
  }));

  class OpacityControl extends React.PureComponent {
    render() {
      const layers = store.getState().map.layers;
      const layer = getLayerById(layers, 'osm');
      const opacity = layer.paint['raster-opacity'] * 100;

      return (
        <div>
          <input
            min='0'
            max='100'
            type='number'
            defaultValue={opacity}
            ref={(me) => {
              this.opacityInput = me;
            }}
          />

          <button
            className='sdk-btn'
            onClick={() => {
              const new_opacity = this.opacityInput.value / 100;

              store.dispatch(mapActions.updateLayer('osm', {
                paint: Object.assign({}, layer.paint, {
                  'raster-opacity': new_opacity,
                })
              }));
            }}
          >
            Change Basemap Opacity
          </button>
        </div>
      );
    }
  }

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <RendererSwitch>
      <SdkZoomControl />
    </RendererSwitch>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <OpacityControl />
    </div>
  ), document.getElementById('controls'));
}

main();
