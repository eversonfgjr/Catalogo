'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaves = require('../../../apps/graphql-catalogo/chaves');

describe('calcula chave do cache', () => {

    it('chave da campanha varejo', () => {
        const chave = chaves.getChaveCampanhaVarejo('1');
        expect(chave).to.be.equal('CAMPANHA:VAREJO:1');
    });

    it('chave do produto', () => {
        const chave = chaves.getChaveProduto('1');
        expect(chave).to.be.equal('PRODUTO:1');
    });

    it('chave das categorias', () => {
        const chave = chaves.getChaveCategoriasProdutos();
        expect(chave).to.be.equal('CATEGORIAS');
    });

    it('chave das categorias de produtos dado um perfil de participante', () => {
        const chave = chaves.getChaveCategoriasProdutosPerfil(['a','b'],['c','d']);
        expect(chave).to.be.equal('CATEGORIAS:LISTAS:a,b:SEGMENTOS:c,d');
    });

    it('chave dos produtos de uma categoria um perfil de participante', () => {
        const chave = chaves.getChaveProdutosCategoriaPerfil('1', ['a','b'],['c','d']);
        expect(chave).to.be.equal('CATEGORIA:1:PRODUTOS:LISTAS:a,b:SEGMENTOS:c,d');
    });

    it('chave dos produtos de uma categoria', () => {
        const chave = chaves.getChaveProdutosCategoria('1');
        expect(chave).to.be.equal('CATEGORIA:1:PRODUTOS');
    });

    it('chave de um grupo de produtos', () => {
        const chave = chaves.getChaveGrupoProdutos('1');
        expect(chave).to.be.equal('GRUPO-PRODUTOS:1');
    });
});
