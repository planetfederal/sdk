/* global it, describe, expect, beforeEach */

import React from 'react';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import MapReducer from '../../../src/reducers/map';
import * as MapActions from '../../../src/actions/map';
import SdkZoomControl from '../../../src/components/map/zoom-control';

configure({adapter: new Adapter()});

describe('Zoom control tests', () => {

  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
    }));
  });

  it('should correctly change the zoom level', () => {
    store.dispatch(MapActions.setView([-98, 40], 4));
    const wrapper = mount(<Provider store={store}><SdkZoomControl /></Provider>);
    wrapper.find('.sdk-zoom-in').first().simulate('click');
    expect(store.getState().map.zoom).toBe(5);
    wrapper.find('.sdk-zoom-out').first().simulate('click');
    expect(store.getState().map.zoom).toBe(4);
  });

  it('should allow for custom className', () => {
    const wrapper = mount(<Provider store={store}><SdkZoomControl className='foo' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
