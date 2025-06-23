import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function PrepareExamination() {
	const [examinations, setExaminations] = useState([]);
	const [classes, setClasses] = useState([]);
	const [subjects, setSubjects] = useState([]);
	
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [showAddForm, setShowAddForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const [newExam, setNewExam] = useState({ malop: '', mamh: '', trinhdo: 'A', ngaythi: '', lan: 1, socauthi: 10, thoigian: 15 });
	const [editingExam, setEditingExam] = useState(null);
	const [deletingExam, setDeletingExam] = useState(null);

	const [formError, setFormError] = useState('');
	const [questionCountMsg, setQuestionCountMsg] = useState('');

	const fetchData = async (url, setter, entityName) => {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Network response was not ok for ${entityName}`);
			}
			const data = await response.json();
			setter(data);
		} catch (error) {
			console.error(`Error fetching ${entityName}:`, error);
			setError(`Failed to load ${entityName}.`);
		}
	};

	const fetchAllData = async () => {
		setLoading(true);
		setError(null);
		await Promise.all([
			fetchData('http://localhost:3000/examination/get-all', setExaminations, 'examinations'),
			fetchData('http://localhost:3000/class/get-class', setClasses, 'classes'),
			fetchData('http://localhost:3000/subject/get-subject', setSubjects, 'subjects'),
		]);
		setLoading(false);
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	// Handle ESC key press
	useEffect(() => {
		const handleEscKey = (e) => {
			if (e.key === 'Escape') {
				setShowAddForm(false);
				setShowEditForm(false);
				setShowDeleteConfirm(false);
			}
		};
		document.addEventListener('keydown', handleEscKey);
		return () => document.removeEventListener('keydown', handleEscKey);
	}, []);
	
	const getLoggedInTeacherId = () => {
		const token = localStorage.getItem('token');
		if (!token) return null;
		try {
			const decoded = jwtDecode(token);
			return decoded.id;
		} catch (error) {
			console.error("Failed to decode token:", error)
			return null;
		}
	};

	const handleAddExam = async () => {
		const { malop, mamh, lan, ngaythi, socauthi, thoigian } = newExam;
		if (!malop || !mamh || !lan || !ngaythi || !socauthi || !thoigian) {
			setFormError('Please fill all required fields.');
			return;
		}
		
		const magv = getLoggedInTeacherId();
		if(!magv) {
			setFormError('Could not identify teacher. Please log in again.');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/examination/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...newExam, magv }),
			});
			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || 'Failed to add examination');
			}
			setShowAddForm(false);
			setNewExam({ malop: '', mamh: '', trinhdo: 'A', ngaythi: '', lan: 1, socauthi: 10, thoigian: 15 });
			fetchAllData();
		} catch (error) {
			setFormError(error.message);
		}
	};

	// --- Start of new code for real-time validation ---
	const checkQuestionCount = async (examData) => {
		if (examData.mamh && examData.trinhdo) {
			try {
				const response = await fetch(`http://localhost:3000/question/count?mamh=${examData.mamh}&trinhdo=${examData.trinhdo}`);
				const data = await response.json();
				if (response.ok) {
					if (data.count < examData.socauthi) {
						setQuestionCountMsg(`Warning: Not enough questions. Available: ${data.count}, Required: ${examData.socauthi}`);
					} else {
						setQuestionCountMsg(`Available questions for this level: ${data.count}`);
					}
				} else {
					setQuestionCountMsg('Could not verify question count.');
				}
			} catch (err) {
				console.error("Error checking question count:", err);
				setQuestionCountMsg('Error checking question count.');
			}
		} else {
			setQuestionCountMsg('');
		}
	};

	useEffect(() => {
		if (showAddForm) {
			checkQuestionCount(newExam);
		}
	}, [newExam.mamh, newExam.trinhdo, newExam.socauthi, showAddForm]);

	useEffect(() => {
		if (showEditForm && editingExam) {
			checkQuestionCount({
				mamh: editingExam.MAMH,
				trinhdo: editingExam.TRINHDO,
				socauthi: editingExam.SOCAUTHI
			});
		}
	}, [editingExam?.MAMH, editingExam?.TRINHDO, editingExam?.SOCAUTHI, showEditForm]);
	// --- End of new code ---

	const handleEditExam = (exam) => {
		const formattedDate = new Date(exam.NGAYTHI).toISOString().slice(0, 16);
		setEditingExam({ ...exam, NGAYTHI: formattedDate });
		setShowEditForm(true);
		setFormError('');
		setQuestionCountMsg(''); // Clear message on open
	};
	
	const handleSaveEdit = async () => {
		if (!editingExam) return;
		
		const { MALOP, MAMH, LAN, TRINHDO, NGAYTHI, SOCAUTHI, THOIGIAN } = editingExam;
		
		try {
			const response = await fetch('http://localhost:3000/examination/edit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					malop: MALOP,
					mamh: MAMH,
					lan: LAN,
					trinhdo: TRINHDO,
					ngaythi: NGAYTHI,
					socauthi: SOCAUTHI,
					thoigian: THOIGIAN,
				}),
			});
			 if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || 'Failed to update examination');
			}
			setShowEditForm(false);
			setEditingExam(null);
			fetchAllData();
		} catch (error) {
			setFormError(error.message);
		}
	};

	const handleDeleteExam = (exam) => {
		setDeletingExam(exam);
		setShowDeleteConfirm(true);
	};

	const confirmDelete = async () => {
		if (!deletingExam) return;

		try {
			const response = await fetch('http://localhost:3000/examination/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ malop: deletingExam.MALOP, mamh: deletingExam.MAMH, lan: deletingExam.LAN }),
			});
			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || 'Failed to delete examination');
			}
			setShowDeleteConfirm(false);
			setDeletingExam(null);
			fetchAllData();
		} catch (error) {
			console.error('Error deleting examination:', error);
			// Optionally show error to user
		}
	};
	
	const renderForm = (isEdit = false) => {
		const exam = isEdit ? editingExam : newExam;
		const setExam = isEdit ? setEditingExam : setNewExam;
		const title = isEdit ? "Edit Examination" : "Add New Examination";
		
		const handleInputChange = (e) => {
			const { name, value } = e.target;
			setExam(prev => ({ ...prev, [name]: value }));
		};

		const handleDateChange = (e) => {
			 setExam(prev => ({ ...prev, [isEdit ? 'NGAYTHI' : 'ngaythi']: e.target.value }));
		}

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
					<h2 className="text-xl font-semibold mb-4">{title}</h2>
					{formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
					
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
							<select name={isEdit ? 'MALOP' : 'malop'} value={exam.MALOP || exam.malop} onChange={handleInputChange} disabled={isEdit} className="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Select Class</option>
								{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
							</select>
						</div>
						 <div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
							<select name={isEdit ? 'MAMH' : 'mamh'} value={exam.MAMH || exam.mamh} onChange={handleInputChange} disabled={isEdit} className="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Select Subject</option>
								{subjects.map(s => <option key={s.MAMH} value={s.MAMH}>{s.TENMH}</option>)}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Attempt</label>
							<input type="number" name={isEdit ? 'LAN' : 'lan'} value={exam.LAN || exam.lan} onChange={handleInputChange} disabled={isEdit} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="1" max="2" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
							<select name={isEdit ? 'TRINHDO' : 'trinhdo'} value={exam.TRINHDO || exam.trinhdo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
							</select>
						</div>
						<div className="col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
							<input type="datetime-local" name={isEdit ? 'NGAYTHI' : 'ngaythi'} value={exam.NGAYTHI || exam.ngaythi} onChange={handleDateChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
							<input type="number" name={isEdit ? 'SOCAUTHI' : 'socauthi'} value={exam.SOCAUTHI || exam.socauthi} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="10" max="100"/>
						</div>
						 <div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
							<input type="number" name={isEdit ? 'THOIGIAN' : 'thoigian'} value={exam.THOIGIAN || exam.thoigian} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="15" max="60"/>
						</div>
					</div>

					{questionCountMsg && <p className={`mt-4 text-sm ${questionCountMsg.startsWith('Warning') ? 'text-red-500' : 'text-gray-500'}`}>{questionCountMsg}</p>}
					
					<div className="flex justify-end space-x-3 mt-6">
						<button onClick={() => {
							isEdit ? setShowEditForm(false) : setShowAddForm(false);
							setQuestionCountMsg('');
						}} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
						<button onClick={isEdit ? handleSaveEdit : handleAddExam} className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md">{isEdit ? 'Save' : 'Add'}</button>
					</div>
					<p className="mt-4 text-sm text-gray-500">Press ESC to close</p>
				</div>
			</div>
		)
	};
	
	return (
		<div className="container mx-auto p-10">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Prepare Examinations</h1>
				<button onClick={() => { setShowAddForm(true); setFormError(''); setQuestionCountMsg(''); }} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm">
					Add Examination
				</button>
			</div>
			
			{showAddForm && renderForm(false)}
			{showEditForm && editingExam && renderForm(true)}

			{showDeleteConfirm && deletingExam && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-96">
						<h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
						<p className="mb-4 text-gray-600">Are you sure you want to delete this examination? This action cannot be undone.</p>
						<div className="flex justify-end space-x-3">
							<button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
							<button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md">Delete</button>
						</div>
					</div>
				</div>
			)}
			
			<div className="border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white">
				 <div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{['Class', 'Subject', 'Attempt', 'Level', 'Start Time', 'Duration', 'Questions', 'Actions'].map(header => (
									<th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{header}</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr><td colSpan="8" className="text-center py-4">Loading...</td></tr>
							) : error ? (
								<tr><td colSpan="8" className="text-center py-4 text-red-500">{error}</td></tr>
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
										<td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
											<button onClick={() => handleEditExam(exam)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Edit</button>
											<button onClick={() => handleDeleteExam(exam)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm">Delete</button>
										</td>
									</tr>
								))
							) : (
								<tr><td colSpan="8" className="text-center py-4">No examinations found.</td></tr>
							)}
						</tbody>
					</table>
				 </div>
			</div>
		</div>
	);
}