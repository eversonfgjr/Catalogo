# Domínio de Templates

Templates determinam os componentes de UI que compoem um layout.


## Personalização

Os templates podem ser personalizados em função das segmentações de cada participante.
É possível ainda definir listas de participantes para personalização.


## Setup

Para instalar as dependências:

`npm install`

Para subir o servidor:

`npm start`

Este domínio busca pelo arquivo de configuração:

`${MULTIPLUS_HOME}/Template/Template.yml`

onde `MULTIPLUS_HOME` é uma variável de ambiente no sistema operacional.

## Testes Unitários

Para rodar os testes unitários, com relatório de cobertura:

`npm test`