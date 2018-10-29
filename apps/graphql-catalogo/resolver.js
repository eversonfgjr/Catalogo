'use strict';

module.exports = (app) => {

    const controller = require('./controller')(app);

    // define funcoes que tratam cada query definida em schema.js 
    const queries = {
        ofertasAereo: controller.listarOfertasAereo,
        produtosCategoria: controller.listarProdutosCategoria,
        produtosCategoriaPerfil: controller.listarProdutosCategoriaPerfil,
        campanhaVarejo: controller.getCampanhaVarejo,
        campanhasVarejo: controller.listarCampanhasVarejo,
        campanhasVarejoPerfil: controller.listarCampanhasVarejoPerfil,
        categoriasProduto: controller.listarCategoriasProduto,
        categoriasProdutoPerfil: controller.listarCategoriasProdutoPerfil,
        produto: controller.getProduto,
        grupos: controller.listarGrupos,
        grupo: controller.getGrupo
    };

    // define funcoes que tratam cada mutation definida em schema.js 
    const mutations = {
        gravarCampanhaVarejo:  controller.gravarCampanhaVarejo,
        gravarGrupoProdutos:  controller.gravarGrupoProdutos,
        associarCampanhaAProdutos: controller.associarCampanhaAProdutos
    };

    // define funcoes que resolvem atributos dos types definidos em schema.js
    const functions = {
        Campanha: {
            id: root => root.id || root._id,
            produtosOfertados: controller.getProdutosOfertadosCampanhaVarejo
        },
        Grupo: {
            produtos: controller.getProdutosGrupo
        },
        Produto: {
            id: root => root.id || root._id,
            configuracoes: root => root.configuracoesProduto,
            valorCalculado: controller.getValorCalculado
        },
        ImagemProduto: {
            url: root => Object.values(root)[0],
            nome: root => Object.keys(root)[0]
        },
        RetornoCampanhaProduto: {
            sucesso: controller.statusSucesso
        }
    };

    return ({
        queries,
        functions,
        mutations});
};