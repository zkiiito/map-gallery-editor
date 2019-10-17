const Ajv = require('ajv');

const ajv = new Ajv();
const schema = require('@/store/schema');
const validate = ajv.compile(schema);

export default {
    validate,
};
