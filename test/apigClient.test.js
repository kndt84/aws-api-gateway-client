/* eslint arrow-parens: off */
import test from 'ava';
import apigClientFactory from '../src/apigClient.js';

// TEST CONFIG -- TODO fill in with "real" testable values
const config = {
  invokeUrl: 'https://0000000000.execute-api.us-east-1.amazonaws.com',
  region: 'us-east-1',
  accessKey: '00000000000000000000',
  secretKey: '0000000000000000000000000000000000000000',
  apiKey: '0000000000000000000000000000000000000000',
};

test('apigClientFactory exists', t => {
  t.deepEqual(typeof apigClientFactory, 'object');
  t.deepEqual(typeof apigClientFactory.newClient, 'function');
});

test('apigClientFactory creates client', t => {
  const client = apigClientFactory.newClient(config);
  t.deepEqual(typeof client, 'object');
});


