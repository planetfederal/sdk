/* global it, describe, expect, beforeEach */

import React from 'react';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import MapReducer from '../../../src/reducers/map';
import MapInfoReducer from '../../../src/reducers/mapinfo';
import * as MapInfoActions from '../../../src/actions/mapinfo';
import * as MapActions from '../../../src/actions/map';
import ConnectedScaleLine, {ScaleLine} from '../../../src/components/map/scaleline';

configure({adapter: new Adapter()});

describe('Scaleline tests', () => {

  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
      mapinfo: MapInfoReducer,
    }));
    store.dispatch(MapActions.setView([-98, 40], 4));
  });

  it('should allow for custom className', () => {
    store.dispatch(MapInfoActions.setResolution(1000));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine className='foo' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline', () => {
    store.dispatch(MapInfoActions.setResolution(1000));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('creates the meter suffix', () => {
    store.dispatch(MapInfoActions.setResolution(2.388657133911758));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('creates the millimeter suffix', () => {
    store.dispatch(MapInfoActions.setResolution(0.009330691929342804));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('creates the micrometer suffix', () => {
    store.dispatch(MapInfoActions.setResolution(0.000009330691929342804));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in EPSG:4326', () => {
    store.dispatch(MapInfoActions.setProjection('EPSG:4326'));
    store.dispatch(MapInfoActions.setResolution(1000));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='degrees' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in degrees', () => {
    store.dispatch(MapInfoActions.setResolution(19567.87924100512));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='degrees' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in degrees (minutes)', () => {
    store.dispatch(MapInfoActions.setResolution(300));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='degrees' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in degrees (seconds)', () => {
    store.dispatch(MapInfoActions.setResolution(1));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='degrees' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in imperial', () => {
    store.dispatch(MapInfoActions.setResolution(1000));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='imperial' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in imperial (ft)', () => {
    store.dispatch(MapInfoActions.setResolution(1));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='imperial' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in imperial (in)', () => {
    store.dispatch(MapInfoActions.setResolution(0.001));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='imperial' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in nautical', () => {
    store.dispatch(MapInfoActions.setResolution(1000));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='nautical' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in us', () => {
    store.dispatch(MapInfoActions.setResolution(1000));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='us' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in us (ft)', () => {
    store.dispatch(MapInfoActions.setResolution(1));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='us' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('create the correct scaleline in us (in)', () => {
    store.dispatch(MapInfoActions.setResolution(0.001));
    const wrapper = mount(<Provider store={store}><ConnectedScaleLine units='us' /></Provider>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shouldComponentUpdate should work correctly', () => {
    store.dispatch(MapInfoActions.setResolution(1000));
    const props = {
      map: {
        center: [-98, 40],
        zoom: 4,
      },
      mapinfo: {
        projection: 'EPSG:3857',
        resolution: 1000,
      }
    };
    const wrapper = mount(<ScaleLine {...props} />);
    const scaleline = wrapper.instance();
    let result;
    result = scaleline.shouldComponentUpdate({mapinfo: {resolution: 1000}});
    expect(result).toBe(false);
    result = scaleline.shouldComponentUpdate({units: 'degrees'});
    expect(result).toBe(true);
    result = scaleline.shouldComponentUpdate({mapinfo: {resolution: 500}});
    expect(result).toBe(true);
    result = scaleline.shouldComponentUpdate({map: {center: [-98, 50]}});
    expect(result).toBe(true);
  });

});
