const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { resolve } = require('path');

const result = readdirSync(`./packages`, { withFileTypes: true });

result.forEach(c => {
  if (c.isDirectory() && c.name !== 'mocks') {
    const path = `./packages/${c.name}`;
    const package = read(resolve(path, 'package.json'));
    const currentVersion = package.version;
    const newVersion = +(currentVersion[currentVersion.length - 1]) + 1
    package.version = package.version.slice(0, -1) + newVersion;

    writeFileSync(resolve(path, 'package.json'), JSON.stringify(package, null, 2), 'utf-8');
  }
});

require('child_process').execSync('npm run build:all', {
  stdio: 'inherit',
});


function read(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}