[![dependencies Status](https://david-dm.org/kndt84/aws-api-gateway-client/status.svg)](https://david-dm.org/kndt84/aws-api-gateway-client)
[![Build Status](https://travis-ci.org/kndt84/aws-api-gateway-client.svg?branch=master)](https://travis-ci.org/kndt84/aws-api-gateway-client)
[![npm](https://img.shields.io/npm/dm/aws-api-gateway-client.svg)](https://www.npmjs.com/package/aws-api-gateway-client)


# Overview
A module for AWS API gateway client based on auto-generated JavaScript SDK. This module can be used not only for Node.js but for front-end. In addition, it generalizes original SDK's endpoint specific methods.

Reference:  
https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk.html

# Prerequisites
For the JavaScript SDK to work your APIs need to support CORS. The Amazon API Gateway developer guide explains how to [setup CORS for an endpoint](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html).

# Install
```
npm install aws-api-gateway-client
```

# Use the SDK in your project

Require module
```
var apigClientFactory = require('aws-api-gateway-client').default;
```

Set invokeUrl to config and create a client. For authorization, additional information is required as explained below.
```
config = {invokeUrl:'https://xxxxx.execute-api.us-east-1.amazonaws.com'}
var apigClient = apigClientFactory.newClient(config);
```

Calls to an API take the form outlined below. Each API call returns a promise, that invokes either a success and failure callback

```
var pathParams = {
    //This is where path request params go. 
    userId: '1234',
};
// Template syntax follows url-template https://www.npmjs.com/package/url-template
var pathTemplate = '/users/{userID}/profile'
var method = 'GET';
var additionalParams = {
    //If there are query parameters or headers that need to be sent with the request you can add them here
    headers: {
        param0: '',
        param1: ''
    },
    queryParams: {
        param0: '',
        param1: ''
    }
};
var body = {
    //This is where you define the body of the request
};

apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
    .then(function(result){
        //This is where you would put a success callback
    }).catch( function(result){
        //This is where you would put an error callback
    });
```

# Using AWS IAM for authorization
To initialize the SDK with AWS Credentials use the code below. Note, if you use credentials all requests to the API will be signed. This means you will have to set the appropiate CORS accept-* headers for each request.

```
var apigClient = apigClientFactory.newClient({
    invokeUrl:'https://xxxxx.execute-api.us-east-1.amazonaws.com', // REQUIRED
    
    region: 'eu-west-1',                                           // REQUIRED: The region where the API is deployed.
    
    accessKey: 'ACCESS_KEY',                                       // REQUIRED
    
    secretKey: 'SECRET_KEY',                                       // REQUIRED

    sessionToken: 'SESSION_TOKEN',                                 // OPTIONAL: If you are using temporary credentials
                                                                                you must include the session token.
    
    systemClockOffset: 0,                                          // OPTIONAL: An offset value in milliseconds to apply to signing time
    
    retries: 4,                                                    // OPTIONAL: Number of times to retry before failing. Uses axios-retry plugin.
    
    retryCondition: (err) => {                                     // OPTIONAL: Callback to further control if request should be retried.
      return err.response && err.response.status === 500;          //           Uses axios-retry plugin.
    },
    
    retryDelay: 100 || 'exponential' || (retryCount, error) => {   // OPTIONAL: Define delay (in ms) as a number, a callback, or
      return retryCount * 100                                      //           'exponential' to use the in-built exponential backoff
    }                                                              //           function. Uses axios-retry plugin. Default is no delay.
});
```

# Using API Keys
To use an API Key with the client SDK you can pass the key as a parameter to the Factory object. Note, if you use an apiKey it will be attached as the header 'x-api-key' to all requests to the API will be signed. This means you will have to set the appropiate CORS accept-* headers for each request.

```
var apigClient = apigClientFactory.newClient({
    invokeUrl:'https://xxxxx.execute-api.us-east-1.amazonaws.com', // REQUIRED
    apiKey: 'API_KEY', // REQUIRED
    region: 'eu-west-1' // REQUIRED
});
```
