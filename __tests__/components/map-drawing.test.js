/* global it, describe, expect, beforeEach, spyOn */

/** Specific tests for map interactions.
 *
 *  This is *not* intended to be a complete test of the map,
 *  it only tests the drawing related functionality. See map.test.js
 *  for a more complete test of the map component.
 *
 */

import React from 'react';
import {mount, configure} from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';

import SdkMap, {getOLStyleFunctionFromMapboxStyle} from '@boundlessgeo/sdk/components/map';
import MapReducer from '@boundlessgeo/sdk/reducers/map';
import DrawingReducer from '@boundlessgeo/sdk/reducers/drawing';

import * as MapActions from '@boundlessgeo/sdk/actions/map';
import * as DrawingActions from '@boundlessgeo/sdk/actions/drawing';

import {INTERACTIONS} from '@boundlessgeo/sdk/constants';
import {DRAWING} from '@boundlessgeo/sdk/action-types';

configure({adapter: new Adapter()});

// without canvas a basic "does it not error out" test will
//  run fine.
describe('Map with drawing reducer', () => {
  it('creates a map with the drawing reducer', () => {
    const store = createStore(combineReducers({
      map: MapReducer,
      drawing: DrawingReducer,
    }));
    const wrapper = mount(<Provider store={store}><SdkMap /></Provider>);
    expect(wrapper.find('.sdk-map').length).toBe(1);
  });
});


// require that the canvas element be installed to run these tests.
describe('Map component with drawing', () => {
  let store = null;
  let ref = null;

  beforeEach(() => {
    store = createStore(combineReducers({
      map: MapReducer,
      drawing: DrawingReducer,
    }));

    store.dispatch(MapActions.addSource('test', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
          properties: { },
        }],
      },
    }));

    store.dispatch(MapActions.addLayer({
      id: 'points',
      source: 'test',
      type: 'circle',
      paint: {
        'circle-radius': 5,
      },
    }));

    ref = React.createRef();
    mount(<Provider store={store}><SdkMap ref={ref} includeFeaturesOnClick={true} /></Provider>);
  });

  it('turns on a drawing tool', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;
    const n_interactions = ol_map.getInteractions().getLength();

    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.point,
      sourceName: 'test',
    });

    // if the drawing control has been added to the map then
    //  there should be 1 additional interaction.
    expect(ol_map.getInteractions().getLength()).toBe(n_interactions + 1);

    // get the last interaction, which should be the drawing interaction
    const draw = ol_map.getInteractions().item(n_interactions);

    const dummy_feature = new Feature();
    dummy_feature.setGeometry(new Point(5, 5));
    draw.dispatchEvent({
      type: 'drawend',
      feature: dummy_feature,
    });

    store.dispatch(MapActions.setView([-45, -45], 11));
  });

  it('should not trigger the popup-related callbacks when drawing', () => {
    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.point,
      sourceName: 'test',
    });
    const sdk_map = ref.current;
    spyOn(sdk_map.map, 'forEachFeatureAtPixel');
    sdk_map.map.dispatchEvent({
      type: 'postcompose',
    });

    sdk_map.map.dispatchEvent({
      type: 'singleclick',
      coordinate: [0, 0],
      // this fakes the clicking of the canvas.
      originalEvent: {
        // eslint-disable-next-line no-underscore-dangle
        target: sdk_map.map.getRenderer().canvas_,
      },
    });

    // forEachFeatureAtPixel should not get called
    expect(sdk_map.map.forEachFeatureAtPixel).not.toHaveBeenCalled();
  });

  it('turns on a drawing tool for box', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;
    const n_interactions = ol_map.getInteractions().getLength();

    store.dispatch(MapActions.addSource('testPoly', {
      type: 'geojson',
      data: {},
    }));

    store.dispatch(MapActions.addLayer({
      id: 'testPoly',
      source: 'testPoly',
      type: 'fill',
      paint: {
        'fill-opacity': 0.7,
        'fill-color': '#feb24c',
        'fill-outline-color': '#f03b20',
      },
    }));

    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.box,
      sourceName: 'testPoly',
    });

    // if the drawing control has been added to the map then
    //  there should be 1 additional interaction.
    expect(ol_map.getInteractions().getLength()).toBe(n_interactions + 1);
  });

  it('turns off a drawing tool', () => {
    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.point,
      sourceName: 'test',
    });

    const sdk_map = ref.current;
    const ol_map = sdk_map.map;
    const n_interactions = ol_map.getInteractions().getLength();

    store.dispatch({
      type: DRAWING.END,
    });

    // The count of interactions was taken when the drawing interaction
    //  was already started.  Therefore, when the interaction ends then
    //  there should be one less interaction than at the time of observation.
    expect(ol_map.getInteractions().getLength()).toBe(n_interactions - 1);
  });

  it('turns on feature modification', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    const interactions = ol_map.getInteractions();
    const n_interactions = interactions.getLength();

    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.modify,
      sourceName: 'test',
    });

    // modify differs from select and drawing tools
    //  as it requires adding two interactions to the map.
    expect(interactions.getLength()).toBe(n_interactions + 2);

    // get the modify interaction
    const select = interactions.item(interactions.getLength() - 2);
    const modify = interactions.item(interactions.getLength() - 1);

    // configure a spy, when a feature is modified onFeatureEvent
    //  should be called.
    spyOn(sdk_map, 'onFeatureEvent');

    // fake modifying a sample feature.
    const features = sdk_map.layers['test-points'].getSource().getFeatures();
    select.getFeatures().push(features[0]);

    modify.dispatchEvent({
      type: 'modifyend',
      features: select.getFeatures(),
    });

    // ensure onFeatureEvent was called.
    expect(sdk_map.onFeatureEvent).toHaveBeenCalled();
  });

  it('turns on feature modification for a given feature', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    const interactions = ol_map.getInteractions();

    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.modify,
      sourceName: 'test',
      feature: {
        type: 'Feature',
        properties: {
          foo: 'bar'
        },
        geometry: {
          type: 'Point',
          coordinates: [125.6, 10.1]
        },
      },
    });

    const select = interactions.item(interactions.getLength() - 2);
    // feature added to select interaction
    expect(select.getFeatures().getArray()).toHaveLength(1);
    expect(select.getFeatures().item(0).get('foo')).toBe('bar');
    expect(select.getActive()).toBe(false);
  });

  it('turns on select', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    const n_interactions = ol_map.getInteractions().getLength();

    // kick-off the select interaction.
    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.select,
      sourceName: 'test',
    });

    // ensure the interaction has been added to the map.
    const interactions = ol_map.getInteractions();
    expect(interactions.getLength()).toBe(n_interactions + 1);

    // get the select interaction
    const select = interactions.item(interactions.getLength() - 1);
    // eslint-disable-next-line no-underscore-dangle
    expect(select.layerFilter_(sdk_map.layers['test-points'])).toBe(true);
    // configure a spy, when a feature is selected onFeatureEvent
    //  should be called.
    spyOn(sdk_map, 'onFeatureEvent');

    // fake selecting a sample feature.
    const features = sdk_map.layers['test-points'].getSource().getFeatures();
    select.getFeatures().push(features[0]);
    select.dispatchEvent({
      type: 'select',
      selected: [features[0]],
      deselected: [features[0]],
    });

    // ensure onFeatureEvent was called twice.
    expect(sdk_map.onFeatureEvent).toHaveBeenCalledTimes(2);
  });

  it('handles deselect', () => {
    const props = {};
    props.onFeatureDeselected = () => {};
    let mapRef = React.createRef();
    props.ref = mapRef;
    spyOn(props, 'onFeatureDeselected');
    mount(<Provider store={store}><SdkMap {...props} /></Provider>);
    const sdk_map = mapRef.current;
    const ol_map = sdk_map.map;

    // dummy feature
    const feature = new Feature();

    // kick-off the select interaction.
    store.dispatch({
      type: DRAWING.START,
      interaction: INTERACTIONS.select,
      sourceName: 'test',
    });

    const interactions = ol_map.getInteractions();

    // get the select interaction
    const select = interactions.item(interactions.getLength() - 1);

    select.dispatchEvent({
      type: 'select',
      selected: [],
      deselected: [feature],
    });

    // ensure onFeatureDeselected was called.
    expect(props.onFeatureDeselected).toHaveBeenCalled();
  });

  it('measures a point', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    // set the point measure
    store.dispatch(DrawingActions.startMeasure(INTERACTIONS.measure_point));
    // get the measure interaction
    const interactions = ol_map.getInteractions();
    const measure = interactions.item(interactions.getLength() - 1);

    // create a dummy OL feature with a Point for measuring.
    const sketch_geometry = new Point([100, 100]);
    const sketch_feature = new Feature(sketch_geometry);

    measure.dispatchEvent({
      type: 'drawstart',
      feature: sketch_feature,
    });

    sketch_geometry.setCoordinates([0, 0]);

    expect(store.getState().drawing.measureFeature).toEqual({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
    });
  });

  it('measures a line', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    // set the line measure
    store.dispatch(DrawingActions.startMeasure(INTERACTIONS.measure_line));
    // get the measure interaction
    const interactions = ol_map.getInteractions();
    const measure = interactions.item(interactions.getLength() - 1);

    // create a dummy OL feature with a Line for measuring.
    const sketch_geometry = new LineString([]);
    const sketch_feature = new Feature(sketch_geometry);

    measure.dispatchEvent({
      type: 'drawstart',
      feature: sketch_feature,
    });

    const coords = [[0, 0], [20, 0], [40, 0]];
    // create a new line feature that is in map coordinates.
    const tmp_line = (new LineString(coords.slice()));
    tmp_line.transform('EPSG:4326', 'EPSG:3857');

    sketch_geometry.setCoordinates(tmp_line.getCoordinates());

    expect(store.getState().drawing.measureFeature).toEqual({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    });
  });

  it('measures a polygon, and finalizes it', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    // set the polygon measure
    store.dispatch(DrawingActions.startMeasure(INTERACTIONS.measure_polygon));
    // get the measure interaction
    const interactions = ol_map.getInteractions();
    const measure = interactions.item(interactions.getLength() - 1);

    // create a dummy OL feature with a Polygon for measuring.
    const sketch_geometry = new Polygon([]);
    const sketch_feature = new Feature(sketch_geometry);

    measure.dispatchEvent({
      type: 'drawstart',
      feature: sketch_feature,
    });

    const coords = [[[0, 0], [20, 20], [0, 40], [0, 0]]];
    // create a new polygon in map coordinates
    const tmp_polygon = (new Polygon(coords.slice()));
    tmp_polygon.transform('EPSG:4326', 'EPSG:3857');
    sketch_geometry.setCoordinates(tmp_polygon.getCoordinates());

    let state = store.getState().drawing;
    expect(state.measureFeature).toEqual({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: coords,
      },
    });
    expect(state.measureDone).toEqual(false);

    measure.dispatchEvent({
      type: 'drawend',
    });

    state = store.getState().drawing;
    expect(state.measureDone).toEqual(true);

  });

  it('measures a polygon, and finishes the geometry', () => {
    const sdk_map = ref.current;
    const ol_map = sdk_map.map;

    // set the polygon measure
    store.dispatch(DrawingActions.startMeasure(INTERACTIONS.measure_polygon));
    // get the measure interaction
    const interactions = ol_map.getInteractions();
    const measure = interactions.item(interactions.getLength() - 1);

    // create a dummy OL feature with a Polygon for measuring.
    const sketch_geometry = new Polygon([]);
    const sketch_feature = new Feature(sketch_geometry);

    measure.dispatchEvent({
      type: 'drawstart',
      feature: sketch_feature,
    });

    const coords = [[[0, 0], [20, 20], [0, 40], [0, 0]]];
    // create a new polygon in map coordinates
    const tmp_polygon = (new Polygon(coords.slice()));
    tmp_polygon.transform('EPSG:4326', 'EPSG:3857');
    sketch_geometry.setCoordinates(tmp_polygon.getCoordinates());

    let state = store.getState().drawing;
    expect(state.measureFeature).toEqual({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: coords,
      },
    });
    spyOn(measure, 'finishDrawing');
    store.dispatch(DrawingActions.finishMeasureGeometry());
    expect(measure.finishDrawing).toHaveBeenCalled();
  });

  it('returns ol style func', () => {

    const mbStyle = [{
      'id': 'gl-draw-polygon-fill-inactive',
      'type': 'fill',
      'filter': ['all',
        ['==', '$type', 'Polygon'],
      ],
      'paint': {
        'fill-color': '#3bb2d0',
        'fill-outline-color': '#3bb2d0',
        'fill-opacity': 0.1
      }
    }];
    const feature = new Feature(new Polygon([[[-1, -1], [-1, 1], [1, 1], [1, -1], [-1, -1]]]));
    feature.set('PERSONS', 2000000);
    const styleFunc = getOLStyleFunctionFromMapboxStyle(mbStyle);
    expect(styleFunc(feature, 1).length).toEqual(2);
  });
});
