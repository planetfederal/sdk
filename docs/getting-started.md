## Getting started with SDK

This guide walks through the steps necessary to create a new React-Redux
project that will feature maps through SDK.

### Please use nvm

The [Node Version Manager](https://github.com/creationix/nvm)
provides a clean and easy way to keep
different versions of NodeJS installed simultaneously.

### Install yarn

Yarn is yet another node package manager. However, it offers a number
of performance features over npm.

```bash
npm install -g yarn
```

### Initialize the new app

```
npx create-react-app sdk-starter
cd sdk-starter
```

### Add the app dependencies

SDK-based apps do require additional dependencies. These include Redux for managing state.

```
yarn add redux react-redux ol ol-mapbox-style
```

### Add sass support

Follow the instructions [here](https://facebook.github.io/create-react-app/docs/adding-a-sass-stylesheet).

### Installing SDK

Only *one* of the following techniques are needed for installing
the SDK.

#### From npm

This is the standard way of installing SDK.
It is appropriate for those looking to develop a quick SDK app
and do not need the latest features from the master branch.

It will install the dist-version of the library.

```bash
yarn add @boundlessgeo/sdk
```

## Add a basic map:

### Add SDK Sass to the project

In your favorite editor open `src/App.scss`. On the first line add:

```css
@import "@boundlessgeo/sdk/stylesheet/sdk.scss";
```

### Import SDK and Redux

Open `src/App.js` in your favorite editor. After the line `import './App.scss';`,
add the following imports:


```javascript
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
```

### Create a new store with the map reducer.

After the imports add a store with the `SdkMapReducer`:
```javascript
const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));
```
### Configuring the initial map

The map configuration needs to happen outside of the `render()` method.
`render()` will be called every time a prop or state element is changed
and this would cause map layers to be added repeatedly causing ill effects.
However, `componentDidMount` is only called once, after the component has been
mounted.

After `class App extends Component {`, add the following lines:

```javascript
  componentDidMount() {
    // add the OSM source
    store.dispatch(SdkMapActions.addOsmSource('osm'));

    // add an OSM layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));
  }
```

### Add the map component to the application

Remove the header part, and replace it with an SDK map:

```javascript
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <SdkMap />
        </Provider>
      </div>
    );
  }
```

### Fire up the browser

The create-react-app creates a built-in hot-compiler and server.
```
yarn start
```

## Fin!

Congratulations! You should have a fully operational Boundless SDK React app!

## Advanced

### From GitHub

Instead of installing sdk from npm, you can also install it from github. This is the way to install SDK if the latest features are needed
or development on SDK is planned.

The following steps will clone SDK, install its dependencies,
build the library, and finally add it to the app.

```bash
cd ..
git clone https://github.com/boundlessgeo/sdk
cd sdk
npm install
npm run build:dist
cd ../sdk-starter
yarn add file:../sdk/dist
```

### Unit testing
If you want to write unit tests in your application that use the SDK, make sure you have ```canvas``` installed as a ```devDependency```.
See [here](https://github.com/boundlessgeo/sdk/blob/master/DEVELOPING.md#testing-and-the-canvas-module) for more details.
