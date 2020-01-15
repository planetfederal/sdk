// babel.config.js
module.exports =
    {
      'presets': [
        '@babel/react',
        '@babel/env'
      ],
      'plugins': [
        'dynamic-import-node',
        [
          'module-resolver',
          {
            'alias': {
              'webmap-sdk': './src'
            }
          }
        ]
      ]
    };
