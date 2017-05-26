'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _urlTemplate = require('url-template');

var _urlTemplate2 = _interopRequireDefault(_urlTemplate);

var _apiGatewayClient = require('./lib/apiGatewayCore/apiGatewayClient');

var _apiGatewayClient2 = _interopRequireDefault(_apiGatewayClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
/* eslint max-len: ["error", 100]*/

// import 'babel-polyfill';
var apigClientFactory = {};

apigClientFactory.newClient = function (config) {
  var apigClient = {};
  if (config === undefined) {
    config = {
      accessKey: '',
      secretKey: '',
      sessionToken: '',
      region: '',
      apiKey: undefined,
      invokeUrl: '',
      service: '',
      defaultContentType: 'application/json',
      defaultAcceptType: 'application/json',
      systemClockOffset: 0
    };
  }
  if (typeof config.accessKey === 'undefined') {
    config.accessKey = '';
  }
  if (typeof config.secretKey === 'undefined') {
    config.secretKey = '';
  }
  if (typeof config.apiKey === 'undefined') {
    config.apiKey = '';
  }
  if (typeof config.sessionToken === 'undefined') {
    config.sessionToken = '';
  }
  if (typeof config.region === 'undefined') {
    config.region = 'us-east-1';
  }
  if (typeof config.service === 'undefined') {
    config.service = 'execute-api';
  }
  // If defaultContentType is not defined then default to application/json
  if (typeof config.defaultContentType === 'undefined') {
    config.defaultContentType = 'application/json';
  }
  // If defaultAcceptType is not defined then default to application/json
  if (typeof config.defaultAcceptType === 'undefined') {
    config.defaultAcceptType = 'application/json';
  }
  if (typeof config.systemClockOffset === 'undefined') {
    config.systemClockOffset = 0;
  }

  // extract endpoint and path from url
  var invokeUrl = config.invokeUrl;
  var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
  var pathComponent = invokeUrl.substring(endpoint.length);

  var sigV4ClientConfig = {
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    sessionToken: config.sessionToken,
    serviceName: config.service,
    region: config.region,
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
    systemClockOffset: config.systemClockOffset
  };

  var authType = 'NONE';
  if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
    authType = 'AWS_IAM';
  }

  var simpleHttpClientConfig = {
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType
  };

  var apiGatewayClient = _apiGatewayClient2.default.newClient(simpleHttpClientConfig, sigV4ClientConfig);

  apigClient.invokeApi = function (params, pathTemplate, method, additionalParams, body) {
    if (additionalParams === undefined) additionalParams = {};
    if (body === undefined) body = '';

    var request = {
      verb: method.toUpperCase(),
      path: pathComponent + _urlTemplate2.default.parse(pathTemplate).expand(params),
      headers: additionalParams.headers || {},
      queryParams: additionalParams.queryParams,
      body: body
    };

    return apiGatewayClient.makeRequest(request, authType, additionalParams, config.apiKey);
  };

  return apigClient;
};

exports.default = apigClientFactory;