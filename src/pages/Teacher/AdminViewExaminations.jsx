import React, { useState, useEffect } from 'react';

export default function AdminViewExaminations() {
	const [examinations, setExaminations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchExaminations = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch('http://localhost:3000/examination/get-all');
			if (!response.ok) {
				throw new Error('Failed to fetch examinations');
			}
			const data = await response.json();
			setExaminations(data);
		} catch (err) {
			setError('Failed to load examinations.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchExaminations();
	}, []);

	return (
		<div className="container mx-auto p-10">
			<h1 className="text-2xl font-bold mb-6">All Examination Sessions (Read Only)</h1>
			<div className="border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{['Class', 'Subject', 'Attempt', 'Level', 'Start Time', 'Duration', 'Questions'].map(header => (
									<th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{header}</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
							) : error ? (
								<tr><td colSpan="7" className="text-center py-4 text-red-500">{error}</td></tr>
							) : examinations.length > 0 ? (
								examinations.map((exam) => (
									<tr key={`${exam.MALOP}-${exam.MAMH}-${exam.LAN}`}>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{exam.MALOP.trim()}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.MAMH.trim()}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.LAN}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.TRINHDO.trim()}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(exam.NGAYTHI).toLocaleString()}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.THOIGIAN} mins</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.SOCAUTHI}</td>
									</tr>
								))
							) : (
								<tr><td colSpan="7" className="text-center py-4">No examinations found.</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
} 