'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Service do catalogo', () => {

    let catalogoService, cacheUtilStub, usingCacheStub, cacheFlushStub, setCachedObjStub, catalogoModelStub, gravarGrupoProdutosStub, atualizarProdutoStub;

    before(() => {
        usingCacheStub = sinon.stub().returns();
        cacheFlushStub = sinon.stub();
        setCachedObjStub = sinon.stub();
        cacheUtilStub = sinon.stub().returns({
            queryUsingCache: usingCacheStub,
            cacheFlush: cacheFlushStub,
            setCachedObj: setCachedObjStub
        });
        gravarGrupoProdutosStub = sinon.stub().returns('1');
        atualizarProdutoStub = sinon.stub().returns({id:'1'});
        catalogoModelStub = sinon.stub().returns({
            gravarGrupoProdutos: gravarGrupoProdutosStub,
            atualizarProduto: atualizarProdutoStub
        });
        catalogoService = proxyquire('../../../apps/graphql-catalogo/service', {
            '../../utils/cache/cacheUtil': cacheUtilStub,
            './model':catalogoModelStub,
            '../../config':{load:()=>({
                redis:{
                    ttl:{
                        campanhaVarejo: 0,
                        produto: 0,
                        produtos: 0,
                        categoriasProdutosPerfil: 0,
                        categoriasProdutos: 0,
                        produtosCategoriaPerfil: 0,
                        produtosCategoria: 0,
                        grupo: 0,
                    }
                }
            })}
        });
    });

    beforeEach(() => {
        cacheUtilStub.resetHistory();
        usingCacheStub.resetHistory();
        cacheFlushStub.resetHistory();
        setCachedObjStub.resetHistory();
    });

    describe('listarCampanhasVarejo', () => {

        it('lista as campanhas do varejo, usando cache', () => {
            catalogoService({}).listarCampanhasVarejo('id', 'nome', true, [], [], 0, 0, true);
            expect(usingCacheStub.calledOnce).to.be.true;
            const args = usingCacheStub.firstCall.args;
            expect(typeof args[0]).to.be.equal('function');
            expect(typeof args[1]).to.be.equal('string');
            expect(typeof args[2]).to.be.equal('number');
            catalogoService({}).listarCampanhasVarejo('id', 'nome', false, [], [], 0, 0, true);
            expect(usingCacheStub.calledTwice).to.be.true;
            catalogoService({}).listarCampanhasVarejo('id', 'nome', false);
        });
    });

    describe('listarProdutosCategoria', () => {

        it('lista os produtos de uma categoria, usando cache', () => {
            catalogoService({}).listarProdutosCategoria('categoria', true, [], [], true);
            expect(usingCacheStub.calledOnce).to.be.true;
            const args = usingCacheStub.firstCall.args;
            expect(typeof args[0]).to.be.equal('function');
            expect(typeof args[1]).to.be.equal('string');
            expect(typeof args[2]).to.be.equal('number');
            catalogoService({}).listarProdutosCategoria('categoria', false, [], [], true);
            expect(usingCacheStub.calledTwice).to.be.true;
            catalogoService({}).listarProdutosCategoria('categoria', false);
        });
    });

    describe('listarCategoriasProduto', () => {

        it('lista as categorias de um produto, usando cache', () => {
            catalogoService({}).listarCategoriasProduto(true, [], []);
            expect(usingCacheStub.calledOnce).to.be.true;
            const args = usingCacheStub.firstCall.args;
            expect(typeof args[0]).to.be.equal('function');
            expect(typeof args[1]).to.be.equal('string');
            expect(typeof args[2]).to.be.equal('number');
            catalogoService({}).listarCategoriasProduto(false, [], []);
            expect(usingCacheStub.calledTwice).to.be.true;
            catalogoService({}).listarCategoriasProduto(false);
        });
    });

    describe('getProduto', () => {

        it('obter um produto, usando cache', () => {
            catalogoService({}).getProduto('1');
            expect(usingCacheStub.calledOnce).to.be.true;
            const args = usingCacheStub.firstCall.args;
            expect(typeof args[0]).to.be.equal('function');
            expect(typeof args[1]).to.be.equal('string');
            expect(typeof args[2]).to.be.equal('number');
        });
    });

    describe('getProdutos', () => {

        it('obter produtos, usando cache', () => {
            catalogoService({}).getProdutos(['1','2']);
            expect(usingCacheStub.calledOnce).to.be.true;
            const args = usingCacheStub.firstCall.args;
            expect(typeof args[0]).to.be.equal('function');
            expect(typeof args[1]).to.be.equal('string');
            expect(typeof args[2]).to.be.equal('number');
        });
    });

    describe('listarGrupos', () => {

        it('listar grupos de produtos, usando cache', () => {
            catalogoService({}).listarGrupos();
            expect(usingCacheStub.calledOnce).to.be.true;
            const args = usingCacheStub.firstCall.args;
            expect(typeof args[0]).to.be.equal('function');
            expect(typeof args[1]).to.be.equal('string');
            expect(typeof args[2]).to.be.equal('number');
        });
    });
    
    describe('gravarGrupoProdutos', () => {

        it('grava um grupo de produtos no banco de dados', async () => {
            await catalogoService({}).gravarGrupoProdutos({nome:'grupo1', produtos:[{produtoId:'1'},{produtoId:'2'}]});
            expect(gravarGrupoProdutosStub.calledOnce).to.be.true;
        });
    });

    describe('atualizarProduto', () => {

        it('grava um produtos no banco de dados', async () => {
            await catalogoService({}).atualizarProduto({nome:'produto 1'});
            expect(atualizarProdutoStub.calledOnce).to.be.true;
        });
    });

});