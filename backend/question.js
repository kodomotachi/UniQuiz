/* eslint-disable no-undef */
const { pool, sql } = require('./config_server');

const getQuestionsBySubject = async (subjectId) => {
    try {
        const poolConnection = await pool;
        const result = await poolConnection.request()
            .input('MAMH', sql.NChar(5), subjectId)
            .execute('sp_GetQuestionsBySubject');
        return result.recordset;
    } catch (err) {
        console.error('Error in getQuestionsBySubject:', err);
        throw err;
    }
};

const addQuestion = async (
    subjectId,
    level,
    content,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    teacherId
) => {
    try {
        const poolConnection = await pool;
        const result = await poolConnection.request()
            .input('MAMH', sql.NChar(5), subjectId)
            .input('TRINHDO', sql.NChar(1), level)
            .input('NOIDUNG', sql.NVarChar(200), content)
            .input('A', sql.NVarChar(50), optionA)
            .input('B', sql.NVarChar(50), optionB)
            .input('C', sql.NVarChar(50), optionC)
            .input('D', sql.NVarChar(50), optionD)
            .input('DAP_AN', sql.NChar(1), correctAnswer)
            .input('MAGV', sql.NChar(8), teacherId)
            .execute('sp_AddQuestion');
        return result.recordset[0];
    } catch (err) {
        console.error('Error in addQuestion:', err);
        throw err;
    }
};

const editQuestion = async (
    questionId,
    subjectId,
    level,
    content,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer
) => {
    try {
        const poolConnection = await pool;
        await poolConnection.request()
            .input('CAUHOI', sql.Int, questionId)
            .input('MAMH', sql.NChar(5), subjectId)
            .input('TRINHDO', sql.NChar(1), level)
            .input('NOIDUNG', sql.NVarChar(200), content)
            .input('A', sql.NVarChar(50), optionA)
            .input('B', sql.NVarChar(50), optionB)
            .input('C', sql.NVarChar(50), optionC)
            .input('D', sql.NVarChar(50), optionD)
            .input('DAP_AN', sql.NChar(1), correctAnswer)
            .execute('sp_EditQuestion');
    } catch (err) {
        console.error('Error in editQuestion:', err);
        throw err;
    }
};

const deleteQuestion = async (questionId) => {
    try {
        const poolConnection = await pool;
        await poolConnection.request()
            .input('CAUHOI', sql.Int, questionId)
            .execute('sp_DeleteQuestion');
    } catch (err) {
        console.error('Error in deleteQuestion:', err);
        throw err;
    }
};

module.exports = {
    getQuestionsBySubject,
    addQuestion,
    editQuestion,
    deleteQuestion
}; 