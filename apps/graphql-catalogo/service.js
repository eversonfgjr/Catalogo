'use strict';

const config = require('../../config').load();
const chaves = require('./chaves');
const modelCatalogo = require('./model');

module.exports = (db, cache, logger) => {

    const {
        queryUsingCache,
        cacheFlush
    } = require('../../utils/cache/cacheUtil')(cache);

    const model = modelCatalogo(db, cache, logger);

    ///// lista ofertas do aereo
    const listarOfertasAereo = async(numeroMultiplus, somenteVigentes, skip, limit) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.listarOfertasAereo(numeroMultiplus, somenteVigentes, skip, limit);
        const chaveCache = chaves.getChaveOfertasAereo(numeroMultiplus, somenteVigentes, skip, limit);
        const ttlCache = config.redis.ttl.ofertaAereo;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    ///// retorna uma campanha do vajero
    const listarCampanhasVarejo = async(id, nome, filtrarPerfil, listas = [], segmentos = [], skip, limit, somenteVigentes = true) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.listarCampanhasVarejo(id, nome, filtrarPerfil, listas, segmentos, skip, limit, somenteVigentes);
        const chaveCache = chaves.getChaveCampanhaVarejo(id);
        const ttlCache = config.redis.ttl.campanhaVarejo;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    ///// retorna uma campanha do varejo
    const buscarCampanhaVarejo = async(id, nome, filtrarPerfil, listas = [], segmentos = [], skip, limit, somenteVigentes = true) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.buscarCampanhaVarejo(id, nome, filtrarPerfil, listas, segmentos, skip, limit, somenteVigentes);
        const chaveCache = chaves.getChaveCampanhaVarejo(id);
        const ttlCache = config.redis.ttl.campanhaVarejo;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    const listarCampanhaVarejo = async(id, skip, limit) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.listarCampanhaVarejo(id, skip, limit);
        const chaveCache = chaves.getChaveCampanhaVarejo(id);
        const ttlCache = config.redis.ttl.campanhaVarejo;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    ///// lista as categorias de produtos associadas a campanhas vigentes
    const listarProdutosCategoria = async(idCategoria, filtrarPerfil, listas = [], segmentos = [], somenteDisponiveis = false) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.listarProdutosCategoria(idCategoria, filtrarPerfil, listas, segmentos, somenteDisponiveis);
        const chaveCache = filtrarPerfil?chaves.getChaveProdutosCategoriaPerfil(idCategoria, listas, segmentos):chaves.getChaveProdutosCategoria(idCategoria);
        const ttlCache = filtrarPerfil?config.redis.ttl.produtosCategoriaPerfil:config.redis.ttl.produtosCategoria;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    ///// lista as categorias de produtos associadas a campanhas vigentes
    const listarCategoriasProduto = async(filtrarPerfil, listas = [], segmentos = []) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.listarCategoriasProduto(filtrarPerfil, listas, segmentos);
        const chaveCache = filtrarPerfil?chaves.getChaveCategoriasProdutosPerfil(listas, segmentos):chaves.getChaveCategoriasProdutos();
        const ttlCache = filtrarPerfil?config.redis.ttl.categoriasProdutosPerfil:config.redis.ttl.categoriasProdutos;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    ///// retorna um produto do vajero
    const getProduto = async(id) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.getProduto(id);
        const chaveCache = chaves.getChaveProduto(id);
        const ttlCache = config.redis.ttl.produto;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar o produto do varejo
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    ///// retorna produtos do vajero
    const getProdutos = async(ids) => {

        ///// funcao para busca da base de dados
        const fn = async () => await model.getProdutos(ids);
        const chaveCache = chaves.getChaveProdutos(ids);
        const ttlCache = config.redis.ttl.produtos;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar o produto do varejo
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    const atualizacaoProduto = async (msg) => {

        const idSku = msg['estoque-produto']['sku']['id-sku'];
        const disponivel = msg['estoque-produto']['indicador-disponivel'] && 
            msg['estoque-produto']['indicador-disponivel'].toUpperCase() === 'TRUE';

        const resultado = await model.atualizarProduto(idSku, disponivel);

        ///// limpa o cache 
        cacheFlush(chaves.getChaveProduto(resultado.id));

        return resultado;
    };

    const gravarGrupoProdutos = async(grupo) => {

        const id = await model.gravarGrupoProdutos(grupo);

        ///// limpa o cache 
        cacheFlush(chaves.getChaveGrupoProdutos(id));

        return id;
    };

    const associarCampanhaAProdutos = async(produtosIds, campanha) => {

        const result = await model.associarCampanhaAProdutos(produtosIds, campanha);

        cacheFlush(chaves.getChaveProdutos(produtosIds));

        return result;
    };

    ///// retorna um produto do vajero
    const listarGrupos = async(id) => {
        
        ///// funcao para busca da base de dados
        const fn = async () => await model.listarGrupos(id);
        const chaveCache = chaves.getChaveGrupoProdutos(id);
        const ttlCache = config.redis.ttl.grupo;

        ///// realiza busca no cache e, se necessario, chama a funcao para recuperar o produto do varejo
        return await queryUsingCache(fn, chaveCache, ttlCache, logger);
    };

    let service = {
        listarProdutosCategoria,
        listarCampanhasVarejo,
        listarCampanhaVarejo,
        listarCategoriasProduto,
        getProduto,
        getProdutos,
        atualizacaoProduto,
        gravarGrupoProdutos,
        associarCampanhaAProdutos,
        listarGrupos,
        listarOfertasAereo,
        buscarCampanhaVarejo
    };

    return service;
};