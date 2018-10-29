'use strict';

const ObjectID = require('mongodb').ObjectID;

module.exports = (db) => {

    const config = require('../../config').load();

    ///// retorna uma campanha do varejo
    const listarCampanhasVarejo = async (id, nome, filtrarPerfil, listas = [], segmentos = [], skip = 0, limit = 0, somenteVigentes = true) => {
        
        const now = new Date();

        ///// query
        let query = {};

        if(somenteVigentes){
            query['dataInicioVigencia'] = {$lt: now};
            query['dataFimVigencia'] = {$gt: now};
        }

        if (id) {
            query['_id'] = new ObjectID(id);
        }
        if (nome) {
            query['nome'] = {
                $regex: nome,
                $options: 'i'
            };
        }

        if(filtrarPerfil){
            query = {$and:[
                query,
                {$or: [
                    {
                        'filtro': {                            
                            $exists: false
                        }
                    },{
                        $and: [
                            {
                                'filtro.tipo': 'SEGMENTO'
                            },{
                                'filtro.valor': {
                                    $in: segmentos
                                }
                            }]
                    },{
                        $and: [
                            {
                                'filtro.tipo': 'LISTA'
                            },{
                                'filtro.valor': {
                                    $in: listas
                                }
                            }]
                    }]}]
            };
        }
        const dbResult = await db.collection(config.database.collections.campanhaVarejo).find(query, {
            skip,
            limit
        }).toArray();

        return dbResult;
    };

    const buscarCampanhaVarejo = async (id) => {

        let query = { _id: new ObjectID(id) };

        const result = await db.collection(config.database.collections.campanhaVarejo).findOne(query);

        return result;
    };    

    const listarCampanhaVarejo = async (id, skip = 0, limit = 0) => {

        const query = { '_id': new ObjectID(id) };
        const options = { skip, limit };

        const dbResult = await db.collection(config.database.collections.campanhaVarejo)
            .findOne(query, options);

        return dbResult;
    };

    ///// lista as categorias de produtos associadas a campanhas vigentes
    const listarProdutosCategoria = async (idCategoria, filtrarPerfil, listas = [], segmentos = [], somenteDisponiveis = false) => {

        let pipeline = [];

        const now = new Date();

        pipeline.push({
            $match: {$and:[
                {dataInicioVigencia: {$lt: now}},
                {dataFimVigencia: {$gt: now}}
            ]}
        });

        if(filtrarPerfil){
            pipeline.push({
                $match: {                   
                    $or: [
                        {
                            'filtro': {                            
                                $exists: false
                            }
                        },{
                            $and: [
                                {
                                    'filtro.tipo': 'SEGMENTO'
                                },{
                                    'filtro.valor': {
                                        $in: segmentos
                                    }
                                }]
                        },{
                            $and: [
                                {
                                    'filtro.tipo': 'LISTA'
                                },{
                                    'filtro.valor': {
                                        $in: listas
                                    }
                                }]
                        }]
                }
            });
        }

        pipeline.push(
            { $unwind: '$produtos' },
            { $lookup: {
                from: 'produtoVarejo',
                localField: 'produtos',
                foreignField: '_id',
                as: '_produtos' }
            });

        if(idCategoria){
            pipeline.push(
                { $match: {'_produtos.categorias.idCategoria': idCategoria} });
        }

        if(somenteDisponiveis){
            pipeline.push(
                { $match: { '_produtos.skus.disponivel': true } });
        }

        const dbResult = await db.collection(config.database.collections.campanhaVarejo).aggregate(pipeline).toArray();
        const res = dbResult.map(x => x._produtos[0]).map(produto =>
            Object.assign({}, produto, { id: produto._id, idProduto: produto.id }));
        return res;
    };

    ///// lista as categorias de produtos associadas a campanhas vigentes
    const listarCategoriasProduto = async (filtrarPerfil, listas = [], segmentos = []) => {
        let pipeline = [];

        const now = new Date();

        pipeline.push({
            $match: { $and: [
                { dataInicioVigencia: { $lt: now } },
                { dataFimVigencia: { $gt: now } }
            ]}
        });

        if(filtrarPerfil){
            pipeline.push({
                $match: { $or: [
                    { 'filtro': { $exists: false } },
                    { $and: [
                        { 'filtro.tipo': 'SEGMENTO' },
                        { 'filtro.valor': { $in: segmentos } } ]
                    },
                    { $and: [
                        { 'filtro.tipo': 'LISTA' },
                        { 'filtro.valor': { $in: listas } } ]
                    }
                ]}
            });
        }

        pipeline.push(
            { $project: { titulo: 1, produtos: 1 } },
            { $unwind: '$produtos' },
            { $lookup: {
                from: 'produtoVarejo',
                localField: 'produtos',
                foreignField: '_id',
                as: '_produtos' }
            },
            { $match: { '_produtos.skus.disponivel': true } },
            { $unwind: '$_produtos' },
            { $unwind: '$_produtos.categorias' },
            { $group: {
                _id: '$_produtos.categorias.idCategoria',
                nomes: { $addToSet: '$_produtos.categorias.nome'} }
            }
        );

        const dbResult = await db.collection(config.database.collections.campanhaVarejo).aggregate(pipeline).toArray();
        const res = dbResult.map(x => ({ idCategoria: x._id, nome: x.nomes[0] }));
        return res;
    };

    ///// retorna um produto do varejo
    const getProduto = async (id) => {
        const result = await db.collection(config.database.collections.produtoVarejo).findOne({
            _id: new ObjectID(id)
        });
        return result;
    };

    ///// retorna produtos do varejo
    const getProdutos = async (ids) => {
        const dbObj = await db.collection(config.database.collections.produtoVarejo).find({
            _id: {$in: ids.map(id => new ObjectID(id))}
        }).toArray();
        return dbObj.map(produto => Object.assign({}, produto, {
            id: produto._id.toHexString()
        }));
    };

    ///// retorna ofertas do aereo
    const listarOfertasAereo = async (numeroMultiplus, somenteVigentes, skip, limit) => {

        const now = new Date();

        ///// query
        let query = {};

        if(somenteVigentes){
            query['dataIniVigencia'] = {$lt: now};
            query['dataFimVigencia'] = {$gt: now};
        }

        if (numeroMultiplus) {
            query['numeroMultiplus'] = numeroMultiplus;
        }

        const dbResult = await db.collection(config.database.collections.ofertaAereo).find(query, {
            skip,
            limit
        }).toArray();
        const res = dbResult.map(x => Object.assign({}, x, {
            id: x._id.toHexString()
        }));

        return res;
    };

    const atualizarProduto = async (idSku, disponivel) => {

        const query = { 'skus.id': idSku };
        const sort = {};
        const update = { $set: { 'skus.$.disponivel': disponivel } };
        const options = { upsert: false, new: true };

        const res = await db.collection(config.database.collections.produtoVarejo)
            .findAndModify(query, sort, update, options);

        return {
            id: res.value._id,
            ...res.value
        };
    };

    const gravarGrupoProdutos = async(grupo) => {

        let id = grupo.id;

        if (id) {
            await db.collection(config.database.collections.grupoProdutos).replaceOne({
                _id: new ObjectID(id)
            }, grupo);

        } else {
            const res = await db.collection(config.database.collections.grupoProdutos).insertOne(grupo);
            id = res.insertedId.toHexString();
        }
        return id;
    };

    const associarCampanhaAProdutos = async(produtosIds, campanha) => {

        let ids = [];
        produtosIds.map(id => ids.push(new ObjectID(id)));
        campanha.id = new ObjectID(campanha.id);

        const query = { _id: { $in: ids } };
        const update = { $addToSet: { campanhas: campanha } };
        const options = { multi: true };

        // TODO: o q retornar se nao vier o id?
        // TODO: o q fazer se nao achar o produto?

        const result = await db.collection(config.database.collections.produtoVarejo)
            .update(query, update, options);

        const retorno = {
            sucesso: result.result.ok === 1,
        };

        return retorno;
    };

    ///// retorna um produto do varejo
    const listarGrupos = async (id) => {

        ///// query
        let query = {};

        if (id) {
            query['_id'] = new ObjectID(id);
        }
        
        const dbObj = await db.collection(config.database.collections.grupoProdutos).find(query).toArray();
        const res = dbObj.map(grupo => Object.assign({}, grupo, {
            id: grupo._id.toHexString(),
            produtos: grupo.produtos.map(produto => Object.assign({}, produto, {produtoId: produto.produtoId.toHexString()}))
        }));
        return res;
    };

    let service = {
        listarProdutosCategoria,
        listarCampanhasVarejo,
        listarCampanhaVarejo,
        listarCategoriasProduto,
        getProduto,
        getProdutos,
        atualizarProduto,
        gravarGrupoProdutos,
        associarCampanhaAProdutos,
        listarGrupos,
        listarOfertasAereo,
        buscarCampanhaVarejo
    };

    return service;
};