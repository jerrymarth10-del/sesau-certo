const base = require('./inject-quimica');
const { insertMotorista } = require('../lib/motorista');
const { insertServicosGerais } = require('../lib/servicos-gerais');

module.exports = async function handler(req, res) {
  const originalEnd = res.end.bind(res);
  res.end = function patchedEnd(body, ...args) {
    try {
      const type = String(res.getHeader('content-type') || '').toLowerCase();
      if (typeof body === 'string' && type.includes('text/html')) {
        body = insertMotorista(body);
        body = insertServicosGerais(body);
      }
    } catch (error) {
      console.error('Cards adicionais Projeto 1:', error && error.message ? error.message : error);
    }
    return originalEnd(body, ...args);
  };
  return base(req, res);
};
