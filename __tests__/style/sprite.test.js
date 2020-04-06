/* global it, beforeEach, describe, expect, spyOn */

import SdkSpriteStyle from 'webmap-sdk/style/sprite';
import canvas from 'canvas';

// this is kind of a hack to have tests work in jest
// but I don't see any other way to tackle this
canvas.Context2d.prototype.drawImage = function() {};

describe('Sprite style', () => {

  let options;

  beforeEach(() => {
    options = {
      src: 'chopper-small.png',
      color: [255, 0, 0],
      width: 30.5,
      height: 32,
      frameRate: 200,
      spriteCount: 4,
    };
  });


  it('should construct as expected', () => {
    const style = new SdkSpriteStyle(options);
    expect(style.color).toBe(options.color);
    expect(style.frameRate).toBe(options.frameRate);
    expect(style.width).toBe(options.width);
    expect(style.height).toBe(options.height);
    expect(style.spriteCount).toBe(options.spriteCount);
    expect(style.img_).toBeDefined();
  });

  it('should call drawImage when image loads', () => {
    const style = new SdkSpriteStyle(options);
    spyOn(style, 'drawImage_');
    // call onload on the image
    style.img_.onload();
    expect(style.drawImage_).toHaveBeenCalled();
  });

  it('should set default frame rate', () => {
    delete options.frameRate;
    const style = new SdkSpriteStyle(options);
    expect(style.frameRate).toEqual(100);
  });

  it('update should work as expected', () => {
    const style = new SdkSpriteStyle(options);
    spyOn(style, 'drawImage_');
    expect(style.offset).toEqual([0, 0]);
    style.update({frameState: {time: 400}});
    expect(style.offset).toEqual([61, 0]);
    expect(style.drawImage_).toHaveBeenCalled();
    // call update again with same params
    style.update({frameState: {time: 400}});
    expect(style.drawImage_.calls.count()).toEqual(1); // not called again
  });

  it('color option should work as expected', () => {
    options.color = [255, 0, 0];
    const style = new SdkSpriteStyle(options);
    const ctx = style.getImage().getContext('2d');
    spyOn(ctx, 'putImageData');
    style.update({frameState: {time: 400}});
    expect(ctx.putImageData).toHaveBeenCalled();
  });

});
