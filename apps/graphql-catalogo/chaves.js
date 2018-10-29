'use strict';

///// funcoes para a geracao das chaves para o cache

const getChaveCampanhaVarejo = (id) =>
    `CAMPANHA:VAREJO:${id}`;

const getChaveProduto = (id) =>
    `PRODUTO:${id}`;

const getChaveProdutos = (ids) =>
    `PRODUTOS:${ids}`;

const getChaveCategoriasProdutos = () =>
    'CATEGORIAS';

const getChaveCategoriasProdutosPerfil = (listas, segmentos) =>
    `CATEGORIAS:LISTAS:${listas}:SEGMENTOS:${segmentos}`;

const getChaveProdutosCategoriaPerfil = (id, listas, segmentos) =>
    `CATEGORIA:${id}:PRODUTOS:LISTAS:${listas}:SEGMENTOS:${segmentos}`;

const getChaveProdutosCategoria = (id) =>
    `CATEGORIA:${id}:PRODUTOS`;

const getChaveGrupoProdutos = (id) =>
    `GRUPO-PRODUTOS:${id}`;

const getChaveOfertasAereo = (numeroMultiplus) =>
    `OFERTAS-AEREO:${numeroMultiplus}`;

module.exports = {
    getChaveCampanhaVarejo,
    getChaveProduto,
    getChaveProdutos,
    getChaveCategoriasProdutos,
    getChaveCategoriasProdutosPerfil,
    getChaveProdutosCategoriaPerfil,
    getChaveProdutosCategoria,
    getChaveGrupoProdutos,
    getChaveOfertasAereo
};