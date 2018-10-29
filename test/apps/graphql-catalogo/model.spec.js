'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Model do catalogo', () => {

    let catalogoModel, mongoStub, findStub, findOneStub, collectionStub, aggregateStub, updateStub, findOneAndUpdateStub, replaceOneStub, insertOneStub;

    before(() => {
        replaceOneStub = sinon.stub().returns();
        findOneAndUpdateStub = sinon.stub().returns({value:{id:'123456789012345678901234'}});
        insertOneStub = sinon.stub().returns({
            insertedId:{toHexString: sinon.stub().returns('123456789012345678901234')}});
        findStub = sinon.stub().returns({
            toArray: sinon.stub().returns([])
        });
        findOneStub = sinon.stub().returns({
            _id: {
                toHexString: sinon.stub().returns('123456789012345678901234')
            }
        });
        aggregateStub = sinon.stub().returns({
            toArray: sinon.stub().returns([])
        });
        
        updateStub = sinon.stub().resolves({
            insertedId: {
                toHexString: ()=>'1'
            }
        });
        collectionStub = sinon.stub().returns({
            replaceOne: replaceOneStub,
            find: findStub,
            findOne: findOneStub,
            findOneAndUpdate: findOneAndUpdateStub,
            insertOne: insertOneStub,
            aggregate: aggregateStub,
            update: updateStub
        });
        mongoStub = {
            collection: collectionStub
        };
        catalogoModel = proxyquire('../../../apps/graphql-catalogo/model',{
            '../../config':{load:()=>({
                database: {
                    collections:{
                        campanhaVarejo: 'campanhaVarejo',
                        produtoVarejo: 'produtoVarejo',
                        grupoProdutos: 'grupoProdutos',
                        ofertaAereo: 'ofertaAereo'
                    }
                }
            })}
        })(mongoStub);
    });

    beforeEach(() => {
        findStub.resetHistory();
        findOneStub.resetHistory();
        collectionStub.resetHistory();
        aggregateStub.resetHistory();
        findOneAndUpdateStub.resetHistory();
        replaceOneStub.resetHistory();
        insertOneStub.resetHistory();
    });

    describe('listarCampanhasVarejo', () => {

        it('lista as campanhas do varejo', () => {
            catalogoModel.listarCampanhasVarejo('123456789012345678901234', 'nome', true, [], [], 0, 0, true);
            expect(collectionStub.calledOnce).to.be.true;
            expect(findStub.calledOnce).to.be.true;
        });
        it('lista as campanhas do varejo', () => {
            catalogoModel.listarCampanhasVarejo();
            expect(collectionStub.calledOnce).to.be.true;
            expect(findStub.calledOnce).to.be.true;
        });
    });

    describe('listarProdutosCategoria', () => {

        it('lista produtos da categoria', () => {
            catalogoModel.listarProdutosCategoria('1');
            expect(collectionStub.calledOnce).to.be.true;
            expect(aggregateStub.calledOnce).to.be.true;
        });
    });

    describe('listarCategoriasProduto', () => {

        it('lista categorias dos produtos', () => {
            catalogoModel.listarCategoriasProduto();
            expect(collectionStub.calledOnce).to.be.true;
            expect(aggregateStub.calledOnce).to.be.true;
        });
    });

    describe('getProduto', () => {

        it('recupera um produto', () => {
            catalogoModel.getProduto('123456789012345678901234');
            expect(collectionStub.calledOnce).to.be.true;
            expect(findOneStub.calledOnce).to.be.true;
        });
    });

    describe('getProdutos', () => {

        it('recupera produtos', () => {
            catalogoModel.getProdutos(['123456789012345678901234', '123456789012345678901235']);
            expect(collectionStub.calledOnce).to.be.true;
            expect(findStub.calledOnce).to.be.true;
        });
    });

    describe('atualizarProduto', () => {

        it('atualiza um produto', () => {
            catalogoModel.atualizarProduto({id:'123456789012345678901234', nome:'Nome do produto'});
            expect(collectionStub.calledOnce).to.be.true;
            expect(findOneAndUpdateStub.calledOnce).to.be.true;
        });
    });

    describe('gravarGrupoProdutos', () => {

        it('grava um grupo de produtos', () => {
            catalogoModel.gravarGrupoProdutos({id:'123456789012345678901234', nome:'Nome do Grupo'});
            expect(collectionStub.calledOnce).to.be.true;
            expect(replaceOneStub.calledOnce).to.be.true;
        });
    });

    describe('gravarGrupoProdutos', () => {

        it('grava um grupo de produtos', () => {
            catalogoModel.gravarGrupoProdutos({nome:'Nome do Grupo'});
            expect(collectionStub.calledOnce).to.be.true;
            expect(insertOneStub.calledOnce).to.be.true;
        });
    });

    describe('listarGrupos', () => {

        it('lista grupos de produtos', () => {
            catalogoModel.listarGrupos('123456789012345678901234');
            expect(collectionStub.calledOnce).to.be.true;
            expect(findStub.calledOnce).to.be.true;
        });
        
        it('lista todos os grupos de produtos', () => {
            catalogoModel.listarGrupos();
            expect(collectionStub.calledOnce).to.be.true;
            expect(findStub.calledOnce).to.be.true;
        });
    });
});