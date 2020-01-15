# Webmap SDK
![Logo](http://boundlessgeo.github.io/sdk/book/styles/boundless_sdk_horiz.svg)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Javascript SDK based on React, OpenLayers and Redux.

For the previous version, please see the 1.x branch instead.

## Running Project
To run the examples,

First, clone the project: `git clone https://github.com/planetfederal/sdk.git`

Then change into directory of cloned project: `cd sdk`

Create a file with the name `.env` in the root of your sdk directory and add your Mapbox API key in there:

```
MAPBOX_API_KEY=<your key here>
```

After this, run the following commands:

`npm install` - install libraries

`npm run build:examples` - build examples from templates

`npm start` - start webpack-dev-server

The last command should open your browser to a page of examples: http://localhost:3000/build/examples

## Using the SDK source to develop a local project

Please read [DEVELOPING.md](DEVELOPING.md) on how to create the SDK package and link to it locally.

## Troubleshooting

If `npm start` fails review node version, SDK targets v6.0 or greater.  On OSX node install can be error prone, seems to work best when installed by Brew http://brewformulas.org/Node

## Running tests

The test suite will skip a number of tests unless the `canvas` module has been installed.

For more details on installing `canvas` and other important developer notes
please read [DEVELOPING.md](DEVELOPING.md).
