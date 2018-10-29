'use strict';

const types = `

  ### QUERY TYPES ###

  # Produto Varejo
  type Produto {
    id: ID!
    idProduto: String
    nome: String!
    descricaoCurta: String
    descricao: String
    categorias: [Categoria]!
    campanhas: [CampanhaProduto]
    skus: [SKU]!
    parceiro: Parceiro
    imagens: [ImagemProduto]
    codigoPromocao: String!
    precoDe: Int!
    precoPor: Int!
    atgProductId: String
    code: String
    fulfillmentType: String
    configuracoes: [ConfiguracaoProduto]
    valorCalculado: ValorCalculado
  }

  type ImagemProduto {
    url: String!
    nome: String!
  }

  type Parceiro {
    id: String!
    codigoCatalogo: String
    nome: String
    cnpj: String
    partnerCode: String
    imagem: String
  }

  # Conjunto de caracteristicas do produto
  type ConfiguracaoProduto {
    id: String
    nome: String
    atributos: [Atributo]
  }

  # Atributo/caracteristica do produto
  type Atributo {
    chave: String
    valor: String
  }

  # Categoria de um produto varejo
  type Categoria {
    idCategoria: String
    nome: String
  }

  # SKU do Produto Varejo
  type SKU {
    id: ID!
    partnerCode: String!
    modelo: [Atributo]
    precoDe: Int!
    precoPor: Int!
    precoMoneyDe: Float!
    precoMoneyPor: Float!
    disponivel: Boolean!
    loyaltyCode: String
  }

  # Imagem
  type Imagem {
    url: String!
    resolucao: String
  }

  # Oferta do Aereo para um participante
  type OfertaAereo {
    id: ID!
    idExterno: String!
    numeroMultiplus: String
    canal: String!
    iataOrigem: String!
    cidadeOrigem: String!
    iataDestino: String!
    cidadeDestino: String!
    dataIniEmbarque: String!
    dataFimEmbarque: String!
    valorPontos: Int!
    numeroVoo: Int
    urlDestino: String!
    numPrioridade: Int!
    indicadorCampanhaGenerica: Boolean
    indExclusao: Boolean
    dataIniVigencia: String!
    dataFimVigencia: String
    dataCriacao: String
    usuarioCriacao: String!
    sistemaCriacao: String!
    dataAtualizacao: String
    usuarioAtualizacao: String
  }

  # Campanha de produtos do varejo
  type Campanha {
    id: ID!
    descricao: String!
    filtro: Filtro
    dataInicioVigencia: String!
    dataFimVigencia: String!
    produtosOfertados(
      first: Int,
      after: String
    ): ProdutosOfertadosConnection
  }

  # Campanhas do produto
  type CampanhaProduto {
    id: ID!
    tipoDesconto: TipoDesconto
    valorDesconto: Int
  }

  input CampanhaProdutoInput {
    id: ID!
    tipoDesconto: TipoDesconto!
    valorDesconto: Int!
  }

  type RetornoCampanhaProduto {
    sucesso: Boolean
  }
  
  # Associacao dos produtos ofertados em uma campanha
  type ProdutosOfertadosConnection {
    pageInfo: PageInfo!
    edges: [ProdutosOfertadosEdge]
    totalCount: Int
  }
  
  # Associacao de um produto ofertado em uma campanha
  type ProdutosOfertadosEdge {
    cursor: String!
    desconto: Int
    node: Produto
  }

  # Filtro de uma campanha. Define para qual participante a campanha deve ser exibida.
  type Filtro {
    tipo: TipoFiltro!
    valor: String!
  }

  # Tipos de Filtro
  enum TipoFiltro {
    # filtra por lista de cpfs
    LISTA
    # filtra por segmento corporativo
    SEGMENTO
  }

  enum TipoDesconto {
    fixo
    porcentagem
  }

  # Grupo de produtos
  type Grupo {
    id: ID!
    nome: String!
    produtos(
      first: Int,
      after: String
    ): ProdutosGrupoConnection
  }

  # Associacao de produtos em um grupo
  type ProdutosGrupoConnection {
    pageInfo: PageInfo!
    edges: [ProdutosGrupoEdge]
    totalCount: Int
  }
  
  # Associacao de um produto em um grupo
  type ProdutosGrupoEdge {
    cursor: String!
    desconto: Int
    node: Produto
  }

  # Informacoes padrao para paginacao de resultados
  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean
  }

  type ValorCalculado {
    valor: Float!
    campanha: CampanhaProduto!
  }

  ### INPUT TYPES ###

  # Campanha de produtos varejo
  input CampanhaInput{
    id: ID
    nome: String!
    filtro: FiltroInput
    produtos: [ID]!
  }

  # Filtro para campanha
  input FiltroInput {
    tipo: TipoFiltro!
    valor: String!
  }

  # Grupo de produtos varejo
  input GrupoInput{
    id: ID
    nome: String!
    produtos: [ID]!
  }
`;

const queries = `

  # Busca Ofertas do Aereo para determinado participante
  ofertasAereo(
    numeroMultiplus: String,
    # se *true* retorna somente ofertas dentro do periodo de vigencia
    somenteVigentes: Boolean,
    # paginacao
    skip: Int, 
    # paginacao
    limit: Int
  ): [OfertaAereo]!

  # Busca uma Campanha de produtos do varejo
  campanhaVarejo(
    id: ID!): Campanha! 

  # Busca Campanhas de produtos do varejo.
  campanhasVarejo(
    id: ID,
    nome: String,
    # se *true* retorna somente campanhas dentro do periodo de vigencia
    somenteVigentes: Boolean,
    # paginacao
    skip: Int, 
    # paginacao
    limit: Int): [Campanha]! 

  # Busca Campanhas de produtos do varejo validas para o perfil informado
  campanhasVarejoPerfil(
    # Nomes das listas que o perfil (participante) faz parte.
    listas: [String], 
    # Nomes dos segmentos que o perfil (participante) faz parte.
    segmentos: [String],
    # se *true* retorna somente campanhas dentro do periodo de vigencia
    somenteVigentes: Boolean,
    # paginacao
    skip: Int, 
    # paginacao
    limit: Int): [Campanha]! 

  # Busca os produtos de uma categoria. Sao retornados apenas produtos associados a uma campanha vigente.
  produtosCategoria(
    idCategoria: String!,
    # se *true* retorna somente produtos que estejam disponiveis
    somenteDisponiveis: Boolean): [Produto]!
  
  # Busca os produtos de uma categoria. Sao retornados apenas produtos associados a uma campanha vigente e compatível com o perfil informado.
  produtosCategoriaPerfil(
    idCategoria: String!,
    # Nomes das listas que o perfil (participante) faz parte.
    listas: [String], 
    # Nomes dos segmentos que o perfil (participante) faz parte.
    segmentos: [String],    
    # se *true* retorna somente produtos que estejam disponiveis
    somenteDisponiveis: Boolean): [Produto]!

  # Busca todas as categorias de produtos. São retornadas apenas categorias associadas a produtos que satisfaçam as condicoes da query *produtosCategoria*.
  categoriasProduto(
    # paginacao
    skip: Int, 
    # paginacao
    limit: Int): [Categoria]! 

  # Busca todas as categorias de produtos. São retornadas apenas categorias associadas a produtos que satisfaçam as condicoes da query *produtosCategoriaPerfil*.
  categoriasProdutoPerfil(
    # Nomes das listas que o perfil (participante) faz parte.
    listas: [String], 
    # Nomes dos segmentos que o perfil (participante) faz parte.
    segmentos: [String],
    # paginacao
    skip: Int, 
    # paginacao
    limit: Int): [Categoria]! 

  # Busca um produto
  produto(
    # ID do Produto
    id: ID!): Produto!

  # Busca os grupos de produtos
  grupos(
    # paginacao
    skip: Int, 
    # paginacao
    limit: Int): [Grupo]!

  # Busca um grupo de produtos
  grupo(
    id: ID!): Grupo!
`;

const mutations = `
  # grava uma campanha de produtos varejo. Se id for informado atualiza campanha existente, caso contrário insere nova campanha.  
  gravarCampanhaVarejo(campanha: CampanhaInput!): Campanha!
  # grava um grupo de produtos varejo. Se id for informado atualiza grupo existente, caso contrário insere novo grupo.  
  gravarGrupoProdutos(grupo: GrupoInput!): Campanha!
  # adiciona campanhas a um produto
  associarCampanhaAProdutos(produtosIds: [ID]!, campanha: CampanhaProdutoInput!): RetornoCampanhaProduto!
`;

module.exports = {
    types,
    queries,
    mutations
};