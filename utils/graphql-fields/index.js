/**
 * @file Preencher options utilizado em query mongodb
 * @author douglaspands
 * @since 2018-01-02
 */
'use strict';

const _ = require('lodash');
const getFields = require('graphql-fields');

/**
 * Seleciona apenas os campos recebidos.
 * @param {object} data Objeto de entrada
 * @param {string} ast Lista de campos que serão recortados do objeto de retorno.
 * @return {object} Será retornado options preenchido para execução de query MongoDB. 
 */
function getQueryOptions(data, ast) {

    if (!_.isObjectLike(data) || _.isEmpty(data)) return {};
    if (!_.isObjectLike(ast) || _.isEmpty(ast)) return {};

    ///// campos filtrados em query graphql
    const fields = Object.keys(getFields(ast));
    const limit = data.first ? data.first : 20;
    const skip = data.skip ? data.skip : 0;
    const campos = {};

    ///// itera campos recebidos e preenche projection
    fields.forEach(function(element) {
        if (element === 'id') {
            campos['_id'] = '1';
        } else {
            campos[element] = '1';
        }
    });

    ///// seta options
    const options = {
        projection: campos,
        limit: limit,
        skip: skip
    };

    return options;
}

module.exports = getQueryOptions;