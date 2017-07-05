/**
 * Helper class.
 */
class Helper {

    /**
     * The constructor.
     */
    constructor() {

        this._ = require('lodash');

    }

    /**
     * Generate topic based on action.
     *
     * @param prefix
     * @param deviceId
     * @param postfix
     * @returns {string}
     */
    generateTopic(prefix = '', deviceId = '', postfix = '') {

        return this._.trim(`${prefix}/${deviceId}/${postfix}`);

    }
}

module.exports = new Helper();