/* global it, describe, expect, beforeEach */

import React from 'react';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import MapReducer from '../../../src/reducers/map';
import MapInfoReducer from '../../../src/reducers/mapinfo';
import * as MapInfoActions from '../../../src/actions/mapinfo';
import SdkMousePosition from '../../../src/components/map/mouseposition';

configure({adapter: new Adapter()});

describe('Zoom control tests', () => {

  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
      mapinfo: MapInfoReducer,
    }));
  });

  it('should correctly report the lat lng', () => {
    store.dispatch(MapInfoActions.setMousePosition({lng: 45, lat: 40}));
    const wrapper = mount(<Provider store={store}><SdkMousePosition /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should allow for custom className', () => {
    const wrapper = mount(<Provider store={store}><SdkMousePosition className='foo' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
