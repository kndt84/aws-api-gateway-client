# Overview
A node.js module for AWS API gateway client. This module is based on auto-generated JavaScript SDK, however, it can be used as node.js module and generalizes endpoint specific functions.

Reference:  
https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk.html

# Prerequisites
For the JavaScript SDK to work your APIs need to support CORS. The Amazon API Gateway developer guide explains how to [setup CORS for an endpoint]().

# Install
```
npm install aws-api-gateway-client
```

# Use the SDK in your project

Require module
```
var apigClientFactory = require('aws-api-gateway-client')
```

Set config params and create a client. For autholization, additional information is required and explained below.
```
config = {invokeUrl:'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev}
var apigClient = apigClientFactory.newClient(config);
```

Calls to an API take the form outlined below. Each API call returns a promise, that invokes either a success and failure callback

```
var params = {
    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    userId: '1234',
};
var pathTemplate = '/users/{userID}/profile'
var body = {
    //This is where you define the body of the request
};
var additionalParams = {
    //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
    headers: {
        param0: '',
        param1: ''
    },
    queryParams: {
        param0: '',
        param1: ''
    }
};

apigClient.invokeApi(params, pathTemplate, body, additionalParams)
    .then(function(result){
        //This is where you would put a success callback
    }).catch( function(result){
        //This is where you would put an error callback
    });
```

#Using AWS IAM for authorization
To initialize the SDK with AWS Credentials use the code below. Note, if you use credentials all requests to the API will be signed. This means you will have to set the appropiate CORS accept-* headers for each request.

```
var apigClient = apigClientFactory.newClient({
    accessKey: 'ACCESS_KEY',
    secretKey: 'SECRET_KEY',
    sessionToken: 'SESSION_TOKEN', //OPTIONAL: If you are using temporary credentials you must include the session token
    region: 'eu-west-1' // OPTIONAL: The region where the API is deployed, by default this parameter is set to us-east-1
});
```

#Using API Keys
To use an API Key with the client SDK you can pass the key as a parameter to the Factory object. Note, if you use an apiKey it will be attached as the header 'x-api-key' to all requests to the API will be signed. This means you will have to set the appropiate CORS accept-* headers for each request.

```
var apigClient = apigClientFactory.newClient({
    apiKey: 'API_KEY'
});
```



