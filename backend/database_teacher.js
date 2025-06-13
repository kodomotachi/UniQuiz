const sql = require('mssql');

const config = {
	user: 'sa',
	password: 'Huy27022004',
	server: 'localhost',
	database: 'testing',
	port: 1433,
	options: {
		trustServerCertificate: true,
		encrypt: false
	},
};