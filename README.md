# json-schema-api-test-data-generator

Not overly sophisticated utility that generates sample test data based on links in JSON Hyper-Schema.

## Installation

`npm install json-schema-api-test-data-generator`

## Usage

Module exports a single function that takes a JSON Hyper-Schema definition with links objects and outputs an array of
objects based on the links definitions covering various (but not all) combinations to check against.
The output objects are in format:

```
{
  link:     // the link definition
  data:     // array|undefined: an array of test data for that link definition
}
```

If the `link` definition has a `schema` defined we generate test data for that links.
Each `data` element is an object in form:

```
{
  valid:    // boolean|undefined: whether the test data is valid against the schema or not
  data:     // object|undefined: the actual data
  message:  // string: a descriptive message for the test
  property: // string|undefined: if available, the key / property at test
}
```

Sample usage:

```
var generate = require('json-schema-api-test-data-generator');

// hyper-schema that defines our REST API
var schema = {
  "type": "object",
  "definitions": {
    "user": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "minLength": 5
        },
        "active": {
          "type": "boolean"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "accountNumber": {
          "type": "number"
        }
      },
      "required": ["name", "email"]
    }
  },
  "properties": {
    "user": {
      "$ref": "#/definitions/user"
    }
  },
  "links": [{
    "description": "Create a new user.",
    "href": "/users",
    "method": "POST",
    "rel": "create",
    "title": "Create",
    "schema": {
      "$ref": "#/definitions/user"
    },
    "targetSchema": {
      "$ref": "#/definitions/user"
    }
  }, {
    "description": "List users.",
    "href": "/users",
    "method": "GET",
    "rel": "instances",
    "title": "List",
    "targetSchema": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/user"
      }
    }
  }, {
    "description": "Update an existing user.",
    "href": "/users/{email}",
    "method": "PUT",
    "rel": "update",
    "title": "Update",
    "schema": {
      "$ref": "#/definitions/user"
    },
    "targetSchema": {
      "$ref": "#/definitions/user"
    }
  }, {
    "description": "Delete an existing user.",
    "href": "/users/{email}",
    "method": "DELETE",
    "rel": "destroy",
    "title": "Update",
    "targetSchema": {
      "$ref": "#/definitions/user"
    }
  }]
};

generate(schema, function(err, res) {
  console.dir(res, {depth: null});
});
```

Output:

```
[ { link:
     { description: 'Create a new user.',
       href: '/users',
       method: 'POST',
       rel: 'create',
       title: 'Create',
       schema:
        { type: 'object',
          properties:
           { name: { type: 'string', minLength: 5 },
             active: { type: 'boolean' },
             email: { type: 'string', format: 'email' },
             accountNumber: { type: 'number' } },
          required: [ 'name', 'email' ] },
       targetSchema:
        { type: 'object',
          properties:
           { name: { type: 'string', minLength: 5 },
             active: { type: 'boolean' },
             email: { type: 'string', format: 'email' },
             accountNumber: { type: 'number' } },
          required: [ 'name', 'email' ] } },
    data:
     [ { valid: true,
         data:
          { name: 'reprehenderit',
            email: 'XnygcZ9dCu@EfXobwKuQ.kp',
            active: true },
         message: 'should work with all required properties' },
       { valid: true,
         data:
          { name: 'est aliquip irure',
            email: '8MgN4rlmKyuP@uGeYYSeCOCnvOqohLoEakIHn.woyg' },
         message: 'should work without optional property: active',
         property: 'active' },
       { valid: true,
         data: { name: 'sint ipsum amet ad', email: 'ZM4UZZZ0-1@j.ml' },
         message: 'should work without optional property: accountNumber',
         property: 'accountNumber' },
       { valid: false,
         data: { email: 'AogZCb@ghacVUptjGaErXDrpJZGwGI.onco' },
         message: 'should not work without required property: name',
         property: 'name' },
       { valid: false,
         data: { name: 'nulla' },
         message: 'should not work without required property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: false,
            email: 'b0P@Enja.bxm',
            accountNumber: 15629399.986937642 },
         message: 'should not work with \'name\' of type \'boolean\'',
         property: 'name' },
       { valid: false,
         data: { name: '[mlP', email: 'g3lTtcZSSDpO@abbIoKuEIxHJqMHmdr.pgjc' },
         message: 'should not pass validation for minLength of property: name',
         property: 'name' },
       { valid: false,
         data:
          { name: 'et quis',
            email: 'hLmwjGlAtcQZ@eWLXFADlCrgsJrHMtmWdY.hcd',
            accountNumber: -18683489.50520158,
            active: 7785059067101184 },
         message: 'should not work with \'active\' of type \'integer\'',
         property: 'active' },
       { valid: false,
         data:
          { name: 'id sint nostrud',
            email: 6920340101922816,
            accountNumber: 15984299.592673779 },
         message: 'should not work with \'email\' of type \'integer\'',
         property: 'email' },
       { valid: false,
         data: { name: 'proident', email: 'QU9A))%$' },
         message: 'should not pass validation for format of property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: 'velit fugiat ullamco',
            email: 'GfSK9nfWEO9Ely@LPnoBWodKFhrXsMNwhfmwdfPANeip.dxtd',
            accountNumber: null },
         message: 'should not work with \'accountNumber\' of type \'null\'',
         property: 'accountNumber' } ] },
  { link:
     { description: 'List users.',
       href: '/users',
       method: 'GET',
       rel: 'instances',
       title: 'List',
       targetSchema:
        { type: 'array',
          items:
           { type: 'object',
             properties:
              { name: { type: 'string', minLength: 5 },
                active: { type: 'boolean' },
                email: { type: 'string', format: 'email' },
                accountNumber: { type: 'number' } },
             required: [ 'name', 'email' ] } } },
    data:
     [ { message: 'should get empty list of instances if none exist' },
       { message: 'should get list of instances' } ] },
  { link:
     { description: 'Update an existing user.',
       href: '/users/{email}',
       method: 'PUT',
       rel: 'update',
       title: 'Update',
       schema:
        { type: 'object',
          properties:
           { name: { type: 'string', minLength: 5 },
             active: { type: 'boolean' },
             email: { type: 'string', format: 'email' },
             accountNumber: { type: 'number' } },
          required: [ 'name', 'email' ] },
       targetSchema:
        { type: 'object',
          properties:
           { name: { type: 'string', minLength: 5 },
             active: { type: 'boolean' },
             email: { type: 'string', format: 'email' },
             accountNumber: { type: 'number' } },
          required: [ 'name', 'email' ] } },
    data:
     [ { valid: true,
         data:
          { name: 'occaecat est do',
            email: 'uCcC0dBOstha8m@ULFyvvxZZjerJFLSehmxZekah.kqsm',
            active: true },
         message: 'should work with all required properties' },
       { valid: true,
         data: { name: 'id ex dolore sint', email: 'RH6@oXtzq.etx' },
         message: 'should work without optional property: active',
         property: 'active' },
       { valid: true,
         data:
          { name: 'magna id nisi sit',
            email: 'DJFSw17wkFpxH@RMtnNRzkwOigmJwDbtpoM.xx',
            active: false },
         message: 'should work without optional property: accountNumber',
         property: 'accountNumber' },
       { valid: false,
         data:
          { email: 'MHRVL-2bZLjtNeH@wdbQZOEWONZFcVmYFuRMouVWtEyxTJwgS.ax',
            active: true },
         message: 'should not work without required property: name',
         property: 'name' },
       { valid: false,
         data: { name: 'dolore ipsum', accountNumber: -17545116.59964919 },
         message: 'should not work without required property: email',
         property: 'email' },
       { valid: false,
         data: { name: 4448630052225024, email: 'MhxfauG@nijpNRDgyhcGdgqm.kg' },
         message: 'should not work with \'name\' of type \'integer\'',
         property: 'name' },
       { valid: false,
         data:
          { name: 'i@@]',
            email: '3lBnpqp-J@hVedOrDPupqov.mqsl',
            active: true },
         message: 'should not pass validation for minLength of property: name',
         property: 'name' },
       { valid: false,
         data:
          { name: 'minim dolor',
            email: 'PDHcRfuRXTt@cZZrTWzUfbpWHbSkLSMw.fsd',
            active: 61.03 },
         message: 'should not work with \'active\' of type \'number\'',
         property: 'active' },
       { valid: false,
         data: { name: 'estdeserunt', email: 9500069199872, active: true },
         message: 'should not work with \'email\' of type \'integer\'',
         property: 'email' },
       { valid: false,
         data:
          { name: 'laborum nulla reprehenderit dolore',
            email: 'GnfOGqpY)azctsLQsA' },
         message: 'should not pass validation for format of property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: 'tempor',
            email: 'pvOuONZk@PYaSRxcPPetQPxVdAhYqTN.rbz',
            accountNumber: -6349397491187712 },
         message: 'should not work with \'accountNumber\' of type \'integer\'',
         property: 'accountNumber' } ] },
  { link:
     { description: 'Delete an existing user.',
       href: '/users/{email}',
       method: 'DELETE',
       rel: 'destroy',
       title: 'Update',
       targetSchema:
        { type: 'object',
          properties:
           { name: { type: 'string', minLength: 5 },
             active: { type: 'boolean' },
             email: { type: 'string', format: 'email' },
             accountNumber: { type: 'number' } },
          required: [ 'name', 'email' ] } },
    data:
     [ { message: 'should delete instance' },
       { message: 'should get 404 on unknown instance' } ] } ]
```

## API Reference

<a name="generate"></a>

## generate(schema, options, fn)
Generate sample test data based on links in JSON Hyper-Schema definition

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object</code> | JSON Hyper-Schema definition |
| options | <code>Object</code> | The options. For additional schema deref options See [json-schema-deref](https://www.npmjs.com/package/json-schema-deref) |
| options.skipDeref | <code>Boolean</code> | If you are sure that there are no <code>$ref</code>'s in your schema, use this                                      to skip schema deref, and it will make things faster. Default: <code>false</code>. |
| fn | <code>function</code> | Callback in standard form <code>(err, result)</code> |

## CLI

`jsapitdgen schema.json > testdata.json`
