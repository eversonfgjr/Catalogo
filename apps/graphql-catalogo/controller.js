'use strict';

module.exports = (app) => {

    const verificaErros = require('../../utils/errors/validationError');
    const { validarCampanhaVarejo,  validarGrupoProdutos, validarCampanhaProduto} = require('./validator')(app);
    const service = require('./service');
    const logger = app.get('logger');
    const pagination = require('../../utils/pagination');

    const listarOfertasAereo = async(root, data, context) => {
        const {numeroMultiplus, somenteVigentes, skip, limit} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarOfertasAereo(numeroMultiplus, somenteVigentes, skip, limit);
    };

    const listarProdutosCategoria = async(root, data, context) => {
        const {idCategoria, somenteDisponiveis} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarProdutosCategoria(idCategoria, false, [], [], somenteDisponiveis);
    };

    const listarProdutosCategoriaPerfil = async(root, data, context) => {
        const {idCategoria, listas, segmentos, somenteDisponiveis} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarProdutosCategoria(idCategoria, true, listas, segmentos, somenteDisponiveis);
    };
    
    const getCampanhaVarejo = async(root, data, context) => {
        const {id} = data;
        const {mongo, cache} = context;
        const campanha = await service(mongo, cache, logger).buscarCampanhaVarejo(id);
        return campanha;
    };

    const listarCampanhasVarejo = async(root, data, context) => {
        const {id, nome, skip, limit, somenteVigentes} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarCampanhasVarejo(id, nome, false, [], [], skip, limit, somenteVigentes);
    };

    const listarCampanhasVarejoPerfil = async(root, data, context) => {
        const {id, nome, listas, segmentos, skip, limit, somenteVigentes} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarCampanhasVarejo(id, nome, true, listas, segmentos, skip, limit, somenteVigentes);
    };

    const listarCategoriasProduto = async(root, data, context) => {
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarCategoriasProduto(false);
    };

    const listarCategoriasProdutoPerfil = async(root, data, context) => {
        const {listas, segmentos} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarCategoriasProduto(true, listas, segmentos);
    };

    const getProduto = async(root, data, context) => {
        const {id} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).getProduto(id);
    };

    const getValorCalculado = async(root) => {
        const { campanhas, skus } = root;
        let tmp;
        // define qual o sku com o maior precoPor
        skus.map(sku => {
            tmp = tmp > sku.precoPor ? tmp : sku.precoPor;
        });
        // define qual a campanha com maior desonto
        let valorComDesconto;
        let menorPreco;
        campanhas.map(campanha => {
            // calcula desconto
            let { tipoDesconto, valorDesconto } = campanha;
            if (tipoDesconto === 'fixo') {
                valorComDesconto = tmp - valorDesconto;
            } else if (tipoDesconto === 'porcentagem') {
                valorComDesconto = tmp * (1 - valorDesconto / 100);
            }
            // define o menor preco
            menorPreco = menorPreco && menorPreco.valor < valorComDesconto ?
                menorPreco : {
                    valor: valorComDesconto,
                    campanha: campanha
                };
        });

        return menorPreco;
    };

    const listarGrupos = async(root, data, context) => {
        const {skip, limit} = data;
        const {mongo, cache} = context;
        return await service(mongo, cache, logger).listarGrupos(undefined, skip, limit);
    };

    const getGrupo = async(root, data, context) => {
        const {id} = data;
        const {mongo, cache} = context;
        const grupo = await service(mongo, cache, logger).listarGrupos(id);
        return (grupo && grupo.length === 1 && grupo[0]) || undefined;
    };

    const gravarCampanhaVarejo = async(root, data, context) => {

        const {campanha} = data;
        const {mongo, cache} = context;

        ///// executa validação
        const errors = validarCampanhaVarejo(campanha);

        ///// verifica caso ocorram erros
        verificaErros(errors);
        
        await service(mongo, cache, logger).gravarCampanhaVarejo(campanha);
    };

    const gravarGrupoProdutos = async(root, data, context) => {

        const {grupo} = data;
        const {mongo, cache} = context;

        ///// executa validação
        const errors = validarGrupoProdutos(grupo);

        ///// verifica caso ocorram erros
        verificaErros(errors);
        
        await service(mongo, cache, logger).gravarGrupoProdutos(grupo);
    };

    const associarCampanhaAProdutos = async(root, data, context) => {

        const { produtosIds, campanha } = data;
        const { mongo, cache } = context;

        ///// executa validação
        const errors = validarCampanhaProduto(campanha);

        ///// verifica caso ocorram erros
        verificaErros(errors);

        return await service(mongo, cache, logger).associarCampanhaAProdutos(produtosIds, campanha);
    };

    const statusSucesso = (data) => {
        const { sucesso } = data;
        return sucesso;
    };

    const getProdutosOfertados = async (root, data, context) => {
        const {mongo, cache} = context;
        return pagination.page(
            data, 
            root,
            'produtosOfertados', 
            'produtoId', 
            async (ids) => await service(mongo, cache, logger).getProdutos(ids));
    };

    const getProdutosOfertadosCampanhaVarejo = async (root, data, context) => {
        const {mongo, cache} = context;
        const produtos = await service(mongo, cache, logger).getProdutos(root.produtos);
        const edges = produtos.map((produto) =>{
            return {
                cursor: produto._id,
                node: produto
            };
        });
        
        let retorno = {
            pageInfo: {
                startCursor: 0,
                endCursor: 1,
                hasNextPage: false
            },
            edges: edges,
            totalCount: produtos.length
        };
        return retorno;
    };

    const getProdutosGrupo = (root, data, context) => {
        const {mongo, cache} = context;
        return pagination.page(
            data, 
            root,
            'produtos', 
            'produtoId', 
            async (ids) => await service(mongo, cache, logger).getProdutos(ids));
    };

    return {
        listarOfertasAereo,
        listarProdutosCategoria,
        listarProdutosCategoriaPerfil,
        getCampanhaVarejo,
        listarCampanhasVarejo,
        listarCampanhasVarejoPerfil,
        listarCategoriasProduto,
        listarCategoriasProdutoPerfil,
        getProduto,
        listarGrupos,
        getGrupo,
        gravarCampanhaVarejo,
        gravarGrupoProdutos,
        associarCampanhaAProdutos,
        getProdutosOfertados,
        getProdutosGrupo,
        getProdutosOfertadosCampanhaVarejo,
        statusSucesso,
        getValorCalculado
    };
};