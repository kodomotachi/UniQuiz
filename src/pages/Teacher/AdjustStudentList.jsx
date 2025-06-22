import React, { useState, useEffect } from 'react';

// Sample data structure for classes and their students
// const initialData = {
//     classes: [
//         {
//             id: 'E22CQCN01-N',
//             name: 'Lớp Công nghệ 1',
//             students: [
//                 {
//                     id: 'N22DCAT026',
//                     firstName: 'Tran',
//                     lastName: 'Quoc Huy',
//                     birthday: '31/2/2004',
//                     address: 'Kon Tum',
//                 },
//                 {
//                     id: 'N22DCAT027',
//                     firstName: 'Nguyen',
//                     lastName: 'Van A',
//                     birthday: '15/3/2004',
//                     address: 'Ha Noi',
//                 }
//             ]
//         },
//         {
//             id: 'E22CQCN02-N',
//             name: 'Lớp Công nghệ 2',
//             students: [
//                 {
//                     id: 'N22DCAT028',
//                     firstName: 'Le',
//                     lastName: 'Van B',
//                     birthday: '20/4/2004',
//                     address: 'Ho Chi Minh',
//                 },
//                 {
//                     id: 'N22DCAT029',
//                     firstName: 'Pham',
//                     lastName: 'Thi C',
//                     birthday: '10/5/2004',
//                     address: 'Da Nang',
//                 }
//             ]
//         }
//     ]
// };

export default function AdjustStudentList() {
    const [selectedClass, setSelectedClass] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [deletingClass, setDeletingClass] = useState(null);
    const [duplicateIdError, setDuplicateIdError] = useState(false);
    const [originalEditingClassId, setOriginalEditingClassId] = useState('');
    const [newClass, setNewClass] = useState({
        id: '',
        name: '',
        students: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classData, setClassData] = useState({ classes: [] });
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState(null);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        id: '',
        firstName: '',
        lastName: '',
        birthday: '',
        address: ''
    });
    const [addStudentError, setAddStudentError] = useState(null);

    const [showEditStudentForm, setShowEditStudentForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [originalEditingStudentId, setOriginalEditingStudentId] = useState('');
    const [editStudentError, setEditStudentError] = useState(null);

    const [showDeleteStudentConfirm, setShowDeleteStudentConfirm] = useState(false);
    const [deletingStudent, setDeletingStudent] = useState(null);

    // Load data from localStorage on component mount
    // const [classData, setClassData] = useState(() => {
    //     const savedData = localStorage.getItem('classData');
    //     return savedData ? JSON.parse(savedData) : initialData;
    // });
    // Save data to localStorage whenever classData changes
    // useEffect(() => {
    //     localStorage.setItem('classData', JSON.stringify(classData));
    // }, [classData]);

    const fetchClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/class/get-class');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const formattedData = data.map(cls => ({
                id: cls.id.trim(),
                name: cls.name.trim(),
                students: [] 
            }));
            setClassData({ classes: formattedData });
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError('Failed to load classes. Please make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchStudents = async (classId) => {
        if (!classId) return;

        setStudentsLoading(true);
        setStudentsError(null);

        try {
            const response = await fetch(`http://localhost:3000/student/get-by-class/${classId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students for this class.');
            }
            const students = await response.json();

            const formattedStudents = students.map(student => ({
                ...student,
                id: student.id.trim(),
                firstName: student.firstName.trim(),
                lastName: student.lastName.trim(),
                address: student.address.trim(),
                birthday: new Date(student.birthday).toLocaleDateString('vi-VN')
            }));

            setClassData(currentData => {
                const updatedClasses = currentData.classes.map(c => {
                    if (c.id === classId) {
                        return { ...c, students: formattedStudents };
                    }
                    return c;
                });
                return { ...currentData, classes: updatedClasses };
            });

        } catch (error) {
            console.error('Error fetching students:', error);
            setStudentsError(error.message);
        } finally {
            setStudentsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    const currentStudentList = classData.classes.find(c => c.id === selectedClass)?.students || [];

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                if (showAddForm) {
                    setShowAddForm(false);
                    setNewClass({ id: '', name: '', students: [] });
                }
                if (showEditForm) {
                    setShowEditForm(false);
                    setEditingClass(null);
                }
                if (showDeleteConfirm) {
                    setShowDeleteConfirm(false);
                    setDeletingClass(null);
                }
                if (showAddStudentForm) {
                    setShowAddStudentForm(false);
                    setNewStudent({ id: '', firstName: '', lastName: '', birthday: '', address: '' });
                    setAddStudentError(null);
                }
                if (showEditStudentForm) {
                    setShowEditStudentForm(false);
                    setEditingStudent(null);
                    setEditStudentError(null);
                }
                if (showDeleteStudentConfirm) {
                    setShowDeleteStudentConfirm(false);
                    setDeletingStudent(null);
                }
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showAddForm, showEditForm, showDeleteConfirm, showAddStudentForm, showEditStudentForm, showDeleteStudentConfirm]);

    const handleAddClass = async () => {
        if (newClass.id && newClass.name) {
            const isDuplicate = classData.classes.some(c => c.id === newClass.id);
            if (isDuplicate) {
                setDuplicateIdError(true);
                return;
            }
    
            try {
                const response = await fetch('http://localhost:3000/class/add-class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: newClass.id, name: newClass.name }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to add class');
                }
    
                await response.json();
                await fetchClasses();
    
                setShowAddForm(false);
                setNewClass({ id: '', name: '', students: [] });
                setDuplicateIdError(false);
    
            } catch (error) {
                console.error('Error adding class:', error);
                setError('Failed to add class. Please try again.');
            }
        }
    };

    const handleAddStudent = async () => {
        if (!newStudent.id || !newStudent.firstName || !newStudent.lastName || !newStudent.birthday || !newStudent.address) {
            setAddStudentError("Please fill in all fields.");
            return;
        }

        const isDuplicateStudentId = currentStudentList.some(s => s.id === newStudent.id);
        if (isDuplicateStudentId) {
            setAddStudentError("A student with this ID already exists in this class.");
            return;
        }

        setAddStudentError(null);

        try {
            const response = await fetch('http://localhost:3000/student/add-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: newStudent.id,
                    studentFirstName: newStudent.firstName,
                    studentLastName: newStudent.lastName,
                    studentBirthday: newStudent.birthday,
                    studentAddress: newStudent.address,
                    studentClassId: selectedClass
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add student');
            }

            await response.json();
            await fetchStudents(selectedClass);

            setShowAddStudentForm(false);
            setNewStudent({ id: '', firstName: '', lastName: '', birthday: '', address: '' });

        } catch (error) {
            console.error('Error adding student:', error);
            setAddStudentError(error.message);
        }
    };

    const handleEditClass = (classItem) => {
        setEditingClass({ ...classItem });
        setOriginalEditingClassId(classItem.id);
        setShowEditForm(true);
        setDuplicateIdError(false);
    };

    const handleSaveEdit = async () => {
        if (editingClass && editingClass.id && editingClass.name) {
            // Only check for duplicate if ID is changed
            if (editingClass.id !== originalEditingClassId) {
                const isDuplicate = classData.classes.some(c => c.id === editingClass.id);
                if (isDuplicate) {
                    setDuplicateIdError(true);
                    return;
                }
            }
            
            try {
                const response = await fetch('http://localhost:3000/class/edit-class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        classId: originalEditingClassId,
                        newClassId: editingClass.id,
                        className: editingClass.name
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to update class');
                }
    
                await response.json();
                await fetchClasses(); // Refresh list
    
                setShowEditForm(false);
                setEditingClass(null);
                setOriginalEditingClassId('');
                setDuplicateIdError(false);
            } catch (error) {
                console.error('Error updating class:', error);
                setError('Failed to update class. Please try again.');
            }
        }
    };

    const handleDeleteClass = (classItem) => {
        setDeletingClass(classItem);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (deletingClass) {
            try {
                const response = await fetch('http://localhost:3000/class/delete-class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ classId: deletingClass.id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete class');
                }

                await response.json();
                await fetchClasses(); // Refresh list

                setShowDeleteConfirm(false);
                setDeletingClass(null);
                if (selectedClass === deletingClass.id) {
                    setSelectedClass('');
                }
            } catch (error) {
                console.error('Error deleting class:', error);
                setError('Failed to delete class. Please try again.');
            }
        }
    };

    const handleEditStudent = (student) => {
        // student.birthday is likely in 'dd/mm/yyyy' format from the table
        const parts = student.birthday.split('/');
        // The HTML date input needs 'yyyy-mm-dd'
        const formattedBirthday = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        
        setEditingStudent({ ...student, birthday: formattedBirthday });
        setOriginalEditingStudentId(student.id);
        setShowEditStudentForm(true);
        setEditStudentError(null);
    };

    const handleSaveEditStudent = async () => {
        if (!editingStudent.id || !editingStudent.firstName || !editingStudent.lastName || !editingStudent.birthday || !editingStudent.address) {
            setEditStudentError("Please fill in all fields.");
            return;
        }
    
        if (editingStudent.id !== originalEditingStudentId) {
            const isDuplicateStudentId = currentStudentList.some(s => s.id === editingStudent.id && s.id !== originalEditingStudentId);
            if (isDuplicateStudentId) {
                setEditStudentError("A student with this ID already exists in this class.");
                return;
            }
        }
    
        setEditStudentError(null);
    
        try {
            const response = await fetch('http://localhost:3000/student/edit-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: originalEditingStudentId,
                    newStudentId: editingStudent.id,
                    studentFirstName: editingStudent.firstName,
                    studentLastName: editingStudent.lastName,
                    studentBirthday: editingStudent.birthday, // This will be yyyy-mm-dd from the input
                    studentAddress: editingStudent.address,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to edit student');
            }
    
            await response.json();
            await fetchStudents(selectedClass);
    
            setShowEditStudentForm(false);
            setEditingStudent(null);
            setOriginalEditingStudentId('');
    
        } catch (error) {
            console.error('Error editing student:', error);
            setEditStudentError(error.message);
        }
    };

    const handleDeleteStudent = (student) => {
        setDeletingStudent(student);
        setShowDeleteStudentConfirm(true);
    };

    const confirmDeleteStudent = async () => {
        if (deletingStudent) {
            try {
                const response = await fetch('http://localhost:3000/student/delete-student', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ studentId: deletingStudent.id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete student');
                }

                await response.json();
                await fetchStudents(selectedClass); // Refresh list

                setShowDeleteStudentConfirm(false);
                setDeletingStudent(null);
            } catch (error) {
                console.error('Error deleting student:', error);
                // Optionally handle the error in the UI
                setShowDeleteStudentConfirm(false);
                setDeletingStudent(null);
            }
        }
    };

    return (
        <>
            <div className="flex items-start mt-16 mx-10 space-x-10">
                {/* Class List Panel */}
                <div id="class-list-container" className="w-1/3 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4 border-b border-gray-200">
                        <button
                            onClick={() => { setShowAddForm(true); setDuplicateIdError(false); }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm transition duration-300"
                        >
                            Add Class
                        </button>
                    </div>
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class ID</label>
                                    <input
                                        type="text"
                                        value={newClass.id}
                                        onChange={(e) => {
                                            setNewClass({...newClass, id: e.target.value});
                                            setDuplicateIdError(false);
                                        }}
                                        className={`w-full px-3 py-2 border ${duplicateIdError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {duplicateIdError && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Your Class ID is used for another class, please type another Class ID
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                    <input
                                        type="text"
                                        value={newClass.name}
                                        onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewClass({ id: '', name: '', students: [] });
                                            setDuplicateIdError(false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddClass}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition duration-300"
                                    >
                                        Save
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Press ESC to close this form</p>
                            </div>
                        </div>
                    )}
                    {showEditForm && editingClass && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-xl font-semibold mb-4">Edit Class</h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class ID</label>
                                    <input
                                        type="text"
                                        value={editingClass.id}
                                        onChange={(e) => {
                                            setEditingClass({...editingClass, id: e.target.value});
                                            setDuplicateIdError(false);
                                        }}
                                        className={`w-full px-3 py-2 border ${duplicateIdError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {duplicateIdError && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Your Class ID is used for another class, please type another Class ID
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                    <input
                                        type="text"
                                        value={editingClass.name}
                                        onChange={(e) => setEditingClass({...editingClass, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowEditForm(false);
                                            setEditingClass(null);
                                            setOriginalEditingClassId('');
                                            setDuplicateIdError(false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition duration-300"
                                    >
                                        Save
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Press ESC to close this form</p>
                            </div>
                        </div>
                    )}
                    {showDeleteConfirm && deletingClass && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                                <p className="mb-4 text-gray-600">Are you sure you want to delete class "{deletingClass.name}"? This action cannot be undone.</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeletingClass(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Press ESC to close this dialog</p>
                            </div>
                        </div>
                    )}
                    <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Class ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Class Name
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-red-500">{error}</td>
                                    </tr>
                                ) : classData.classes.length > 0 ? (
                                    classData.classes.map((classItem) => (
                                        <tr
                                            key={classItem.id}
                                            onClick={() => setSelectedClass(classItem.id)}
                                            className={`cursor-pointer transition-colors duration-200 ${selectedClass === classItem.id ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                {classItem.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {classItem.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClass(classItem);
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClass(classItem);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">No classes found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Student List Panel */}
                <div className="w-2/3 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-700">
                            {selectedClass ? `Students in ${selectedClass}` : 'Select a class to view students'}
                        </h3>
                        {selectedClass && (
                            <button
                                onClick={() => {
                                    setShowAddStudentForm(true);
                                    setNewStudent({ id: '', firstName: '', lastName: '', birthday: '', address: '' });
                                    setAddStudentError(null);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm transition duration-300"
                            >
                                Add Student
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {studentsLoading ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-sm text-gray-500">Loading students...</td></tr>
                                ) : studentsError ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-sm text-red-500">{studentsError}</td></tr>
                                ) : currentStudentList.length > 0 ? (
                                    currentStudentList.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.firstName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.birthday}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleEditStudent(student)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                            {selectedClass ? 'No students found for this class.' : 'Select a class to view students.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {showAddStudentForm && selectedClass && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-xl font-semibold mb-4">Add New Student to {selectedClass}</h2>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                    <input
                                        type="text"
                                        value={newStudent.id}
                                        onChange={(e) => { setNewStudent({ ...newStudent, id: e.target.value }); setAddStudentError(null); }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={newStudent.firstName}
                                        onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={newStudent.lastName}
                                        onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                    <input
                                        type="date"
                                        value={newStudent.birthday}
                                        onChange={(e) => setNewStudent({ ...newStudent, birthday: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={newStudent.address}
                                        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                {addStudentError && <p className="text-red-500 text-sm mb-4">{addStudentError}</p>}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => { setShowAddStudentForm(false); setNewStudent({ id: '', firstName: '', lastName: '', birthday: '', address: '' }); setAddStudentError(null); }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddStudent}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition duration-300"
                                    >
                                        Save
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Press ESC to close</p>
                            </div>
                        </div>
                    )}
                    {showEditStudentForm && editingStudent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-xl font-semibold mb-4">Edit Student in {selectedClass}</h2>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                    <input
                                        type="text"
                                        value={editingStudent.id}
                                        onChange={(e) => { setEditingStudent({ ...editingStudent, id: e.target.value }); setEditStudentError(null); }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={editingStudent.firstName}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={editingStudent.lastName}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                    <input
                                        type="date"
                                        value={editingStudent.birthday}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, birthday: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={editingStudent.address}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                {editStudentError && <p className="text-red-500 text-sm mb-4">{editStudentError}</p>}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => { setShowEditStudentForm(false); setEditingStudent(null); setEditStudentError(null); }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEditStudent}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition duration-300"
                                    >
                                        Save
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Press ESC to close</p>
                            </div>
                        </div>
                    )}
                    {showDeleteStudentConfirm && deletingStudent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                                <p className="mb-4 text-gray-600">Are you sure you want to delete student "{deletingStudent.firstName} {deletingStudent.lastName}"? This action cannot be undone.</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteStudentConfirm(false);
                                            setDeletingStudent(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeleteStudent}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Press ESC to close this dialog</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}