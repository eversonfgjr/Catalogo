const path = require('path');
const YAML = require('yamljs');
const dominio = 'Catalogo';

///// arquivo de configuração
const configFilePath = process.env.MULTIPLUS_HOME && path.join(process.env.MULTIPLUS_HOME, dominio, `${dominio}.yml`);

const load = () => YAML.load(configFilePath);

module.exports = {
    load
};