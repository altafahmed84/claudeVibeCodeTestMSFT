const sql = require('mssql');

const config = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports = {
    getConnection
};