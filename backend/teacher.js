/* eslint-disable no-undef */
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

async function getTeacher() {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .query('SELECT * FROM Giaovien');

    return result.recordset;
  } catch (err) {
    console.error('Query got error: ', err.message);
    throw err;
  }
}

async function addTeacher(teacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    // Log the input values for debugging
    console.log('Adding teacher with ID:', teacherId);
    
    const result = await pool
      .request()
      .input('MaGVMoi', sql.NChar, teacherId)
      .input('HoMoi', sql.NVarChar, teacherFirstName)
      .input('TenMoi', sql.NVarChar, teacherLastName)
      .input('SoDTLLMoi', sql.NChar, teacherPhoneNumber)
      .input('DiaChiMoi', sql.NVarChar, teacherAddress)
      .execute('spThemGiaoVien');

    return result; // có thể trả về result.recordset nếu cần kết quả cụ thể
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
}

async function editTeacher(teacherId, newTeacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress) {
	const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

	try {
		const result = await pool
			.request()
			.input('MaGVCu', sql.NChar, teacherId)
			.input('MaGVMoi', sql.NChar, newTeacherId)
			.input('HoMoi', sql.NVarChar, teacherFirstName)
			.input('TenMoi', sql.NVarChar, teacherLastName)
			.input('SoDTLLMoi', sql.NChar, teacherPhoneNumber)
			.input('DiaChiMoi', sql.NVarChar, teacherAddress)
			.execute('spChinhsuaGiaoVien');
		
		return result;
	} catch (error) {
		console.error('Error updating teacher:', error);
		throw error;
	}
}

async function deleteTeacher(teacherId) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaGV', sql.NChar, teacherId)
      .execute('spXoaGiaoVien');
  
    return result;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
}

module.exports = {
	getTeacher,
	addTeacher,
  editTeacher, 
  deleteTeacher
};