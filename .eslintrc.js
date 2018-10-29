module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "browser": false,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": "2017",
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "sourceType": "module"
    },
    "rules": {
        "semi": ["error", "always"],
        "indent": ["error", 4],
        "quotes": ["error", "single"],
        "no-console": 0
    }
};