'use strict';

const fs = require('fs-extra');
const path = require('path');

const defaultConfig = {
  port: 8001,
  path: '/giwe',
};

function load() {
  const configPath = String(process.env.CONFIG || 'giwe.config.json');
  const filePath = path.resolve(process.cwd(), configPath);
  try {
    const config = fs.readJsonSync(filePath, 'utf-8');
    const options = Object.assign(defaultConfig, config);

    if (typeof options.path !== 'string' || !options.path.startsWith('/')) {
      throw new Error('"options.path" needs to be a string starting with "/"');
    }

    return options;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Could not load config file: ${filePath}`);
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
  return {};
}

module.exports = {
  load,
};
