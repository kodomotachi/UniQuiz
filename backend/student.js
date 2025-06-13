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

async function addStudent(classId, className) {
  const pool = await poolPromise;

  if (!pool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await pool
      .request()
      .input('MaLop', sql.VarChar, classId)
      .input('TenLop', sql.NVarChar, className)
      .query('EXEC spThemLopHoc @MaLop = @MaLop, @TenLop = @TenLop');

    return result.recordset;
  } catch (err) {
    console.error('Query got error: ', err.message);
    throw err;
  }
}

module.exports = {
  getStudent,
  addStudent
};
