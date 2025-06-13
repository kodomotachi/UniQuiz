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

async function addSubject(subjectId, subjectName) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    // Log the input values for debugging
    console.log('Adding subject with ID:', subjectId);
    
    const result = await pool
      .request()
      .input('MaMHMoi', sql.NChar, subjectId)
      .input('TenMHMoi', sql.NChar, subjectName)
      .execute('spThemMonHoc');

    return result; // có thể trả về result.recordset nếu cần kết quả cụ thể
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error;
  }  
}

async function getSubject() {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .query('EXEC spXemMonHoc');
    
    return result.recordset;
  } catch (error) {
    console.error('Error getting subject list:', error);
    throw error;
  }
}

async function editSubject(subjectId, newSubjectId, subjectName) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaMonCu', sql.NChar, subjectId)
      .input('MaMonMoi', sql.NChar, newSubjectId)
      .input('TenMonMoi', sql.NVarChar, subjectName)
      .execute('spChinhsuaMonHoc');
    
    return result;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
}

async function deleteSubject(subjectId) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaMH', sql.NChar, subjectId)
      .execute('spXoaMonHoc');
    
    return result;
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
}

module.exports = {
	addSubject,
  getSubject,
  editSubject,
  deleteSubject
};