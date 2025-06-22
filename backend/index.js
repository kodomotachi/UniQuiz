/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const { getStudent, addStudent, editStudent, deleteStudent } = require('./student');
const { getTeacher, addTeacher, editTeacher, deleteTeacher } = require('./teacher');
const { addSubject, getSubject, editSubject, deleteSubject } = require('./subject');
const { getClass, addClass, editClass, deleteClass } = require('./class');
const { getQuestionsBySubject, addQuestion, editQuestion, deleteQuestion } = require('./question');

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
    await editQuestion(questionId, subjectId, level, content, optionA, optionB, optionC, optionD, correctAnswer);
    res.json({ success: true, message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Query got error when updating question", message: err.message });
  }
});

app.post('/question/delete', async (req, res) => {
  try {
    const { questionId } = req.body;
    await deleteQuestion(questionId);
    res.json({ success: true, message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Query got error when deleting question", message: err.message });
  }
});

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi chạy test:', err.message);
  }
})();
