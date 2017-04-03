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

import uritemplate from 'url-template';
import apiGateway from './lib/apiGatewayCore/apiGatewayClient';

const apigClientFactory = {};

apigClientFactory.newClient = (config) => {
  const apigClient = {};
  if (config === undefined) {
    config = {
      accessKey: '',
      secretKey: '',
      sessionToken: '',
      region: '',
      apiKey: undefined,
      invokeUrl: '',
      defaultContentType: 'application/json',
      defaultAcceptType: 'application/json',
    };
  }
  if (config.accessKey === undefined) {
    config.accessKey = '';
  }
  if (config.secretKey === undefined) {
    config.secretKey = '';
  }
  if (config.apiKey === undefined) {
    config.apiKey = '';
  }
  if (config.sessionToken === undefined) {
    config.sessionToken = '';
  }
  if (config.region === undefined) {
    config.region = 'us-east-1';
  }
  // If defaultContentType is not defined then default to application/json
  if (config.defaultContentType === undefined) {
    config.defaultContentType = 'application/json';
  }
  // If defaultAcceptType is not defined then default to application/json
  if (config.defaultAcceptType === undefined) {
    config.defaultAcceptType = 'application/json';
  }

  // extract endpoint and path from url
  const invokeUrl = config.invokeUrl;
  const endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
  const pathComponent = invokeUrl.substring(endpoint.length);

  const sigV4ClientConfig = {
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    sessionToken: config.sessionToken,
    serviceName: 'execute-api',
    region: config.region,
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
  };

  let authType = 'NONE';
  if (
    sigV4ClientConfig.accessKey !== undefined
    && sigV4ClientConfig.accessKey !== ''
    && sigV4ClientConfig.secretKey !== undefined
    && sigV4ClientConfig.secretKey !== ''
  ) {
      authType = 'AWS_IAM';
  }

  const simpleHttpClientConfig = {
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
  };

  const apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(
    simpleHttpClientConfig,
    sigV4ClientConfig
  );

  apigClient.invokeApi = (params, pathTemplate, method, additionalParams, body) => {
    if (additionalParams===undefined) additionalParams={};
    if (body===undefined) body='';

    const request = {
        verb: method.toUpperCase(),
        path: pathComponent + uritemplate.parse(pathTemplate).expand(params),
        headers: additionalParams.headers || {},
        queryParams: additionalParams.queryParams,
        body: body,
    };

    return apiGatewayClient.makeRequest(request, authType, additionalParams, config.apiKey);
  };


  return apigClient;
};

export default apigClientFactory;
