import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';

export default function Exam() {
    const location = useLocation();
    const navigate = useNavigate();
    const { studentId, exam } = location.state || {};

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect nếu không có thông tin exam
    useEffect(() => {
        if (!exam || !studentId) {
            navigate('/student-examinations');
            return;
        }
        
        // Kiểm tra xem sinh viên đã thi phiên thi này chưa
        const checkExamStatus = async () => {
            try {
                const response = await fetch(`http://localhost:3000/examination/upcoming/${studentId}`);
                if (response.ok) {
                    const examinations = await response.json();
                    const currentExam = examinations.find(e => 
                        e.MAMH === exam.MAMH && 
                        e.MALOP === exam.MALOP && 
                        e.LAN === exam.LAN
                    );
                    
                    // Nếu đã thi rồi, chuyển về trang danh sách
                    if (currentExam && (currentExam.DA_THI !== null && currentExam.DA_THI !== undefined)) {
                        alert('Bạn đã hoàn thành bài thi này rồi!');
                        navigate('/student-examinations');
                        return;
                    }
                }
            } catch (err) {
                console.error('Error checking exam status:', err);
            }
        };
        
        checkExamStatus();
        setTimeLeft(exam.THOIGIAN * 60); // Convert minutes to seconds
    }, [exam, studentId, navigate]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit(true); // Auto submit when time is up
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Load questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!exam) return;
            
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:3000/exam/questions/${exam.MAMH}/${exam.TRINHDO}/${exam.SOCAUTHI}`
                );
                if (!response.ok) throw new Error('Failed to fetch questions');
                const data = await response.json();
                setQuestions(data);
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Không thể tải câu hỏi. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [exam]);

    // Handle answer selection
    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Submit exam
    const handleSubmit = async (isAutoSubmit = false) => {
        if (isSubmitting) return;
        
        if (!isAutoSubmit) {
            const confirmed = window.confirm('Bạn có chắc chắn muốn nộp bài không?');
            if (!confirmed) return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3000/exam/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    mamh: exam.MAMH,
                    lan: exam.LAN,
                    answers
                })
            });

            if (!response.ok) throw new Error('Failed to submit exam');
            
            const result = await response.json();
            
            // Gắn đáp án đúng vào questions để truyền đến trang kết quả
            const questionsWithAnswers = questions.map(q => ({
                ...q,
                correctAnswer: result.correctAnswersList?.[q.questionId] || ''
            }));
            
            // Redirect to results page with score
            navigate('/exam-result', {
                state: {
                    score: result.score,
                    correctAnswers: result.correctAnswers,
                    totalQuestions: result.totalQuestions,
                    examInfo: exam,
                    questions: questionsWithAnswers,
                    studentAnswers: answers,
                    studentInfo: {
                        studentId: studentId,
                        fullName: localStorage.getItem('fullName') || ''
                    }
                }
            });
        } catch (err) {
            console.error('Error submitting exam:', err);
            alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!exam || !studentId) {
        return <div>Đang chuyển hướng...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Bài Thi: {exam.TENMON || exam.MAMH}
                            </h1>
                            <div className="text-gray-600">
                                <span className="mr-4">Lớp: {exam.MALOP}</span>
                                <span className="mr-4">Lần: {exam.LAN}</span>
                                <span className="mr-4">Trình độ: {exam.TRINHDO}</span>
                                <span>Số câu: {exam.SOCAUTHI}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold text-red-600">
                                Thời gian còn lại: {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {Object.keys(answers).length} / {exam.SOCAUTHI} câu đã trả lời
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Đang tải câu hỏi...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center text-red-500">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((question) => (
                            <div key={question.questionId} className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Câu {question.questionNumber}: {question.content}
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(question.options).map(([optionKey, optionValue]) => (
                                        <label
                                            key={optionKey}
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question.questionId}`}
                                                value={optionKey}
                                                checked={answers[question.questionId] === optionKey}
                                                onChange={() => handleAnswerChange(question.questionId, optionKey)}
                                                className="mr-3 text-blue-600"
                                            />
                                            <span className="font-medium text-gray-700 mr-2">{optionKey}.</span>
                                            <span className="text-gray-800">{optionValue}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Submit Button */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                    isSubmitting
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài thi'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 