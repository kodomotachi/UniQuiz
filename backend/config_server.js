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

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
	console.log('✅ Kết nối SQL Server thành công');
	return pool;
  })
  .catch(err => {
	console.error('❌ Lỗi kết nối SQL Server:', err.message);
	return null;
  });

module.exports = {
	pool: poolPromise,
	sql: sql
};

