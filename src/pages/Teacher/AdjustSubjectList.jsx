import { useState, useEffect } from 'react';
import React from 'react';

const initialUsers = [
    {
        id: 'BAS1203_CLC',
        subject: 'Calculus 1',
    },
    {
        id: 'BAS1204_CLC',
        subject: 'Calculus 2',
    },
    {
        id: 'BAS1201_CLC',
        subject: 'Algebra',
    },
    {
        id: 'BAS1224_CLC',
        subject: 'Physics 1',
    },
    {
        id: 'INT1306_CLC',
        subject: 'Data Structures and Algorithms',
    },
    {
        id: 'INT14124_CLC',
        subject: 'Natural Language Processing',
    },
];

export default function AdjustSubjectList() {
    // Load data from localStorage or use initialUsers as fallback
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('subjectList');
        return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    });
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [subjectId, setSubjectId] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [editSubjectId, setEditSubjectId] = useState('');
    const [editSubjectName, setEditSubjectName] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);

    useEffect(() => {
        document.title = 'Adjust Subject List';
    }, []);

    // Save users to localStorage whenever users state changes
    useEffect(() => {
        localStorage.setItem('subjectList', JSON.stringify(users));
    }, [users]); // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                if (showForm) {
                    setShowForm(false);
                    setSubjectId('');
                    setSubjectName('');
                }
                if (showEditForm) {
                    setShowEditForm(false);
                    setEditSubjectId('');
                    setEditSubjectName('');
                    setEditingIndex(-1);
                }
            }
        };

        if (showForm || showEditForm) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showForm, showEditForm]);
    const handleCancel = () => {
        setShowForm(false);
        setSubjectId('');
        setSubjectName('');
    };

    const handleEdit = index => {
        const userToEdit = users[index];
        setEditSubjectId(userToEdit.id);
        setEditSubjectName(userToEdit.subject);
        setEditingIndex(index);
        setShowEditForm(true);
    };

    const handleEditCancel = () => {
        setShowEditForm(false);
        setEditSubjectId('');
        setEditSubjectName('');
        setEditingIndex(-1);
    };

    const handleEditSubmit = e => {
        e.preventDefault();
        if (editSubjectId.trim() && editSubjectName.trim()) {
            // Check if the new ID conflicts with existing subjects (excluding the current one)
            const existingSubject = users.find(
                (user, index) => user.id === editSubjectId.trim() && index !== editingIndex
            );
            if (existingSubject) {
                alert('Subject ID already exists! Please use a different ID.');
                return;
            }

            // Update the subject in the array
            const updatedUsers = users.map((user, index) =>
                index === editingIndex
                    ? { id: editSubjectId.trim(), subject: editSubjectName.trim() }
                    : user
            );
            setUsers(updatedUsers);

            // Reset form and close
            setEditSubjectId('');
            setEditSubjectName('');
            setEditingIndex(-1);
            setShowEditForm(false);

            console.log('Subject updated successfully');
        }
    };
    const handleSubmit = e => {
        e.preventDefault();
        if (subjectId.trim() && subjectName.trim()) {
            // Check if subject ID already exists
            const existingSubject = users.find(user => user.id === subjectId.trim());
            if (existingSubject) {
                alert('Subject ID already exists! Please use a different ID.');
                return;
            }

            // Add new subject to the users array
            const newSubject = {
                id: subjectId.trim(),
                subject: subjectName.trim(),
            };
            setUsers(prevUsers => [...prevUsers, newSubject]);

            // Reset form and close
            setSubjectId('');
            setSubjectName('');
            setShowForm(false);

            console.log('New Subject added:', newSubject);
        }
    };

    const handleRestore = () => {
        const confirmRestore = window.confirm(
            'Are you sure you want to restore the original subject list? All changes will be lost.'
        );
        if (confirmRestore) {
            setUsers(initialUsers);
            localStorage.setItem('subjectList', JSON.stringify(initialUsers));
            console.log('Subject list restored to original');
        }
    };

    return (
        <>
            <div className="flex min-h-screen">
                {/* Left Sidebar */}{' '}
                <div className="w-1/6 bg-gray-100 shadow-md px-4 py-20">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 mb-5 rounded-md text-sm transition duration-300 flex items-center w-full"
                        onClick={() => setShowForm(true)}
                    >
                        New Subject{' '}
                    </button>
                    <button
                        className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 mb-5 rounded-md text-sm transition duration-300 flex items-center w-full"
                        onClick={handleRestore}
                    >
                        Restore
                    </button>
                </div>
                {/* Main Content */}
                <div className="flex-1 overflow-x-auto p-4 flex flex-col items-center bg-gray-50">
                    <h2 className="text-2xl font-semibold mb-12 mt-8">Subject List</h2>
                    <div className="w-2/3 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* {" "} */}{' '}
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Id
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subject
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            {/* {" "} */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.id}
                                        </td>{' '}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.subject}
                                        </td>{' '}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300"
                                                onClick={() => handleEdit(index)}
                                            >
                                                Edit
                                            </button>
                                        </td>{' '}
                                    </tr>
                                ))}
                            </tbody>
                        </table>{' '}
                    </div>
                </div>
            </div>{' '}
            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Subject</h3>
                            <p className="text-xs text-gray-500">Press ESC to close</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject ID
                                </label>
                                <input
                                    type="text"
                                    value={subjectId}
                                    onChange={e => setSubjectId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subject ID (e.g., BAS1205_CLC)"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={e => setSubjectName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subject name"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                                >
                                    Add Subject
                                </button>
                            </div>
                        </form>{' '}
                    </div>
                </div>
            )}{' '}
            {/* Edit Modal Form */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Subject</h3>
                            <p className="text-xs text-gray-500">Press ESC to close</p>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject ID
                                </label>
                                <input
                                    type="text"
                                    value={editSubjectId}
                                    onChange={e => setEditSubjectId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subject ID (e.g., BAS1205_CLC)"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    value={editSubjectName}
                                    onChange={e => setEditSubjectName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subject name"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleEditCancel}
                                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
