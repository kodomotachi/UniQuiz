/* eslint-disable no-undef */
const { pool, sql } = require('./config_server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // You should use an environment variable for this

async function loginTeacher(teacherId, password) {
	const dbPool = await pool;

	if (!dbPool) {
		throw new Error("Can't connect to database");
	}

	try {
		const result = await dbPool
			.request()
			.input('MAGV', sql.NVarChar(20), teacherId)
			.query('SELECT * FROM Taikhoan_Giaovien WHERE MAGV = @MAGV');

		if (result.recordset.length === 0) {
			throw new Error('Tài khoản không tồn tại');
		}

		const teacherAccount = result.recordset[0];

		const isMatch = await bcrypt.compare(password, teacherAccount.MATKHAU);

		if (!isMatch) {
			throw new Error('Mật khẩu không đúng');
		}

		const token = jwt.sign({ id: teacherAccount.MAGV, role: 'teacher' }, JWT_SECRET, {
			expiresIn: '1h',
		});

		// Lấy họ tên từ bảng Giaovien nếu không phải admin
		let fullName = null;
		if (teacherAccount.MAGV !== 'admin') {
			const nameResult = await dbPool
				.request()
				.input('MAGV', sql.NChar(8), teacherAccount.MAGV)
				.query('SELECT HO, TEN FROM Giaovien WHERE MAGV = @MAGV');
			if (nameResult.recordset.length > 0) {
				const { HO, TEN } = nameResult.recordset[0];
				fullName = `${HO?.trim() || ''} ${TEN?.trim() || ''}`.trim();
			}
		}

		return { token, fullName };

	} catch (error) {
		console.error('Error during teacher login: ', error.message);
		throw error;
	}
}

async function getTeacher() {
  const dbPool = await pool;

  if (!dbPool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await dbPool
      .request()
      .query('SELECT * FROM Giaovien');

    return result.recordset;
  } catch (err) {
    console.error('Query got error: ', err.message);
    throw err;
  }
}

async function addTeacher(teacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress) {
  const dbPool = await pool;

  if (!dbPool)
    throw new Error('Can\'t connect to database');

  try {
    // Log the input values for debugging
    console.log('Adding teacher with ID:', teacherId);
    
    const result = await dbPool
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
	const dbPool = await pool;

	if (!dbPool)
		throw new Error('Can\'t connect to database');

	try {
		const result = await dbPool
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
  const dbPool = await pool;

  if (!dbPool)
    throw new Error('Can\'t connect to database');

  try {
    const result = await dbPool
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
	loginTeacher,
	getTeacher,
	addTeacher,
  editTeacher, 
  deleteTeacher
};