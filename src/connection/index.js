const { Pool } = require('pg');

const dbPool = new Pool({
    user : 'postgres',
    database : 'personalWeb',
    password : '1',
    port : 5432
})

module.exports = dbPool