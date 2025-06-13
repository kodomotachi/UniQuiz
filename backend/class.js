const sql = require('mssql');

const config = {
  user: 'sa', 
  password: 'Huy27022004', 
  server: 'localhost',
  database: 'testing', 
  port: 1433,
  options: {
	trustServerCertificate: true,
	encrypt: false, // để true nếu bạn dùng Azure hoặc SSL
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

async function getClass() {
	const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

	try {
		const result = await pool
			.request()
			.execute('spThemLopHoc');
		
		return result;
	} catch (error) {
		console.error('Error getting class list:', error);
		throw error;
	}
}

async function addClass(classId, className) {
	const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

	try {
		const result = await pool
			.request()
			.input('MaLop', sql.NChar, classId)
			.input('TenLop', sql.NVarChar, className)
			.execute('spThemLopHoc');
	} catch (error) {
		console.error('Error adding class:', error);
		throw error;
	}
}

async function editClass(classId, newClassId, className) {
	const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

	try {
		const result = await pool
			.request()
			.input('MaLopCu', sql.NChar, classId)
			.input('MaLopMoi', sql.NChar, newClassId)
			.input('TenLopMoi', sql.NVarChar, className)
			.execute('spChinhsuaLopHoc');
		
		return result
	} catch (error) {
		console.error('Error updating class:', error);
		throw error;
	}
}

async function deleteClass(classId) {
	const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

	try {
		const result = await pool
			.request()
			.input('MaLop', sql.NChar, classId)
			.execute('spXoaLopHoc');
		
		return result;
	} catch (error) {
		console.log('Error deleting class:', error);
		throw error;
	}
}

module.exports = {
	getClass,
	addClass,
	editClass,
	deleteClass
};