const devData = require('./development-data');
const testData = require('./test-data');

const data = { development: devData, test: testData }

const ENV = process.env.NODE_ENV || 'development';

module.exports = data[ENV]