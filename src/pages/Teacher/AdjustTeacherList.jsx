import React, { useEffect, useState } from 'react';

const users = [
    {
        firstName: 'Tran',
        lastName: 'Quoc Huy',
        teacherId: 'N22DCAT026',
        phoneNumber: '0342114194',
        address: 'Kon Tum',
    },
];

export default function AdjustTeacherList() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        teacherId: '',
        phoneNumber: '',
        address: '',
    });

    useEffect(() => {
        document.title = 'Adjust Teacher List';
    }, []);

    useEffect(() => {
        // Add ESC key listener when form is shown
        const handleEscKey = event => {
            if (event.key === 'Escape' && showForm) {
                setShowForm(false);
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleEscKey);

        // Clean up event listener when component unmounts or showForm changes
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showForm]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Here you would typically save the data to your backend
        console.log('Submitted data:', formData);
        // Add the new teacher to the list (in a real app, this would happen after API confirmation)
        users.push({ ...formData });
        // Reset form and hide it
        setFormData({
            firstName: '',
            lastName: '',
            teacherId: '',
            phoneNumber: '',
            address: '',
        });
        setShowForm(false);
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
                                            name="firstName"
                                            value={formData.firstName}
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
                                            name="lastName"
                                            value={formData.lastName}
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
                                            name="teacherId"
                                            value={formData.teacherId}
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
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
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
                                            name="address"
                                            value={formData.address}
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.firstName}
                                        </td>{' '}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.teacherId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300">
                                                Edit
                                            </button>
                                        </td>{' '}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
