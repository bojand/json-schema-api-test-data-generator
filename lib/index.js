const jstdgen = require('json-schema-test-data-generator');
const _ = require('lodash');
const ps = require('prop-search');
const deref = require('json-schema-deref');

function getLinks(schema) {
  const schemaLinksRes = ps.searchForExistence(schema, 'links', { separator: '.' });
  let schemaLinks = [];
  if (schemaLinksRes && schemaLinksRes.length > 0) {
    schemaLinks = _.chain(schemaLinksRes)
      .map(link => link.value)
      .map('links')
      .flatten(true)
      .compact()
      .filter(link => link.schema || link.targetSchema)
      .value();
  }

  return schemaLinks;
}

function generateData(schema, fn) {
  const links = getLinks(schema);
  if (!links || !links.length) {
    return fn(null, []);
  }

  const ret = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    if (!link) {
      continue;
    }

    const data = {
      link: link,
      data: []
    };

    if (typeof link.method === 'string' && typeof link.rel === 'string') {
      const method = link.method.toUpperCase();
      const rel = link.rel.toLowerCase();
      if (method === 'GET') {
        if (rel === 'self') {
          data.data.push({
            message: 'should get instance'
          });
          data.data.push({
            message: 'should get 404 on unknown instance'
          });
        } else if (rel === 'instances') {
          data.data.push({
            message: 'should get empty list of instances if none exist'
          });
          data.data.push({
            message: 'should get list of instances'
          });
        }
      } else if (method === 'DELETE') {
        data.data.push({
          message: 'should delete instance'
        });
        data.data.push({
          message: 'should get 404 on unknown instance'
        });
      }
    }

    if (!link.schema) {
      ret.push(data);
      continue;
    }

    data.data.push(...jstdgen(link.schema));
    ret.push(data);
  }

  return fn(null, ret);
}

/**
 * Generate sample test data based on links in JSON Hyper-Schema definition
 * @param  {Object}   schema  JSON Hyper-Schema definition
 * @param  {Object}   options The options. For additional schema deref options See {@link https://www.npmjs.com/package/json-schema-deref json-schema-deref}
 * @param  {Boolean}  options.skipDeref If you are sure that there are no <code>$ref</code>'s in your schema, use this
 *                                      to skip schema deref, and it will make things faster. Default: <code>false</code>.
 * @param  {Function} fn      Callback in standard form <code>(err, result)</code>
 */
function generate(schema, options, fn) {
  if (_.isFunction(options)) {
    fn = options;
    options = {};
  }

  options = _.defaults(options, {
    skipDeref: false
  });

  if (typeof schema !== 'object') {
    process.nextTick(() => fn(new Error('No schema specified')));
  }

  if (options.skipDeref) {
    process.nextTick(() => generateData(schema, fn));
  }

  deref(schema, options, (err, fullSchema) => {
    if (err) {
      return fn(err);
    }

    generateData(fullSchema, fn);
  });
}

module.exports = generate;
