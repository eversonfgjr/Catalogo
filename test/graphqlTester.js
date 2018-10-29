const {
    graphql
} = require('graphql');
const {
    makeExecutableSchema
} = require('graphql-tools');

const gql = (schema, resolver) => ({
    execute: async(cmd) => {

        const typeDefs = `
            ${schema.types}
            
            type Query {
            ${schema.queries}
            }
            
            type Mutation {
                ${schema.mutations}
            }
        `;

        const resolvers = {
            Query: {},
            Mutation: {}
        };

        Object.keys(resolver.functions).forEach(f => {
            resolvers[f] = resolver.functions[f];
        });
        Object.keys(resolver.queries).forEach(q => {
            resolvers.Query[q] = resolver.queries[q];
        });
        Object.keys(resolver.mutations).forEach(m => {
            resolvers.Mutation[m] = resolver.mutations[m];
        });

        const rootSchema = makeExecutableSchema({
            typeDefs,
            resolvers
        });

        return await graphql(rootSchema, cmd);
    }
});

module.exports = gql;