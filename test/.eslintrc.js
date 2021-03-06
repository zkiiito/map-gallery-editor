module.exports = {
    "env": {
        "mocha": true
    },
    extends: 'airbnb-base',
    "globals": {
        "assert": true,
        "expect": true,
        "should": true,
        "__static": true
    },
    "rules": {
        "func-names": 0,
        "prefer-arrow-callback": 0,
        'linebreak-style': 0,
        'indent': ['error', 4],
        'max-len': ['warn', 120]
    }
};
