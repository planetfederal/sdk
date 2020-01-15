/** Map Name example.
 */

import {createStore, combineReducers} from 'redux';

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import SdkZoomControl from 'webmap-sdk/components/map/zoom-control';
import SdkMap from 'webmap-sdk/components/map';
import SdkMapReducer from 'webmap-sdk/reducers/map';
import SdkMapInfoReducer from 'webmap-sdk/reducers/mapinfo';
import * as mapActions from 'webmap-sdk/actions/map';

// This will have webpack include all of the SDK styles.
import 'webmap-sdk/stylesheet/sdk.scss';

const store = createStore(combineReducers({
  map: SdkMapReducer,
  mapinfo: SdkMapInfoReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function main() {
  // Start with a reasonable global view of the map.
  store.dispatch(mapActions.setView([-93, 45], 2));

  // Set the map name
  store.dispatch(mapActions.setMapName('Map Name Example'));

  // add the OSM source
  store.dispatch(mapActions.addOsmSource('osm'));

  // and an OSM layer.
  // Raster layers need not have any paint styles.
  store.dispatch(mapActions.addLayer({
    id: 'osm',
    source: 'osm',
    type: 'raster',
  }));

  // Component to update map name from user input.
  class InputField extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {value: store.getState().map.name};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.updateMapName = this.updateMapName.bind(this);
    }
    updateMapName(event) {
      this.setState({value: event.target.value});
    }
    handleSubmit(event) {
      event.preventDefault();
      store.dispatch(mapActions.setMapName(this.state.value));
      this.setState({value: ''});
    }
    render() {
      return (
        <div className='mapName'>
          <form onSubmit={this.handleSubmit}>
            <div className='mapForm'>
              <label className='nameLabel' htmlFor='nameField'>Change Map Name in Redux store:</label>
              <input className='nameField' placeholder='Enter new map name here' type='text' id='nameField' value={this.state.value} onChange={this.updateMapName} />
              <button className='sdk-btn' type='submit'>Update Map Name</button>
            </div>
          </form>
          <div className='newName'>New Redux state.map.name Value: {store.getState().map.name}</div>
        </div>
      );
    }
  }

  // place the map on the page.
  ReactDOM.render(<Provider store={store}>
    <SdkMap>
      <SdkZoomControl />
    </SdkMap>
  </Provider>, document.getElementById('map'));

  // add some buttons to demo some actions.
  ReactDOM.render((
    <div>
      <h3>Try it out</h3>
      <InputField />
    </div>
  ), document.getElementById('controls'));
}

main();
