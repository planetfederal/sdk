/** Tests for sprite animation layers in the map.
 *
 */

/* global it, spyOn, describe, expect, beforeEach, afterEach */

import React from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import SdkMap from '@boundlessgeo/sdk/components/map';
import MapReducer from '@boundlessgeo/sdk/reducers/map';
import * as MapActions from '@boundlessgeo/sdk/actions/map';
import SdkSpriteStyle from '@boundlessgeo/sdk/style/sprite';
import Feature from 'ol/Feature';

import canvas from 'canvas';

// this is kind of a hack to have tests work in jest
// but I don't see any other way to tackle this
canvas.Context2d.prototype.drawImage = function() {};

configure({adapter: new Adapter()});

describe('tests for the sprite animation map layers', () => {
  let map;
  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
    }));

    const ref = React.createRef();
    mount(<Provider store={store}><SdkMap ref={ref} /></Provider>);
    map = ref.current;
  });

  it('sets the correct style function', (done) => {
    // add source
    store.dispatch(MapActions.addSource('points', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0],
        },
        properties: {
          rotation: 360 / Math.PI,
        },
      },
    }));
    // add layer
    store.dispatch(MapActions.addLayer({
      id: 'helicopters',
      metadata: {
        'bnd:animate-sprite': {
          src: 'chopper-small.png',
          width: 30.5,
          height: 32,
          frameRate: 200,
          spriteCount: 4,
          rotation: {
            property: 'rotation'
          },
        }
      },
      source: 'points',
      type: 'symbol',
    }));
    window.setTimeout(() => {
      const olLayer = map.layers['points-helicopters'];
      const styleFn = olLayer.getStyle();
      const style = styleFn(new Feature());
      expect(style.getImage()).toBeInstanceOf(SdkSpriteStyle);
      spyOn(style.getImage(), 'update');
      // postcompose should trigger update
      map.map.dispatchEvent({type: 'postcompose'});
      expect(style.getImage().update).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('sets the correct style function and filter', (done) => {
    // add source
    store.dispatch(MapActions.addSource('points', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0],
        },
        properties: {
          visible: 1,
          rotation: 360 / Math.PI,
        },
      },
    }));
    // add layer
    store.dispatch(MapActions.addLayer({
      id: 'helicopters',
      metadata: {
        'bnd:animate-sprite': {
          src: 'chopper-small.png',
          width: 30.5,
          height: 32,
          frameRate: 200,
          spriteCount: 4,
        }
      },
      filter: ['==', 'visible', 0],
      source: 'points',
      type: 'symbol',
    }));
    window.setTimeout(() => {
      const olLayer = map.layers['points-helicopters'];
      const styleFn = olLayer.getStyle();
      let style = styleFn(new Feature({visible: 1}));
      expect(style).toEqual(null);
      style = styleFn(new Feature({visible: 0}));
      expect(style.getImage()).toBeInstanceOf(SdkSpriteStyle);
      done();
    }, 0);
  });

});
