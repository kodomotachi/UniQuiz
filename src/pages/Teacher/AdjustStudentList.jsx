import React, { useState, useEffect } from 'react';

// Sample data structure for classes and their students
const initialData = {
    classes: [
        {
            id: 'E22CQCN01-N',
            name: 'Lớp Công nghệ 1',
            students: [
                {
                    id: 'N22DCAT026',
                    firstName: 'Tran',
                    lastName: 'Quoc Huy',
                    birthday: '31/2/2004',
                    address: 'Kon Tum',
                },
                {
                    id: 'N22DCAT027',
                    firstName: 'Nguyen',
                    lastName: 'Van A',
                    birthday: '15/3/2004',
                    address: 'Ha Noi',
                }
            ]
        },
        {
            id: 'E22CQCN02-N',
            name: 'Lớp Công nghệ 2',
            students: [
                {
                    id: 'N22DCAT028',
                    firstName: 'Le',
                    lastName: 'Van B',
                    birthday: '20/4/2004',
                    address: 'Ho Chi Minh',
                },
                {
                    id: 'N22DCAT029',
                    firstName: 'Pham',
                    lastName: 'Thi C',
                    birthday: '10/5/2004',
                    address: 'Da Nang',
                }
            ]
        }
    ]
};

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

    // Load data from localStorage on component mount
    const [classData, setClassData] = useState(() => {
        const savedData = localStorage.getItem('classData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    // Save data to localStorage whenever classData changes
    useEffect(() => {
        localStorage.setItem('classData', JSON.stringify(classData));
    }, [classData]);

    // Get current student list based on selected class
    const currentStudentList = classData.classes.find(c => c.id === selectedClass)?.students || [];

    // Handle outside clicks
    const handleOutsideClick = e => {
        const classListElement = document.getElementById('class-list-container');
        if (classListElement && !classListElement.contains(e.target)) {
            setSelectedClass('');
        }
    };

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
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showAddForm, showEditForm, showDeleteConfirm]);

    // Add event listener for document clicks
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleAddClass = () => {
        if (newClass.id && newClass.name) {
            // Check for duplicate class ID
            const isDuplicate = classData.classes.some(c => c.id === newClass.id);
            if (isDuplicate) {
                setDuplicateIdError(true);
                return;
            }

            setDuplicateIdError(false);
            const updatedData = {
                ...classData,
                classes: [...classData.classes, newClass]
            };
            setClassData(updatedData);
            setShowAddForm(false);
            setNewClass({ id: '', name: '', students: [] });
        }
    };

    const handleEditClass = (classItem) => {
        setEditingClass({ ...classItem });
        setOriginalEditingClassId(classItem.id);
        setShowEditForm(true);
        setDuplicateIdError(false);
    };

    const handleSaveEdit = () => {
        if (editingClass && editingClass.id && editingClass.name) {
            // Only check for duplicate if ID is changed
            if (editingClass.id !== originalEditingClassId) {
                const isDuplicate = classData.classes.some(c => c.id === editingClass.id);
                if (isDuplicate) {
                    setDuplicateIdError(true);
                    return;
                }
            }
            setDuplicateIdError(false);
            const updatedClasses = classData.classes.map(c =>
                c.id === originalEditingClassId ? { ...editingClass } : c
            );
            const updatedData = {
                ...classData,
                classes: updatedClasses
            };
            setClassData(updatedData);
            setShowEditForm(false);
            setEditingClass(null);
            setOriginalEditingClassId('');
        }
    };

    const handleDeleteClass = (classItem) => {
        setDeletingClass(classItem);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (deletingClass) {
            const updatedClasses = classData.classes.filter(c => c.id !== deletingClass.id);
            const updatedData = {
                ...classData,
                classes: updatedClasses
            };
            setClassData(updatedData);
            setShowDeleteConfirm(false);
            setDeletingClass(null);
            if (selectedClass === deletingClass.id) {
                setSelectedClass('');
            }
        }
    };

    return (
        <div className="flex items-center mt-15 mx-10">
            <div id="class-list-container" className="w-1/3 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 border-b border-gray-200">
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                            setDuplicateIdError(false);
                        }}
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
                            <p className="mb-4 text-gray-600">
                                Are you sure you want to delete class "{deletingClass.name}"? This action cannot be undone.
                            </p>
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
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class Name
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classData.classes.map((classItem, index) => (
                            <tr
                                key={index}
                                onClick={() => setSelectedClass(classItem.id)}
                                className={`cursor-pointer ${selectedClass === classItem.id ? 'bg-indigo-50' : ''}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {classItem.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {classItem.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClass(classItem);
                                        }}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClass(classItem);
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-1/2 ml-50 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">
                        {selectedClass
                            ? `Students in ${selectedClass}`
                            : 'Select a class to view students'}
                    </h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                First Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Birthday
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Address
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStudentList.length > 0 ? (
                            currentStudentList.map((student, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.firstName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.birthday}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-8 text-center text-sm text-gray-500"
                                >
                                    No students to display. Please select a class from the list.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
