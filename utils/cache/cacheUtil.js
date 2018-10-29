const cacheScanBatchSize = 100;
const nomeModulo = 'cacheUtils';


module.exports = (cache) => ({

    ///// wrapper para cache de consultas em banco 
    queryUsingCache: async(queryFn, cacheKey, ttl, { serverLogger: logger }) => {
        ///// busca em cache
        const result = await cache.getAsync(cacheKey);

        ///// verifica se foi encontrado
        if (result) {
            logger.log({
                level: 'info',
                source: nomeModulo,
                message: `cache hit - ${cacheKey}`
            });
            return JSON.parse(result);
        } else {
            logger.log({
                level: 'info',
                source: nomeModulo,
                message: `cache miss - ${cacheKey}`
            });
            ///// executa busca
            const resultDB = await queryFn();

            ///// add a cache
            if (resultDB && ttl && ttl !== 0) {
                logger.log({
                    level: 'info',
                    source: nomeModulo,
                    message: `cache add - ${cacheKey}`
                });
                cache.set(cacheKey, JSON.stringify(resultDB));
            }

            ///// retorna objeto de db
            return resultDB;
        }
    },

    ///// elimina itens do cache com base em um pattern para a chave
    cacheFlush: async(keyPattern) => {
        if (!cache) {
            return null;
        }

        let concluido = false;
        let cursor = '0';

        while (!concluido) {
            /////busca um lote de intes no cache com base no pattern
            const reply = await cache.scanAsync(cursor, 'MATCH', keyPattern, 'COUNT', cacheScanBatchSize);
            cursor = reply[0];
            const keys = reply[1];

            ///// exclui intens do cache
            keys.forEach((key) => {
                cache.del(key);
            });

            ///// verifica se cursor ainda possui itens
            concluido = cursor === '0';
        }
    },

    getCachedObj: async(cacheKey) => {
        if (!cache) {
            return null;
        }

        ///// verifica se ja esta em cache
        const cachedJson = await cache.getAsync(cacheKey);
        if (cachedJson) {
            return JSON.parse(cachedJson);
        } else {
            return null;
        }
    },

    setCachedObj: (cacheKey, obj, ttl) => {

        if (cache && ttl !== 0) {
            cache.set(cacheKey, JSON.stringify(obj), 'EX', ttl);
        }
    }
});