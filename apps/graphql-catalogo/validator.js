'use strict';

module.exports = () => {
    const validator = require('../../utils/validator');

    const validarCampanhaVarejo = (campanha) => {
        const { checkField, checkReportForREST } = validator(campanha);

        checkField('id', 'ID invalido')
            .isOptional()
            .isMongoId();

        checkField('cnpj', 'CNPJ invalido')
            .isOptional()
            .isCNPJ();

        checkField('idParceiro', 'ID de Parceiro invalido')
            .isOptional()
            .notEmpty();

        return checkReportForREST();
    };

    const validarGrupoProdutos = (grupo) => {
        const { checkField, checkReportForREST } = validator(grupo);

        checkField('id', 'ID invalido')
            .isOptional()
            .isMongoId();

        checkField('cnpj', 'CNPJ invalido')
            .isOptional()
            .isCNPJ();

        checkField('idParceiro', 'ID de Parceiro invalido')
            .isOptional()
            .notEmpty();

        return checkReportForREST();
    };

    const validarCampanhaProduto = (grupo) => {
        const { checkField, checkReportForREST } = validator(grupo);

        checkField('id', 'ID inválido')
            .isMongoId()
            .isOptional();

        checkField('tipoDesconto', 'Tipo de Desconto inválido')
            .isOptional();

        checkField('valorDesconto', 'Valor do Desconto inválido')
            .isOptional();

        return checkReportForREST();
    };

    ////// retorna validators
    return {
        validarCampanhaVarejo,
        validarGrupoProdutos,
        validarCampanhaProduto
    };
};