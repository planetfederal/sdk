/* global it, describe, expect, beforeEach */

import React from 'react';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import MapReducer from '../../../src/reducers/map';
import * as MapActions from '../../../src/actions/map';
import SdkZoomSlider from '../../../src/components/map/zoom-slider';

configure({adapter: new Adapter()});

describe('Zoom slider tests', () => {

  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
    }));
  });

  it('should correctly change the zoom level', () => {
    store.dispatch(MapActions.setView([-98, 40], 4));
    const wrapper = mount(<Provider store={store}><SdkZoomSlider /></Provider>);
    wrapper.find('.sdk-zoom-slider').first().simulate('change', {target: {value: 5}});
    expect(store.getState().map.zoom).toBe(5);
  });

  it('should allow for custom className', () => {
    const wrapper = mount(<Provider store={store}><SdkZoomSlider className='foo' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
