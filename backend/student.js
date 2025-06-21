const sql = require('mssql');

const config = {
  user: 'sa', // thay bằng user thật
  password: 'Huy27022004', // thay bằng password thật
  server: 'localhost',
  database: 'testing', // Database dành riêng cho test
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

async function getStudent() {
  const pool = await poolPromise;
  if (!pool) throw new Error('Không thể kết nối database');

  try {
    const result = await pool.request().query('EXEC spXemLopHoc');
    return result.recordset;
  } catch (err) {
    console.error('❌ Lỗi truy vấn Sinhvien:', err.message);
    throw err;
  }
}

// async function addStudent(studentId, stundetFirstName, studentLastName, studentBirthday, studentAddress, studenttClassId) {
//   const pool = await poolPromise;

//   if (!pool)
//     throw new Error('Can\'t connect to database');

//   try {
//     const result = await pool
//       .request()
//       .input()
//   }
// }

async function deleteStudent(studentId) {
  const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaLop', sql.NChar, studentId)
      .execute('spXoaLopHoc');
    
    return result;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error
  }
}

async function editStudent(studentId, newStudentId, ) {
  
}

module.exports = {
  getStudent,
  deleteStudent
};
