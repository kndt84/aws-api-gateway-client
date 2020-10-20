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

import axios from 'axios';
import axiosRetry from 'axios-retry';
import utils from './utils';

const simpleHttpClientFactory = {};
simpleHttpClientFactory.newClient = (config) => {
  function buildCanonicalQueryString(queryParams) {
    // Build a properly encoded query string from a QueryParam object
    if (Object.keys(queryParams).length < 1) {
      return '';
    }

    let canonicalQueryString = '';
    for (let property in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, property)) {
        canonicalQueryString += encodeURIComponent(property)
          + '=' + encodeURIComponent(queryParams[property]) + '&';
      }
    }

    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  }

  let simpleHttpClient = { };
  simpleHttpClient.endpoint = utils.assertDefined(config.endpoint, 'endpoint');

  simpleHttpClient.makeRequest = function(request) {
    let verb = utils.assertDefined(request.verb, 'verb');
    let path = utils.assertDefined(request.path, 'path');
    let queryParams = utils.copy(request.queryParams);
    let timeout = utils.copy(request.timeout);
    if (queryParams === undefined) {
      queryParams = {};
    }
    if (timeout === undefined) {
      timeout = 0;
    }
    let headers = {...utils.copy(request.headers), ...config.headers};

    // If the user has not specified an override for Content type the use default
    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    }

    // If the user has not specified an override for Accept type the use default
    if (headers['Accept'] === undefined) {
      headers['Accept'] = config.defaultAcceptType;
    }

    let body = utils.copy(request.body);

    let url = config.endpoint + path;
    let queryString = buildCanonicalQueryString(queryParams);
    if (queryString !== '') {
      url += '?' + queryString;
    }

    let simpleHttpRequest = {
      headers: headers,
      timeout: timeout,
      data: body,
      method: verb,
      url: url,
    };
    if (config.retries !== undefined) {
      simpleHttpRequest.baseURL = url;
      let client = axios.create(simpleHttpRequest);

      // Allow user configurable delay, or built-in exponential delay
      let retryDelay = () => 0;
      if (config.retryDelay === 'exponential') {
        retryDelay = axiosRetry.exponentialDelay;
      } else if (typeof config.retryDelay === 'number') {
        retryDelay = () => parseInt(config.retryDelay);
      } else if (typeof config.retryDelay === 'function') {
        retryDelay = config.retryDelay;
      }

      axiosRetry(client, {
        retries: config.retries,
        retryCondition: (typeof config.retryCondition === 'function') ? config.retryCondition : axiosRetry.isNetworkOrIdempotentRequestError,
        retryDelay,
      });
      return client.request(simpleHttpRequest);
    }
    return axios(simpleHttpRequest);
  };

  return simpleHttpClient;
};

export default simpleHttpClientFactory;
