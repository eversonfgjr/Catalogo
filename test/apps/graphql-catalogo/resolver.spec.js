'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const graphqlTester = require('../../graphqlTester');

///// retornos dos stubs
const campanha = require('./dados/campanha');
const grupos = require('./dados/grupos');
const produtos = require('./dados/produtos');
const categorias = require('./dados/categorias');

describe('Interface GraphQL para Catalogo', () => {

    let graphql, controllerStub;

    before(() => {
        const schema = require('../../../apps/graphql-catalogo/schema');

        controllerStub = sinon.stub().returns({
            listarOfertasAereo: sinon.stub(),
            listarProdutosCategoria: sinon.stub().returns(produtos),
            listarProdutosCategoriaPerfil: sinon.stub().returns(produtos),
            getCampanhaVarejo: sinon.stub().returns(campanha),
            listarCampanhasVarejo: sinon.stub().returns([campanha]),
            listarCampanhasVarejoPerfil: sinon.stub().returns([campanha]),
            listarCategoriasProduto: sinon.stub().returns(categorias),
            listarCategoriasProdutoPerfil: sinon.stub().returns(categorias),
            getProduto: sinon.stub().returns(produtos[0]),
            listarGrupos: sinon.stub().returns(grupos),
            getGrupo: sinon.stub().returns(grupos[0]),
            atualizarProduto: sinon.stub(),
            gravarGrupoProdutos: sinon.stub(),
            gravarCampanhaVarejo: sinon.stub(),
            getProdutosOfertados: sinon.stub(),
            getProdutosGrupo: sinon.stub()
        });
        const resolver = proxyquire('../../../apps/graphql-catalogo/resolver', {
            './controller': controllerStub
        })();

        graphql = graphqlTester(schema, resolver);
    });

    describe('Query campanhasVarejo', () => {

        it('deve listar campanhas do varejo', async() => {
            const response = await graphql.execute(
                `{
                    campanhasVarejo(id: "1"){
                        descricao
                        produtosOfertados{
                            totalCount
                        }
                    }
                }`
            );

            expect(response).to.be.not.null;
            const campanhasVarejo = response.data.campanhasVarejo;
            expect(campanhasVarejo[0].descricao).to.be.equal('Campanha A');
        });
    });

    describe('Query campanhasVarejoPerfil', () => {

        it('deve listar campanhas do varejo por perfil', async() => {
            const response = await graphql.execute(
                `{
                    campanhasVarejoPerfil(listas: ["lista a"], segmentos: ["segmento b", "segmento c"]){
                        descricao
                    }
                }`
            );

            expect(response).to.be.not.null;
            const campanhasVarejoPerfil = response.data.campanhasVarejoPerfil;
            expect(campanhasVarejoPerfil[0].descricao).to.be.equal('Campanha A');
        });
    });

    describe('Query produtosCategoria', () => {

        it('deve listar produtos da categoria do varejo', async() => {
            const response = await graphql.execute(
                `{
                    produtosCategoria(idCategoria: "abc"){
                        nome
                    }
                }`
            );

            expect(response).to.be.not.null;
            const produtosCategoria = response.data.produtosCategoria;
            expect(produtosCategoria[0].nome).to.be.equal('TV Samsung 32 polegadas');
        });
    });

    describe('Query produtosCategoriaPerfil', () => {

        it('deve listar produtos da categoria do varejo por perfil', async() => {
            const response = await graphql.execute(
                `{
                    produtosCategoriaPerfil(idCategoria: "abc", listas: ["lista a"], segmentos: ["segmento b", "segmento c"]){
                        nome
                    }
                }`
            );

            expect(response).to.be.not.null;
            const produtosCategoriaPerfil = response.data.produtosCategoriaPerfil;
            expect(produtosCategoriaPerfil[0].nome).to.be.equal('TV Samsung 32 polegadas');
        });
    });

    describe('Query categoriasProduto', () => {

        it('deve listar as categorias de produtos', async() => {
            const response = await graphql.execute(
                `{
                    categoriasProduto{
                        nome
                    }
                }`
            );

            expect(response).to.be.not.null;
            const categoriasProduto = response.data.categoriasProduto;
            expect(categoriasProduto[0].nome).to.be.equal('cat a');
        });
    });

    describe('Query categoriasProdutoPerfil', () => {

        it('deve listar as categorias de produtos conforme perfil', async() => {
            const response = await graphql.execute(
                `{
                    categoriasProdutoPerfil(listas: ["lista a"], segmentos: ["segmento b", "segmento c"]){
                        nome
                    }
                }`
            );

            expect(response).to.be.not.null;
            const categoriasProdutoPerfil = response.data.categoriasProdutoPerfil;
            expect(categoriasProdutoPerfil[0].nome).to.be.equal('cat a');
        });
    });

    describe('Query produto', () => {

        it('deve retornar um produto', async() => {
            const response = await graphql.execute(
                `{
                    produto(id:"1"){
                        nome
                    }
                }`
            );

            expect(response).to.be.not.null;
            const produto = response.data.produto;
            expect(produto.nome).to.be.equal('TV Samsung 32 polegadas');
        });
    });

    describe('Query grupos', () => {

        it('deve retornar os grupos', async() => {
            const response = await graphql.execute(
                `{
                    grupos{
                        nome
                        produtos{
                            totalCount
                        }
                    }
                }`
            );

            expect(response).to.be.not.null;
            const grupos = response.data.grupos;
            expect(grupos[0].nome).to.be.equal('grupo 1');
        });
    });

    describe('Query grupo', () => {

        it('deve retornar o grupo', async() => {
            const response = await graphql.execute(
                `{
                    grupo(id:"1"){
                        nome
                        produtos{
                            totalCount
                        }
                    }
                }`
            );

            expect(response).to.be.not.null;
            console.log(response);
            const grupo = response.data.grupo;
            expect(grupo.nome).to.be.equal('grupo 1');
        });
    });
});