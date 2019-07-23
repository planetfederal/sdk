# Boundless SDK

## Using SDK from Source

Using SDK from source requires running `npm run dist` to create a `dist/` subdirectory
which produces the structure used for the npm package.

```bash
# Clone the repository
git clone https://github.com/boundlessgeo/sdk.git
# Enter the repo
cd sdk
# install dependencies
npm install
# create the package
npm run dist
# enter the package directory
cd dist/
# link to SDK
npm link
```

## Testing and the canvas module

The test suite uses the NPM `canvas` module to test certain interactions
with OpenLayers.  This requires `node-gyp` and the following dependencies:

**Debian/Ubuntu**

```bash
sudo apt-get install -y libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev g++
```

**MacOS**
If you have `homebrew` on your machine you can install via
```bash
brew install pkg-config cairo libpng jpeg giflib
```

## Testing with ES5 Dependencies
Some of the external dependencies are not pre-compiled with webpack and do not work well with Jest.  This can be resolved using [**transformIgnorePatterns**](https://jestjs.io/docs/en/tutorial-react-native#transformignorepatterns-customization) .  

This is reolved by adding to package.json
```javascript
    "jest": {
        "transformIgnorePatterns": [
            "/node_modules/(?!(@boundlessgeo|@mapbox|ol|ol-mapbox-style)).*/.*js$"
        ]
    }
```

### Advoid Ejecting Project from Create React App
Sometimes you don't want to eject a project from Create React App.  To work around this you need to bring in your own version of Jest, and make some config changes

```bash
yarn add jest --dev
```

Change the test script to call `jest` directly
```javascript
  "scripts": {
      ...
          "test": "jest",
```

Jest need create a `babel.config.js` in project root adding
```javascript
// babel.config.js
module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
  };
  ```
  Add the presets
  ```bash
yarn add  @babel/preset-env @babel/preset-react --dev
```

Jest needs custom transformers for testing imported files
create a `jest` folder and add 2 files `cssTransform.js` and `fileTransform.js`  

**fileTransform.js**
```javascript
'use strict';
const path = require('path');
module.exports = {
  process(src, filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
```

**cssTransform.js**
```javascript
'use strict';
module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
};
```

and update `package.json` jest config
```javascript
    "transform": {
      "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
```

Finally becuase we need to include a jest canvas mock
```bash
yarn add  jest-canvas-mock --dev
```
Add to `package.json` jest config
```javasciprt
    "setupFiles": [
      "jest-canvas-mock"
    ],
```

`Package.json` jest config should look like this
```javascript
  "jest": {
    "transformIgnorePatterns": [
      "/node_modules/(?!(@boundlessgeo|@mapbox|ol|ol-mapbox-style)).*/.*js$"
    ],
    "transform": {
      "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|css|json)$)": "<rootDir>/jest/fileTransform.js"
    },
    "setupFiles": [
      "jest-canvas-mock"
    ]
  }
  ```

See the [node-canvas documentation](https://github.com/Automattic/node-canvas/tree/v1.x#installation) for more information.

It is possible to run the tests without the `canvas` module. In this case a number
of tests will be skipped.


