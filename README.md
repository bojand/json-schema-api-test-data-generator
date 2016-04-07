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
  valid:    // boolean: whether the test data is valid against the schema or not
  data:     // object: the actual data
  message:  // string: a descriptive message for the test data
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
          { name: 'tempor',
            email: 'p4cm9umErr-9@XQCBxuDhCwRlZLOAuGXc.cvya' },
         message: 'should work with all required properties' },
       { valid: true,
         data: { name: 'quisconsectetur', email: 'f3TC8jlNF@pWcGik.lhb' },
         message: 'should work without optional property: active',
         property: 'active' },
       { valid: true,
         data:
          { name: 'amet Excepteur tempor enim',
            email: '9-e23hfD@kaJMyoBvECJATqDzxZKnrMcByd.bedy' },
         message: 'should work without optional property: accountNumber',
         property: 'accountNumber' },
       { valid: false,
         data:
          { email: '8CiCSLf2GmyM@xWBrkzydYVUnGIWw.gthj',
            accountNumber: 50037452.997639775 },
         message: 'should not work without required property: name',
         property: 'name' },
       { valid: false,
         data: { name: 'qui incididunt id exercitation', active: true },
         message: 'should not work without required property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: null,
            email: 'n0FI3WIlq@UIwCKATxRNMaldoUgodH.nlqr',
            accountNumber: 54620025.446638465 },
         message: 'should not work with \'name\' of type \'null\'',
         property: 'name' },
       { valid: false,
         data:
          { name: 'DZX*',
            email: 'ZWj2Ono8XUfo@FsQOOxnDBtRbNOlyKAQuRlMnBGNTo.lpvo',
            active: true },
         message: 'should not pass validation for minLength of property: name',
         property: 'name' },
       { valid: false,
         data:
          { name: 'Ut in exercitation aliquip',
            email: 'DC6OmFggK9@QV.zolt',
            active: 67.47 },
         message: 'should not work with \'active\' of type \'number\'',
         property: 'active' },
       { valid: false,
         data: { name: 'exercitation quis Du', email: true },
         message: 'should not work with \'email\' of type \'boolean\'',
         property: 'email' },
       { valid: false,
         data: { name: 'consequat in dolo', email: 'b%eVm' },
         message: 'should not pass validation for format of property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: 'aliquip consectetur enim',
            email: 'eJrC3BE0BL@HhrKfJvUzCYMSDLHxhUHUjPIXlZCRYIC.qcmo',
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
             required: [ 'name', 'email' ] } } } },
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
         data: { name: 'dolore', email: 'fOSp2AW8oVi@MdIHuSSELgKGXqKSxkh.oam' },
         message: 'should work with all required properties' },
       { valid: true,
         data: { name: 'magna laboris', email: 'hhatghi@OjOTqkVTiYutDON.li' },
         message: 'should work without optional property: active',
         property: 'active' },
       { valid: true,
         data:
          { name: 'amet eu mollit officia',
            email: 'Mh5plowPPLItoX@VQYJGoaWlnfGp.flk' },
         message: 'should work without optional property: accountNumber',
         property: 'accountNumber' },
       { valid: false,
         data: { email: 'LJEp5cSK@zDrxlP.xgv', active: true },
         message: 'should not work without required property: name',
         property: 'name' },
       { valid: false,
         data: { name: 'in ut qui' },
         message: 'should not work without required property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: null,
            email: 'YloDBNiUn@DkMWhrTtWYFemRAQcgXhkTgQSO.zbp',
            active: true },
         message: 'should not work with \'name\' of type \'null\'',
         property: 'name' },
       { valid: false,
         data:
          { name: 'MqnI',
            email: 'CbpAJoZDPgJog@zSAlIJlVGzVjJQzXneTjt.wb',
            accountNumber: -57499667.44333506 },
         message: 'should not pass validation for minLength of property: name',
         property: 'name' },
       { valid: false,
         data: { name: 'laborum', email: 'cdX@vxLMfbwEsj.ittj', active: 54.11 },
         message: 'should not work with \'active\' of type \'number\'',
         property: 'active' },
       { valid: false,
         data: { name: 'ex reprehenderit ad culpa', email: true, active: true },
         message: 'should not work with \'email\' of type \'boolean\'',
         property: 'email' },
       { valid: false,
         data:
          { name: 'fugiat ullamco',
            email: 'gQVC2!n',
            accountNumber: -96776106.30169511 },
         message: 'should not pass validation for format of property: email',
         property: 'email' },
       { valid: false,
         data:
          { name: 'irure culpa nostr',
            email: 'T2gT02QykqQaZ1s@TcpDyFICrzoAcqaAjtq.srx',
            active: false,
            accountNumber: null },
         message: 'should not work with \'accountNumber\' of type \'null\'',
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
          required: [ 'name', 'email' ] } } } ]
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
