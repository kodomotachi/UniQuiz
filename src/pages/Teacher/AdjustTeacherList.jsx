import React, { useEffect, useState } from 'react';

export default function AdjustTeacherList() {
    const [showForm, setShowForm] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        HO: '',
        TEN: '',
        MAGV: '',
        SODTLL: '',
        DIACHI: '',
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editIndex, setEditIndex] = useState(-1);
    const [editError, setEditError] = useState('');

    useEffect(() => {
        document.title = 'Adjust Teacher List';
    }, []);

    useEffect(() => {
        // Fetch teachers data when component mounts
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:3000/teacher/get-list');
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                if (data.success) {
                    setTeachers(data.result);
                } else {
                    throw new Error(data.message || 'Failed to fetch teachers');
                }
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    useEffect(() => {
        // Add ESC key listener when form is shown
        const handleEscKey = event => {
            if (event.key === 'Escape') {
                if (showForm) setShowForm(false);
                if (showEditForm) setShowEditForm(false);
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showForm, showEditForm]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        // Chuẩn bị dữ liệu đúng định dạng API yêu cầu
        const payload = {
            teacherId: formData.MAGV,
            teacherFirstName: formData.HO,
            teacherLastName: formData.TEN,
            teacherPhoneNumber: formData.SODTLL,
            teacherAddress: formData.DIACHI,
        };
        try {
            const response = await fetch('http://localhost:3000/teacher/add-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Failed to add teacher');
            }
            await response.json();
            // Thêm vào danh sách nếu thành công
            setTeachers([...teachers, formData]);
            // Reset form và ẩn form
            setFormData({
                HO: '',
                TEN: '',
                MAGV: '',
                SODTLL: '',
                DIACHI: '',
            });
            setShowForm(false);
        } catch (error) {
            alert('Có lỗi khi thêm giáo viên: ' + error.message);
        }
    };

    const handleEditClick = (teacher, idx) => {
        setEditData({ ...teacher });
        setEditIndex(idx);
        setEditError('');
        setShowEditForm(true);
    };

    const handleEditInputChange = e => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleEditSubmit = async e => {
        e.preventDefault();
        // Kiểm tra trùng mã giáo viên
        const duplicate = teachers.some((t, idx) => t.MAGV === editData.MAGV && idx !== editIndex);
        if (duplicate) {
            setEditError('Mã giáo viên đã được sử dụng bởi người khác!');
            return;
        }
        // Chuẩn bị payload đúng định dạng API yêu cầu
        const payload = {
            teacherId: teachers[editIndex].MAGV, // mã cũ
            newTeacherId: editData.MAGV, // mã mới (có thể giống mã cũ)
            teacherFirstName: editData.HO,
            teacherLastName: editData.TEN,
            teacherPhoneNumber: editData.SODTLL,
            teacherAddress: editData.DIACHI,
        };
        try {
            const response = await fetch('http://localhost:3000/teacher/edit-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Failed to update teacher');
            }
            await response.json();
            // Cập nhật lại danh sách local
            const updated = [...teachers];
            updated[editIndex] = { ...editData };
            setTeachers(updated);
            setShowEditForm(false);
        } catch (error) {
            setEditError('Có lỗi khi cập nhật giáo viên: ' + error.message);
        }
    };

    const handleDeleteClick = async (teacherId, idx) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) return;
        try {
            const response = await fetch('http://localhost:3000/teacher/delete-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teacherId }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete teacher');
            }
            // Xóa khỏi danh sách local
            const updated = [...teachers];
            updated.splice(idx, 1);
            setTeachers(updated);
        } catch (error) {
            alert('Có lỗi khi xóa giáo viên: ' + error.message);
        }
    };

    return (
        <>
            <div className="flex min-h-screen">
                {/* Left Sidebar */}
                <div className="w-1/6 bg-gray-100 shadow-md px-4 py-20">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 mb-5 rounded-md text-sm transition duration-300 flex items-center w-full outline-none"
                    >
                        New Teacher
                    </button>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 mb-5 rounded-md text-sm transition duration-300 flex items-center w-full outline-none">
                        Restore
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-x-auto p-4 flex flex-col items-center bg-gray-50">
                    <h2 className="text-2xl font-semibold mb-12 mt-8">Teacher List</h2>
                    {/* Teacher Form */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold">Add New Teacher</h3>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <span className="border border-gray-300 rounded px-1 mr-1 bg-gray-100">
                                            ESC
                                        </span>
                                        <span>to close</span>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="HO"
                                            value={formData.HO}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="TEN"
                                            value={formData.TEN}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teacher ID
                                        </label>
                                        <input
                                            type="text"
                                            name="MAGV"
                                            value={formData.MAGV}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="SODTLL"
                                            value={formData.SODTLL}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="DIACHI"
                                            value={formData.DIACHI}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="w-2/3 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* {" "} */}{' '}
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        First Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                        Last Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher Id
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            {/* {" "} */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teachers.map((teacher, index) => (
                                    <tr key={teacher.MAGV}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {teacher.HO}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-50">
                                            {teacher.TEN}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.MAGV}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.SODTLL}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.DIACHI}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300 mr-2" onClick={() => handleEditClick(teacher, index)}>
                                                Edit
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition duration-300" onClick={() => handleDeleteClick(teacher.MAGV, index)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Edit Teacher Modal */}
                    {showEditForm && editData && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold">Edit Teacher</h3>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <span className="border border-gray-300 rounded px-1 mr-1 bg-gray-100">ESC</span>
                                        <span>to close</span>
                                    </div>
                                </div>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input type="text" name="HO" value={editData.HO} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input type="text" name="TEN" value={editData.TEN} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                                        <input type="text" name="MAGV" value={editData.MAGV} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" name="SODTLL" value={editData.SODTLL} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input type="text" name="DIACHI" value={editData.DIACHI} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    {editError && <div className="text-red-500 mb-4 text-sm">{editError}</div>}
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" onClick={() => setShowEditForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
