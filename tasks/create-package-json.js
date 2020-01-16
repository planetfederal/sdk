var path = require('path');
var fsx = require('fs-extra');

/** Make a reduced version of the package.json file
 *  that is more appropriate for distribution.
 */

function main() {
  return new Promise((resolve) => {
    fsx.readFile(path.resolve(__dirname, '../package.json'), 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      resolve(data);
    });
  })
    .then((data) => JSON.parse(data))
    .then((packageData) => {
      const {
        author,
        version,
        description,
        keywords,
        repository,
        license,
        bugs,
        homepage,
        peerDependencies,
        dependencies,
      } = packageData;

      const minimalPackage = {
        name: 'webmap-sdk',
        author,
        version,
        description,
        keywords,
        repository,
        license,
        bugs,
        homepage,
        peerDependencies,
        dependencies,
      };

      return new Promise((resolve) => {
        const buildPath = path.resolve(__dirname, '../dist/package.json');
        const data = JSON.stringify(minimalPackage, null, 2);
        fsx.writeFile(buildPath, data, (err) => {
          if (err) {
            throw (err);
          }
          process.stdout.write(`Created package.json in ${buildPath}\n`);
          resolve();
        });
      });
    });
}

if (require.main === module) {
  main((err) => {
    if (err) {
      process.stderr.write(`Creating dist package.json failed. See the full trace below.\n\n ${err.stack} \n`);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

module.exports = main;
