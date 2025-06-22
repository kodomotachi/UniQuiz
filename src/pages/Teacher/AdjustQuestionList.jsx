import React, { useState, useEffect } from 'react';

export default function AdjustQuestionList() {
	// Subjects state
	const [subjects, setSubjects] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState(null);
	const [loadingSubjects, setLoadingSubjects] = useState(true);
	const [errorSubjects, setErrorSubjects] = useState(null);

	// Questions state
	const [questions, setQuestions] = useState([]);
	const [loadingQuestions, setLoadingQuestions] = useState(false);
	const [errorQuestions, setErrorQuestions] = useState(null);

	// Modal & Form state
	const [showAddForm, setShowAddForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const [newQuestion, setNewQuestion] = useState({
		TRINHDO: 'A',
		NOIDUNG: '',
		A: '',
		B: '',
		C: '',
		D: '',
		DAP_AN: 'A',
	});
	const [editingQuestion, setEditingQuestion] = useState(null);
	const [deletingQuestionId, setDeletingQuestionId] = useState(null);
	const [formError, setFormError] = useState('');

	// Fetch Subjects
	useEffect(() => {
		const fetchSubjects = async () => {
			setLoadingSubjects(true);
			try {
				const response = await fetch('http://localhost:3000/subject/get-subject');
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
				setSubjects(data);
			} catch (error) {
				setErrorSubjects('Failed to load subjects.');
				console.error('Error fetching subjects:', error);
			} finally {
				setLoadingSubjects(false);
			}
		};
		fetchSubjects();
	}, []);

	// Fetch Questions when a subject is selected
	useEffect(() => {
		if (!selectedSubject) {
			setQuestions([]);
			return;
		}

		const fetchQuestions = async () => {
			setLoadingQuestions(true);
			setErrorQuestions(null);
			try {
				const response = await fetch(`http://localhost:3000/question/get-by-subject/${selectedSubject.MAMH}`);
				if (!response.ok) {
					throw new Error('Failed to fetch questions');
				}
				const data = await response.json();
				setQuestions(data);
			} catch (error) {
				setErrorQuestions('Failed to load questions for this subject.');
				console.error('Error fetching questions:', error);
			} finally {
				setLoadingQuestions(false);
			}
		};
		fetchQuestions();
	}, [selectedSubject]);

	const resetNewQuestionForm = () => {
		setNewQuestion({
			TRINHDO: 'A',
			NOIDUNG: '',
			A: '',
			B: '',
			C: '',
			D: '',
			DAP_AN: 'A',
		});
		setFormError('');
	};

	const validateForm = (questionData) => {
		const { NOIDUNG, A, B, C, D } = questionData;
		if (!NOIDUNG.trim() || !A.trim() || !B.trim() || !C.trim() || !D.trim()) {
			setFormError('All fields are required.');
			return false;
		}

		const answers = [A.trim(), B.trim(), C.trim(), D.trim()];
		const uniqueAnswers = new Set(answers);
		if (uniqueAnswers.size !== answers.length) {
			setFormError('All four answer options must be unique.');
			return false;
		}
		
		setFormError('');
		return true;
	};

	const handleAddQuestion = async () => {
		if (!validateForm(newQuestion)) return;

		try {
			// Hard-coded teacher ID as per schema. Replace if dynamic teacher login is implemented.
			const teacherId = 'GV001'; 
			
			const response = await fetch('http://localhost:3000/question/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subjectId: selectedSubject.MAMH,
					level: newQuestion.TRINHDO,
					content: newQuestion.NOIDUNG,
					optionA: newQuestion.A,
					optionB: newQuestion.B,
					optionC: newQuestion.C,
					optionD: newQuestion.D,
					correctAnswer: newQuestion.DAP_AN,
					teacherId: teacherId
				}),
			});

			if (!response.ok) throw new Error('Failed to add question');
			
			// Refetch questions to show the new one
			const updatedQuestionsResponse = await fetch(`http://localhost:3000/question/get-by-subject/${selectedSubject.MAMH}`);
			const updatedData = await updatedQuestionsResponse.json();
			setQuestions(updatedData);

			setShowAddForm(false);
			resetNewQuestionForm();

		} catch (error) {
			setFormError('An error occurred while adding the question.');
			console.error(error);
		}
	};

	const handleEditQuestion = async () => {
		if (!editingQuestion || !validateForm(editingQuestion)) return;
		
		try {
			const response = await fetch('http://localhost:3000/question/edit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					questionId: editingQuestion.CAUHOI,
					subjectId: editingQuestion.MAMH,
					level: editingQuestion.TRINHDO,
					content: editingQuestion.NOIDUNG,
					optionA: editingQuestion.A,
					optionB: editingQuestion.B,
					optionC: editingQuestion.C,
					optionD: editingQuestion.D,
					correctAnswer: editingQuestion.DAP_AN
				}),
			});

			if (!response.ok) throw new Error('Failed to update question');

			// Update question in local state
			setQuestions(questions.map(q => q.CAUHOI === editingQuestion.CAUHOI ? editingQuestion : q));
			
			setShowEditForm(false);
			setEditingQuestion(null);
			setFormError('');

		} catch (error) {
			setFormError('An error occurred while updating the question.');
			console.error(error);
		}
	};
	
	const handleDeleteQuestion = async () => {
		if (!deletingQuestionId) return;

		try {
			const response = await fetch('http://localhost:3000/question/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ questionId: deletingQuestionId }),
			});

			if (!response.ok) throw new Error('Failed to delete question');
			
			setQuestions(questions.filter(q => q.CAUHOI !== deletingQuestionId));
			
			setShowDeleteConfirm(false);
			setDeletingQuestionId(null);

		} catch (error) {
			console.error('Error deleting question:', error);
		}
	};

	// Render Functions
	const renderSubjectList = () => (
		<div className="w-1/4 border-r border-gray-200 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
			<h2 className="text-lg font-semibold p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">Subjects</h2>
			{loadingSubjects && <p className="p-4">Loading...</p>}
			{errorSubjects && <p className="p-4 text-red-500">{errorSubjects}</p>}
			<ul>
				{subjects.map(subject => (
					<li
						key={subject.MAMH}
						onClick={() => setSelectedSubject(subject)}
						className={`p-4 cursor-pointer hover:bg-indigo-50 ${selectedSubject?.MAMH === subject.MAMH ? 'bg-indigo-100 font-semibold' : ''}`}
					>
						{subject.TENMH}
					</li>
				))}
			</ul>
		</div>
	);
	
	const renderQuestionPanel = () => (
		<div className="w-3/4 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
			{!selectedSubject ? (
				<div className="flex items-center justify-center h-full text-gray-500">
					<p>Select a subject to view and manage questions.</p>
				</div>
			) : (
				<>
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold">Questions for {selectedSubject.TENMH}</h2>
						<button
							onClick={() => { resetNewQuestionForm(); setShowAddForm(true); }}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
						>
							Add Question
						</button>
					</div>
					{loadingQuestions && <p>Loading questions...</p>}
					{errorQuestions && <p className="text-red-500">{errorQuestions}</p>}
					<div className="space-y-4">
						{questions.map(q => (
							<div key={q.CAUHOI} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
								<div className="flex justify-between items-start">
									<p className="font-semibold text-gray-800 flex-1 pr-4">{q.NOIDUNG}</p>
									<div className="flex-shrink-0 space-x-2">
										<button onClick={() => { setEditingQuestion({ ...q }); setFormError(''); setShowEditForm(true); }} className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm">Edit</button>
										<button onClick={() => { setDeletingQuestionId(q.CAUHOI); setShowDeleteConfirm(true); }} className="bg-red-500 text-white py-1 px-3 rounded-md text-sm">Delete</button>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
									<p className={q.DAP_AN === 'A' ? 'text-green-600 font-bold' : ''}>A: {q.A}</p>
									<p className={q.DAP_AN === 'B' ? 'text-green-600 font-bold' : ''}>B: {q.B}</p>
									<p className={q.DAP_AN === 'C' ? 'text-green-600 font-bold' : ''}>C: {q.C}</p>
									<p className={q.DAP_AN === 'D' ? 'text-green-600 font-bold' : ''}>D: {q.D}</p>
								</div>
								<div className="text-xs text-gray-500 mt-2">Level: {q.TRINHDO}</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);

	const renderQuestionForm = (isEdit = false) => {
		const questionData = isEdit ? editingQuestion : newQuestion;
		const setQuestionData = isEdit ? setEditingQuestion : setNewQuestion;
		const title = isEdit ? "Edit Question" : "Add New Question";
		const handler = isEdit ? handleEditQuestion : handleAddQuestion;
		const closeHandler = () => isEdit ? setShowEditForm(false) : setShowAddForm(false);
		
		if (!questionData) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg shadow-xl w-1/2 max-w-2xl">
					<h2 className="text-xl font-semibold mb-4">{title}</h2>
					{/* Content */}
					<textarea
						placeholder="Question Content"
						value={questionData.NOIDUNG}
						onChange={(e) => setQuestionData({ ...questionData, NOIDUNG: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>
					{/* Answers */}
					<div className="grid grid-cols-2 gap-4 mb-4">
						<input type="text" placeholder="Answer A" value={questionData.A} onChange={(e) => setQuestionData({...questionData, A: e.target.value})} className="w-full p-2 border rounded-md"/>
						<input type="text" placeholder="Answer B" value={questionData.B} onChange={(e) => setQuestionData({...questionData, B: e.target.value})} className="w-full p-2 border rounded-md"/>
						<input type="text" placeholder="Answer C" value={questionData.C} onChange={(e) => setQuestionData({...questionData, C: e.target.value})} className="w-full p-2 border rounded-md"/>
						<input type="text" placeholder="Answer D" value={questionData.D} onChange={(e) => setQuestionData({...questionData, D: e.target.value})} className="w-full p-2 border rounded-md"/>
					</div>
					{/* Level and Correct Answer */}
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center">
							<label className="mr-2">Level:</label>
							<select value={questionData.TRINHDO} onChange={(e) => setQuestionData({...questionData, TRINHDO: e.target.value})} className="p-2 border rounded-md">
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
							</select>
						</div>
						<div className="flex items-center">
							<label className="mr-2">Correct Answer:</label>
							<select value={questionData.DAP_AN} onChange={(e) => setQuestionData({...questionData, DAP_AN: e.target.value})} className="p-2 border rounded-md">
								<option value="A">A</option>
								<option value="B">B</option>
								<option value="C">C</option>
								<option value="D">D</option>
							</select>
						</div>
					</div>
					{formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
					{/* Actions */}
					<div className="flex justify-end space-x-3">
						<button onClick={closeHandler} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
						<button onClick={handler} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
					</div>
				</div>
			</div>
		);
	};
	
	const renderDeleteConfirm = () => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-xl">
				<h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
				<p>Are you sure you want to delete this question? This action cannot be undone.</p>
				<div className="flex justify-end space-x-3 mt-4">
					<button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
					<button onClick={handleDeleteQuestion} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
				</div>
			</div>
		</div>
	);
	
	return (
		<div className="flex h-screen bg-gray-100">
			{renderSubjectList()}
			{renderQuestionPanel()}
			{showAddForm && renderQuestionForm(false)}
			{showEditForm && renderQuestionForm(true)}
			{showDeleteConfirm && renderDeleteConfirm()}
		</div>
	);
}