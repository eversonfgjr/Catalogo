'use strict';

const base64ToString = (base64) => new Buffer(base64, 'base64').toString('ascii');
const stringToBase64 = (str) => new Buffer(str).toString('base64');

const page = async (data, root, relationshipAttr, cursorAttr, childrenLoader) => {
    const children = root[relationshipAttr];
    const totalCount = children.length;
    
    const cursor = data.after && base64ToString(data.after);
    const start = cursor && children.findIndex(child => child[cursorAttr] >= cursor) + 1 || 0;
    const end = data.first && (start + data.first);
    
    const pageItems = children.slice(start, end);
    const pageItemsCount = pageItems.length;
    const pageHasItems = pageItemsCount > 0;

    const startCursor = pageHasItems? stringToBase64(pageItems[0][cursorAttr]):null;
    const endCursor = pageHasItems? stringToBase64(pageItems[pageItemsCount-1][cursorAttr]):null;
    const hasNextPage = totalCount > end;
    const nodes = await childrenLoader(pageItems.map(item => item[cursorAttr]));

    const edges = pageItems.map(item => ({
        ... item,
        cursor: stringToBase64(item[cursorAttr]),
        node: nodes.find(node => node.id === item[cursorAttr])}));

    return  {
        pageInfo: {
            startCursor,
            endCursor,
            hasNextPage
        },
        edges,
        totalCount
    };
};

module.exports = {
    page
};