/** SDK application example showing interaction with Esri services.
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkMap from 'webmap-sdk/components/map';
import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkZoomSlider from 'webmap-sdk/components/map/zoom-slider';
import SdkPopup from 'webmap-sdk/components/map/popup';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import * as mapActions from 'webmap-sdk/actions/map';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class Popup extends SdkPopup {
  render() {
    const feature = this.props.features[0];
    const content = feature.properties.ROUTE ? `ROUTE: ${feature.properties.ROUTE}` : `STATE_NAME: ${feature.properties.STATE_NAME}`;
    return this.renderPopup((
      <div className='sdk-popup-content'>
        <p>
          OBJECTID: { feature.properties.OBJECTID }<br/>
          {content}
        </p>
      </div>
    ));
  }
}

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // add the OSM source to function as base layer
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  // the base url for our Esri service
  const baseUrl = 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/';

  // add the ArcGIS rest source
  store.dispatch(mapActions.addSource('esri', {
    type: 'raster',
    tileSize: 256,
    crossOrigin: null, /* service does not support CORS */
    tiles: [
      `${baseUrl}export?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=256%2C256&BBOX={bbox-epsg-3857}&BBOXSR=3857&IMAGESR=3857&DPI=90`,
    ],
  }));

  // Add the highway layer and mark it as queryable
  store.dispatch(mapActions.addLayer({
    id: 'highway',
    source: 'esri',
    type: 'raster',
    metadata: {
      'bnd:queryable': true,
      'bnd:query-endpoint': `${baseUrl}identify`
    },
  }));

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap
      includeFeaturesOnClick
      onClick={(map, xy, featuresPromise) => {
        featuresPromise.then((featureGroups) => {
          // setup an array for all the features returned in the promise.
          let features = [];

          // featureGroups is an array of objects. The key of each object
          // is a layer from the map.
          for (let g = 0, gg = featureGroups.length; g < gg; g++) {
            // collect every feature from each layer.
            const layers = Object.keys(featureGroups[g]);
            for (let l = 0, ll = layers.length; l < ll; l++) {
              const layer = layers[l];
              features = features.concat(featureGroups[g][layer]);
            }
          }

          if (features.length !== 0) {
            map.addPopup(<Popup coordinate={xy} features={features} closeable />);
          }
        }).catch((exception) => {
          console.error('An error occurred.', exception);
        });
      }}
    >
      <SdkZoomControl /><SdkZoomSlider />
    </SdkMap>
  </Provider>, document.getElementById('map'));

}

main();
