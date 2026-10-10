// Elenco ordinato dei moduli JavaScript del simulatore (condividono lo stesso scope).
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'src');

const moduli = () => fs.readdirSync(SRC).filter(f => /^\d\d-.*\.js$/.test(f)).sort();
module.exports = { moduli, SRC };
