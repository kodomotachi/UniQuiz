const express = require('express');
const cors = require('cors');
const { getStudent, addStudent } = require('./student');
const { getTeacher, addTeacher, editTeacher, deleteTeacher } = require('./teacher');
const { addSubject, getSubject, editSubject, deleteSubject } = require('./subject');

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/student/get-class', async (req, res) => {
  try {
    const sinhviens = await getStudent();
    res.json(sinhviens);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách Sinhvien', message: err.message });
  }
});

app.post('/student/add-class', async (req, res) => {
  try {
    const { classId, className } = req.body;
    const result = await addStudent(classId, className);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Query got error when add new class", message: err.message });
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


(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi chạy test:', err.message);
  }
})();
