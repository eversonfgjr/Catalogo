const {ObjectID} = require('mongodb');

module.exports = [
    {
        '_id' : ObjectID('5a77e0d591c1178c885e1a39'),
        'nome' : 'TV Samsung 32 polegadas',
        'descricao' : 'TV Samsung 32 polegadas',
        'descricaoCurta' : 'TV Samsung 32 polegadas',
        'precoDe' : 10000,
        'precoPor' : 9000,
        'id' : '5a77e0d591c1178c885e1a39',
        'categorias' : [ 
            'tv', 
            'eletronico'
        ],
        'skus' : [ 
            {
                'nome' : '110V',
                'precoDe' : 10000,
                'precoPor' : 9000,
                'disponivel' : true
            }, 
            {
                'nome' : '220V',
                'precoDe' : 10000,
                'precoPor' : 9000,
                'disponivel' : false
            }
        ],
        'parceiro' : 'Ponto Frio'
    },
    {
        '_id' : ObjectID('5a7f21ec2f727f83b9d35e26'),
        'nome' : 'TV Samsung 40 polegadas',
        'descricao' : 'TV Samsung 40 polegadas',
        'descricaoCurta' : 'TV Samsung 40 polegadas',
        'precoDe' : 15000,
        'precoPor' : 12000,
        'categorias' : [ 
            'tv', 
            'eletronico'
        ],
        'skus' : [ 
            {
                'nome' : '110V',
                'precoDe' : 15000,
                'precoPor' : 12000,
                'disponivel' : false
            }, 
            {
                'nome' : '220V',
                'precoDe' : 15000,
                'precoPor' : 12000,
                'disponivel' : false
            }
        ],
        'parceiro' : 'Ponto Frio'
    }
];