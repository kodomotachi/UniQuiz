/* eslint-disable no-undef */
const { pool, sql } = require('./config_server');
const { countQuestions } = require('./question');

async function getExaminations() {
    const dbPool = await pool;
    if (!dbPool) throw new Error("Can't connect to database");

    try {
        const result = await dbPool.request().execute('sp_GetExaminations');
        return result.recordset;
    } catch (err) {
        console.error('Query got error: ', err.message);
        throw err;
    }
}

async function addExamination(magv, malop, mamh, trinhdo, ngaythi, lan, socauthi, thoigian) {
    const dbPool = await pool;
    if (!dbPool) throw new Error("Can't connect to database");

    if (new Date(ngaythi) < new Date()) {
        throw new Error('Không thể tạo phiên thi với thời gian trong quá khứ!');
    }

    const availableQuestions = await countQuestions(mamh, trinhdo);

    if (availableQuestions < socauthi) {
        throw new Error(`Not enough questions. Available: ${availableQuestions}, Required: ${socauthi}`);
    }

    try {
        const result = await dbPool
            .request()
            .input('MAGV', sql.NChar(8), magv)
            .input('MALOP', sql.NChar(8), malop)
            .input('MAMH', sql.NChar(5), mamh)
            .input('TRINHDO', sql.NChar(1), trinhdo)
            .input('NGAYTHI', sql.DateTime, ngaythi)
            .input('LAN', sql.SmallInt, lan)
            .input('SOCAUTHI', sql.SmallInt, socauthi)
            .input('THOIGIAN', sql.SmallInt, thoigian)
            .execute('sp_AddExamination');
        return result;
    } catch (error) {
        console.error('Error adding examination:', error);
        throw error;
    }
}

async function editExamination(malop, mamh, lan, newTrinhdo, newNgaythi, newSocauthi, newThoigian, magv) {
    const dbPool = await pool;
    if (!dbPool) throw new Error("Can't connect to database");

    const exam = await dbPool.request()
        .input('MALOP', sql.NChar(8), malop)
        .input('MAMH', sql.NChar(5), mamh)
        .input('LAN', sql.SmallInt, lan)
        .query('SELECT MAGV FROM Giaovien_Dangky WHERE MALOP=@MALOP AND MAMH=@MAMH AND LAN=@LAN');
    if (!exam.recordset.length || exam.recordset[0].MAGV.trim() !== magv.trim()) {
        throw new Error('Bạn không có quyền chỉnh sửa phiên thi này!');
    }

    const availableQuestions = await countQuestions(mamh, newTrinhdo);
    if (availableQuestions < newSocauthi) {
        throw new Error(`Not enough questions. Available: ${availableQuestions}, Required: ${newSocauthi}`);
    }

    try {
        const result = await dbPool
            .request()
            .input('MALOP', sql.NChar(8), malop)
            .input('MAMH', sql.NChar(5), mamh)
            .input('LAN', sql.SmallInt, lan)
            .input('TRINHDO', sql.NChar(1), newTrinhdo)
            .input('NGAYTHI', sql.DateTime, newNgaythi)
            .input('SOCAUTHI', sql.SmallInt, newSocauthi)
            .input('THOIGIAN', sql.SmallInt, newThoigian)
            .execute('sp_EditExamination');
        return result;
    } catch (error) {
        console.error('Error updating examination:', error);
        throw error;
    }
}

async function deleteExamination(malop, mamh, lan, magv) {
    const dbPool = await pool;
    if (!dbPool) throw new Error("Can't connect to database");

    const exam = await dbPool.request()
        .input('MALOP', sql.NChar(8), malop)
        .input('MAMH', sql.NChar(5), mamh)
        .input('LAN', sql.SmallInt, lan)
        .query('SELECT MAGV FROM Giaovien_Dangky WHERE MALOP=@MALOP AND MAMH=@MAMH AND LAN=@LAN');
    if (!exam.recordset.length || exam.recordset[0].MAGV.trim() !== magv.trim()) {
        throw new Error('Bạn không có quyền xóa phiên thi này!');
    }

    try {
        const result = await dbPool
            .request()
            .input('MALOP', sql.NChar(8), malop)
            .input('MAMH', sql.NChar(5), mamh)
            .input('LAN', sql.SmallInt, lan)
            .execute('sp_DeleteExamination');
        return result;
    } catch (error) {
        console.error('Error deleting examination:', error);
        throw error;
    }
}

module.exports = {
    getExaminations,
    addExamination,
    editExamination,
    deleteExamination,
}; 