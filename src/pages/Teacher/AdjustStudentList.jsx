import React, { useState } from 'react';

const classList = [
    {
        class: 'E22CQCN01-N',
    },
    {
        class: 'E22CQCN02-N',
    },
];

const studentList = [
    {
        firstName: 'Tran',
        lastName: 'Quoc Huy',
        studentId: 'N22DCAT026',
        birthday: '31/2/2004',
        address: 'Kon Tum',
    },
];

const studentList2 = [
    {
        firstName: 'check',
        lastName: 'check',
        studentId: 'N22DCAT026',
        birthday: '31/2/2004',
        address: 'Kon Tum',
    },
];

export default function AdjustStudentList() {
    const [selectedClass, setSelectedClass] = useState('');

    // Determine which student list to display based on selected class
    const currentStudentList =
        selectedClass === 'E22CQCN01-N'
            ? studentList
            : selectedClass === 'E22CQCN02-N'
              ? studentList2
              : [];

    // Handle outside clicks
    const handleOutsideClick = e => {
        // Check if the click is within the class list
        const classListElement = document.getElementById('class-list-container');
        if (classListElement && !classListElement.contains(e.target)) {
            setSelectedClass('');
        }
    };

    // Add event listener for document clicks
    React.useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    return (
        <div className="flex items-center mt-15 mx-10">
            <div
                id="class-list-container"
                className="w-1/4 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    {/* {" "} */}{' '}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    {/* {" "} */}{' '}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classList.map((user, index) => (
                            <tr
                                key={index}
                                onClick={() => setSelectedClass(user.class)}
                                className={`cursor-pointer ${selectedClass === user.class ? 'bg-indigo-50' : ''}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.class}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-sm transition duration-300">
                                        Edit
                                    </button>
                                </td>{' '}
                            </tr>
                        ))}
                    </tbody>
                </table>{' '}
            </div>{' '}
            <div className="w-1/2 ml-50 border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">
                        {selectedClass
                            ? `Students in ${selectedClass}`
                            : 'Select a class to view students'}
                    </h3>
                </div>
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
                                Student ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Birthday
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Address
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>{' '}
                    </thead>
                    {/* {" "} */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStudentList.length > 0 ? (
                            currentStudentList.map((user, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.firstName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.studentId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.birthday}
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
