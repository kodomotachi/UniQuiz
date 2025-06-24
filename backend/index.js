/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const { getStudent, addStudent, editStudent, deleteStudent } = require('./student');
const { getTeacher, addTeacher, editTeacher, deleteTeacher, loginTeacher } = require('./teacher');
const { addSubject, getSubject, editSubject, deleteSubject } = require('./subject');
const { getClass, addClass, editClass, deleteClass } = require('./class');
const { getQuestionsBySubject, addQuestion, editQuestion, deleteQuestion, countQuestions } = require('./question');
const { getExaminations, addExamination, editExamination, deleteExamination } = require('./examination');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/student/get-class', async (req, res) => {
  try {
    const { classId } = req.body;
    const sinhviens = await getStudent(classId);
    res.json(sinhviens);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách Sinhvien', message: err.message });
  }
});

app.post('/student/add-student', async (req, res) => {
  try {
    const { studentId, studentFirstName, studentLastName, studentBirthday, studentAddress, studentClassId } = req.body;

    console.log("Received student data:", req.body);

    const result = await addStudent(studentId, studentFirstName, studentLastName, studentBirthday, studentAddress, studentClassId);
  
    res.json({ success: true, message: "Student added successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when adding student", message: err.message });
  }
});

app.post('/student/edit-student', async (req, res) => {
  try {
    const { studentId, newStudentId, studentFirstName, studentLastName, studentBirthday, studentAddress } = req.body;
    const result = await editStudent(studentId, newStudentId, studentFirstName, studentLastName, studentBirthday, studentAddress);

    res.json(result);
  } catch (err) {
    res.sttus(500).json({ error: "Query got error when update student", message: err.message });
  }
});

app.post('/student/delete-student', async (req, res) => {
  try {
    const { studentId } = req.body;

    console.log("Received student data:", req.body);

    const result = await deleteStudent(studentId);

    res.json({ success: true, message: "Student deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when deleting student", message: err.message });
  }
});

app.get('/class/get-class', async (req, res) => {
  try {
    const result = await getClass();

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: 'Erorr when getting class\'s data', message: err.message
    });
  }
});

app.post('/class/add-class', async (req, res) => {
  try {
    const { id, name } = req.body;
    const result = await addClass(id, name);
    res.json({ success: true, message: "Class added successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when adding new class", message: err.message });
  }
});

app.post('/class/edit-class', async (req, res) => {
  try {
    const { classId, newClassId, className } = req.body;
    const result = await editClass(classId, newClassId, className);
    res.json({ success: true, message: "Class updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when updating class", message: err.message });
  }
});

app.post('/class/delete-class', async (req, res) => {
  try {
    const { classId } = req.body;
    const result = await deleteClass(classId);

    res.json({ success: true, message: "Class deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when deleting class", message: err.message });
  }
});

app.get('/teacher/get-list', async (req, res) => {
  try {
    const result = await getTeacher();
    res.json({ success: true, message: "Teacher deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: 'Error when getting data', message: err.message });
  }
});

app.post('/teacher/add-teacher', async (req, res) => {
  try {
    const { teacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress } = req.body;
    
    console.log("Received teacher data:", req.body);
    
    const result = await addTeacher(teacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress);
    res.json({ success: true, message: "Teacher added successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when add new teacher", message: err.message });
  }
});

app.post('/teacher/edit-teacher', async (req, res) => {
  try {
    const { teacherId, newTeacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress } = req.body;

    console.log("Received teacher data:", req.body);

    const result = await editTeacher(teacherId, newTeacherId, teacherFirstName, teacherLastName, teacherPhoneNumber, teacherAddress);
    res.json({ success: true, message: "Teacher updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when update teacher", message: err.message });
  }
});

app.post('/teacher/delete-teacher', async (req, res) => {
  try {
    const { teacherId } = req.body;

    console.log("Received teacher data:", req.body);

    const result = await deleteTeacher(teacherId);
    res.json({ success: true, message: "Teacher deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when delete teacher", message: err.message });
  }
});

app.post('/teacher/login', async (req, res) => {
	try {
		const { teacherId, password } = req.body;
		if (!teacherId || !password) {
			return res.status(400).json({ error: 'Teacher ID and password are required' });
		}
		const result = await loginTeacher(teacherId, password);
		res.json(result);
	} catch (err) {
		res.status(401).json({ error: 'Authentication failed', message: err.message });
	}
});

app.get('/subject/get-subject', async (req, res) => {
  try {
    const result = await getSubject();

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: 'Erorr when getting teacher\'s data', message: err.message
    });
  }
});

app.post('/subject/add-subject', async (req, res) => {
  try {
    const { subjectId, subjectName } = req.body;

    console.log("Received subject data:", req.body);
    
    const result = await addSubject(subjectId, subjectName);
    res.json({ success: true, message: "Subject added successfully", result });    
  } catch (err) {
    res.status(500).json({ error: "Query got error when add new subject", message: err.message });
  }
});

app.post('/subject/edit-subject', async (req, res) => {
  try {
    const { subjectId, newSubjectId, subjectName } = req.body;

    console.log("Received subject data:", req.body);

    const result = await editSubject(subjectId, newSubjectId, subjectName);
    res.json({ success: true, message: "Subject updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when update subject", message: err.message });
  }
});

app.post('/subject/delete-subject', async (req, res) => {
  try {
    const { subjectId } = req.body;

    console.log("Received subject data:", req.body);

    const result = await deleteSubject(subjectId);
    res.json({ success: true, message: "Subject deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when delete subject", message: err.message });
  }
});

app.get('/student/get-by-class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await getStudent(classId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách Sinhvien', message: err.message });
  }
});

// Question API Endpoints
app.get('/question/get-by-subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const questions = await getQuestionsBySubject(subjectId);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error when getting questions', message: err.message });
  }
});

app.get('/question/count', async (req, res) => {
    try {
        const { mamh, trinhdo } = req.query;
        if (!mamh || !trinhdo) {
            return res.status(400).json({ error: 'Subject ID and Level are required' });
        }
        const count = await countQuestions(mamh, trinhdo);
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Error counting questions', message: err.message });
    }
});

app.post('/question/add', async (req, res) => {
  try {
    const { subjectId, level, content, optionA, optionB, optionC, optionD, correctAnswer, teacherId } = req.body;
    const result = await addQuestion(subjectId, level, content, optionA, optionB, optionC, optionD, correctAnswer, teacherId);
    res.json({ success: true, message: "Question added successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Query got error when adding new question", message: err.message });
  }
});

app.post('/question/edit', async (req, res) => {
  try {
    const { questionId, subjectId, level, content, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
    // Lấy magv từ token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const magv = decoded.id;
    await editQuestion(questionId, subjectId, level, content, optionA, optionB, optionC, optionD, correctAnswer, magv);
    res.json({ success: true, message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Query got error when updating question", message: err.message });
  }
});

app.post('/question/delete', async (req, res) => {
  try {
    const { questionId } = req.body;
    // Lấy magv từ token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const magv = decoded.id;
    await deleteQuestion(questionId, magv);
    res.json({ success: true, message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Query got error when deleting question", message: err.message });
  }
});

// Examination API Endpoints
app.get('/examination/get-all', async (req, res) => {
    try {
        const examinations = await getExaminations();
        res.json(examinations);
    } catch (err) {
        res.status(500).json({ error: 'Error when getting examinations', message: err.message });
    }
});

app.post('/examination/add', async (req, res) => {
    try {
        const { magv, malop, mamh, trinhdo, ngaythi, lan, socauthi, thoigian } = req.body;
        const result = await addExamination(magv, malop, mamh, trinhdo, ngaythi, lan, socauthi, thoigian);
        res.json({ success: true, message: "Examination added successfully", result });
    } catch (err) {
        res.status(500).json({ error: "Query got error when adding new examination", message: err.message });
    }
});

app.post('/examination/edit', async (req, res) => {
    try {
        const { malop, mamh, lan, trinhdo, ngaythi, socauthi, thoigian } = req.body;
        // Lấy magv từ token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const magv = decoded.id;
        await editExamination(malop, mamh, lan, trinhdo, ngaythi, socauthi, thoigian, magv);
        res.json({ success: true, message: "Examination updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Query got error when updating examination", message: err.message });
    }
});

app.post('/examination/delete', async (req, res) => {
    try {
        const { malop, mamh, lan } = req.body;
        // Lấy magv từ token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const magv = decoded.id;
        await deleteExamination(malop, mamh, lan, magv);
        res.json({ success: true, message: "Examination deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Query got error when deleting examination", message: err.message });
    }
});

app.get('/examination/upcoming/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const config = require('./config_server');
        const dbPool = await config.pool;
        
        if (!dbPool) {
            return res.status(500).json({ error: 'Database connection failed' });
        }
        
        // Lấy MALOP của sinh viên
        const studentInfo = await dbPool.request()
            .input('MASV', config.sql.NChar(8), studentId)
            .query('SELECT MALOP FROM Sinhvien WHERE MASV = @MASV');
            
        if (studentInfo.recordset.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const malop = studentInfo.recordset[0].MALOP.trim();
        
        // Lấy các phiên thi sắp tới và đang diễn ra cho lớp của sinh viên từ bảng Giaovien_Dangky
        const examinations = await dbPool.request()
            .input('MALOP', config.sql.NChar(8), malop)
            .input('MASV', config.sql.NChar(8), studentId)
            .input('NOW', config.sql.DateTime, new Date())
            .query(`
                SELECT gd.MAMH, gd.MALOP, gd.TRINHDO, gd.NGAYTHI, gd.LAN, gd.SOCAUTHI, gd.THOIGIAN,
                       mh.TENMH as TENMON,
                       DATEADD(MINUTE, gd.THOIGIAN, gd.NGAYTHI) as NGAYKETTHUC,
                       bd.DIEM as DA_THI
                FROM Giaovien_Dangky gd 
                LEFT JOIN Monhoc mh ON gd.MAMH = mh.MAMH
                LEFT JOIN BangDiem bd ON (gd.MAMH = bd.MAMH AND gd.LAN = bd.LAN AND bd.MASV = @MASV)
                WHERE gd.MALOP = @MALOP 
                  AND DATEADD(MINUTE, gd.THOIGIAN, gd.NGAYTHI) >= @NOW 
                ORDER BY gd.NGAYTHI ASC
            `);
            
        res.json(examinations.recordset);
    } catch (err) {
        console.error('Error in /examination/upcoming/:studentId:', err);
        res.status(500).json({ error: 'Error getting upcoming examinations', message: err.message });
    }
});

app.get('/teacher/fullname/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const config = require('./config_server');
        const dbPool = await config.pool;
        const result = await dbPool.request()
            .input('MAGV', config.sql.NChar(8), id)
            .query('SELECT HO, TEN FROM Giaovien WHERE MAGV = @MAGV');
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        const { HO, TEN } = result.recordset[0];
        res.json({ fullName: `${HO?.trim() || ''} ${TEN?.trim() || ''}`.trim() });
    } catch (err) {
        res.status(500).json({ error: 'Error getting teacher full name', message: err.message });
    }
});

app.get('/student/fullname/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const config = require('./config_server');
        const dbPool = await config.pool;
        const result = await dbPool.request()
            .input('MASV', config.sql.NChar(8), id)
            .query('SELECT HO, TEN FROM Sinhvien WHERE MASV = @MASV');
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const { HO, TEN } = result.recordset[0];
        res.json({ fullName: `${HO?.trim() || ''} ${TEN?.trim() || ''}`.trim() });
    } catch (err) {
        res.status(500).json({ error: 'Error getting student full name', message: err.message });
    }
});

app.post('/student/login', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        if (!studentId || !password) {
            return res.status(400).json({ error: 'Student ID and password are required' });
        }
        const config = require('./config_server');
        const dbPool = await config.pool;
        const result = await dbPool.request()
            .input('MASV', config.sql.NChar(8), studentId)
            .query('SELECT * FROM Taikhoan_Sinhvien WHERE MASV = @MASV');
        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Tài khoản không tồn tại' });
        }
        const studentAccount = result.recordset[0];
        const isMatch = await bcrypt.compare(password, studentAccount.MATKHAU);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }
        // Lấy họ tên sinh viên
        const info = await dbPool.request()
            .input('MASV', config.sql.NChar(8), studentId)
            .query('SELECT HO, TEN FROM Sinhvien WHERE MASV = @MASV');
        let fullName = '';
        if (info.recordset.length > 0) {
            const { HO, TEN } = info.recordset[0];
            fullName = `${HO?.trim() || ''} ${TEN?.trim() || ''}`.trim();
        }
        const token = jwt.sign({ id: studentId, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, fullName });
    } catch (err) {
        res.status(500).json({ error: 'Authentication failed', message: err.message });
    }
});

// Test route để kiểm tra dữ liệu
app.get('/test/data', async (req, res) => {
    try {
        const config = require('./config_server');
        const dbPool = await config.pool;
        
        // Test kết nối và lấy dữ liệu
        const students = await dbPool.request().query('SELECT TOP 5 * FROM Sinhvien');
        const examinations = await dbPool.request().query('SELECT TOP 5 * FROM Giaovien_Dangky');
        const subjects = await dbPool.request().query('SELECT TOP 5 * FROM Monhoc');
        
        res.json({
            students: students.recordset,
            examinations: examinations.recordset,
            subjects: subjects.recordset
        });
    } catch (err) {
        console.error('Test error:', err);
        res.status(500).json({ error: 'Test failed', message: err.message });
    }
});

// API để lấy câu hỏi ngẫu nhiên cho bài thi
app.get('/exam/questions/:mamh/:trinhdo/:socau', async (req, res) => {
    try {
        const { mamh, trinhdo, socau } = req.params;
        const config = require('./config_server');
        const dbPool = await config.pool;
        
        if (!dbPool) {
            return res.status(500).json({ error: 'Database connection failed' });
        }
        
        // Lấy câu hỏi ngẫu nhiên từ bảng Bode
        const questions = await dbPool.request()
            .input('MAMH', config.sql.NChar(5), mamh)
            .input('TRINHDO', config.sql.NChar(1), trinhdo)
            .input('SOCAU', config.sql.Int, parseInt(socau))
            .query(`
                SELECT TOP (@SOCAU) CAUHOI, NOIDUNG, A, B, C, D, DAP_AN
                FROM Bode 
                WHERE MAMH = @MAMH AND TRINHDO = @TRINHDO
                ORDER BY NEWID()
            `);
            
        if (questions.recordset.length === 0) {
            return res.status(404).json({ error: 'No questions found for this exam' });
        }
        
        // Trộn thứ tự câu hỏi và loại bỏ đáp án (để gửi về frontend)
        const shuffledQuestions = questions.recordset.map((q, index) => ({
            questionNumber: index + 1,
            questionId: q.CAUHOI,
            content: q.NOIDUNG,
            options: {
                A: q.A,
                B: q.B,
                C: q.C,
                D: q.D
            }
            // Không gửi DAP_AN về frontend để bảo mật
        }));
        
        res.json(shuffledQuestions);
    } catch (err) {
        console.error('Error getting exam questions:', err);
        res.status(500).json({ error: 'Error getting exam questions', message: err.message });
    }
});

// API để nộp bài thi và tính điểm
app.post('/exam/submit', async (req, res) => {
    try {
        const { studentId, mamh, lan, answers } = req.body;
        const config = require('./config_server');
        const dbPool = await config.pool;
        
        if (!dbPool) {
            return res.status(500).json({ error: 'Database connection failed' });
        }
        
        // Kiểm tra xem sinh viên đã thi phiên thi này chưa
        const existingResult = await dbPool.request()
            .input('MASV', config.sql.NChar(8), studentId)
            .input('MAMH', config.sql.NChar(5), mamh)
            .input('LAN', config.sql.SmallInt, lan)
            .query('SELECT DIEM FROM BangDiem WHERE MASV = @MASV AND MAMH = @MAMH AND LAN = @LAN');
            
        if (existingResult.recordset.length > 0) {
            return res.status(400).json({ 
                error: 'Student has already taken this exam',
                message: 'Bạn đã hoàn thành bài thi này rồi!'
            });
        }
        
        // Lấy đáp án đúng cho các câu hỏi
        const questionIds = Object.keys(answers).map(id => parseInt(id));
        let correctAnswers = 0;
        let totalQuestions = questionIds.length;
        const correctAnswersList = {};
        
        for (const questionId of questionIds) {
            const result = await dbPool.request()
                .input('CAUHOI', config.sql.Int, questionId)
                .query('SELECT DAP_AN FROM Bode WHERE CAUHOI = @CAUHOI');
                
            if (result.recordset.length > 0) {
                const correctAnswer = result.recordset[0].DAP_AN.trim();
                correctAnswersList[questionId] = correctAnswer;
                const studentAnswer = answers[questionId];
                
                if (correctAnswer === studentAnswer) {
                    correctAnswers++;
                }
            }
        }
        
        // Tính điểm (thang điểm 10)
        const score = (correctAnswers / totalQuestions) * 10;
        
        // Lưu điểm vào bảng BangDiem
        await dbPool.request()
            .input('MASV', config.sql.NChar(8), studentId)
            .input('MAMH', config.sql.NChar(5), mamh)
            .input('LAN', config.sql.SmallInt, lan)
            .input('NGAYTHI', config.sql.Date, new Date())
            .input('DIEM', config.sql.Float, Math.round(score * 100) / 100)
            .query(`
                INSERT INTO BangDiem (MASV, MAMH, LAN, NGAYTHI, DIEM)
                VALUES (@MASV, @MAMH, @LAN, @NGAYTHI, @DIEM)
            `);
        
        res.json({
            success: true,
            score: Math.round(score * 100) / 100,
            correctAnswers,
            totalQuestions,
            correctAnswersList,
            message: 'Exam submitted successfully'
        });
    } catch (err) {
        console.error('Error submitting exam:', err);
        res.status(500).json({ error: 'Error submitting exam', message: err.message });
    }
});

// API để lấy bảng điểm của một phiên thi cho giáo viên
app.get('/examination/results/:malop/:mamh/:lan', async (req, res) => {
    try {
        const { malop, mamh, lan } = req.params;
        const config = require('./config_server');
        const dbPool = await config.pool;
        
        if (!dbPool) {
            return res.status(500).json({ error: 'Database connection failed' });
        }
        
        // Kiểm tra quyền truy cập của giáo viên
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const magv = decoded.id;
            
            // Kiểm tra giáo viên có quyền xem phiên thi này không
            const examCheck = await dbPool.request()
                .input('MALOP', config.sql.NChar(8), malop)
                .input('MAMH', config.sql.NChar(5), mamh)
                .input('LAN', config.sql.SmallInt, parseInt(lan))
                .input('MAGV', config.sql.NChar(8), magv)
                .query('SELECT * FROM Giaovien_Dangky WHERE MALOP = @MALOP AND MAMH = @MAMH AND LAN = @LAN AND MAGV = @MAGV');
                
            if (examCheck.recordset.length === 0) {
                return res.status(403).json({ error: 'Access denied. You can only view your own examinations.' });
            }
        }
        
        // Lấy thông tin phiên thi
        const examInfo = await dbPool.request()
            .input('MALOP', config.sql.NChar(8), malop)
            .input('MAMH', config.sql.NChar(5), mamh)
            .input('LAN', config.sql.SmallInt, parseInt(lan))
            .query(`
                SELECT gd.*, mh.TENMH, l.TENLOP
                FROM Giaovien_Dangky gd
                LEFT JOIN Monhoc mh ON gd.MAMH = mh.MAMH
                LEFT JOIN Lop l ON gd.MALOP = l.MALOP
                WHERE gd.MALOP = @MALOP AND gd.MAMH = @MAMH AND gd.LAN = @LAN
            `);
            
        if (examInfo.recordset.length === 0) {
            return res.status(404).json({ error: 'Examination not found' });
        }
        
        // Lấy danh sách sinh viên và điểm số
        const results = await dbPool.request()
            .input('MALOP', config.sql.NChar(8), malop)
            .input('MAMH', config.sql.NChar(5), mamh)
            .input('LAN', config.sql.SmallInt, parseInt(lan))
            .query(`
                SELECT sv.MASV, sv.HO, sv.TEN, bd.DIEM, bd.NGAYTHI
                FROM Sinhvien sv
                LEFT JOIN BangDiem bd ON (sv.MASV = bd.MASV AND bd.MAMH = @MAMH AND bd.LAN = @LAN)
                WHERE sv.MALOP = @MALOP
                ORDER BY sv.MASV
            `);
        
        res.json({
            examInfo: examInfo.recordset[0],
            results: results.recordset
        });
    } catch (err) {
        console.error('Error getting examination results:', err);
        res.status(500).json({ error: 'Error getting examination results', message: err.message });
    }
});

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi chạy test:', err.message);
  }
})();
