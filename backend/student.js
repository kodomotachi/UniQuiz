/* eslint-disable no-undef */
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

async function getStudent(classId) {
  const pool = await poolPromise;
  if (!pool) throw new Error('Không thể kết nối database');

  try {
    const request = pool.request();
    let query = `
      SELECT 
        MASV AS id, 
        HO AS firstName, 
        TEN AS lastName, 
        NGAYSINH AS birthday, 
        DIACHI AS address 
      FROM Sinhvien 
      WHERE MALOP = @classId
    `;
    request.input('classId', sql.NChar, classId);
    
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('❌ Lỗi truy vấn Sinhvien:', err.message);
    throw err;
  }
}

async function addStudent(studentId, studentFirstName, studentLastName, studentBirthday, studentAddress, studentClassId) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaSinhVien', sql.NChar, studentId)
      .input('Ho', sql.NVarChar, studentFirstName)
      .input('Ten', sql.NVarChar, studentLastName)
      .input('NgaySinh', sql.Date, studentBirthday)
      .input('DiaChi', sql.NVarChar, studentAddress)
      .input('MaLop', sql.NChar, studentClassId)
      .execute('spThemSinhVien');
    
    return result;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
}

async function deleteStudent(studentId) {
  const pool = await poolPromise;

	if (!pool)
		throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaSinhVien', sql.NChar, studentId)
      .execute('spXoaSinhVien');
    
    return result;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error
  }
}

async function editStudent(studentId, newStudentId, studentFirstName, studentLastName, studentBirthday, studentAddress) {
  const pool = await poolPromise;
  
  if (!pool)
    throw new Error('Can\'t connect to database');
  
  try {
    const result = await pool
      .request()
      .input('MaSinhVienCu', sql.NChar, studentId)
      .input('MaSinhVienMoi', sql.NChar, newStudentId)
      .input('HoMoi', sql.NVarChar, studentFirstName)
      .input('TenMoi', sql.NVarChar, studentLastName)
      .input('NgaySinhMoi', sql.Date, studentBirthday)
      .input('DiaChiMoi', sql.NVarChar, studentAddress)
      .execute('spChinhsuaSinhVien');
    
    return result;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
}

module.exports = {
  getStudent,
  editStudent,
  addStudent,
  deleteStudent
};
