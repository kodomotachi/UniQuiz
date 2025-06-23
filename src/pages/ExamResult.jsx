import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';
import PrintableResult from '../components/PrintableResult';

export default function ExamResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPrintView, setShowPrintView] = useState(false);
    const { score, correctAnswers, totalQuestions, examInfo, questions, studentAnswers, studentInfo } = location.state || {};

    // Redirect nếu không có dữ liệu
    if (!score && score !== 0) {
        navigate('/student-examinations');
        return null;
    }

    // Determine score color and message
    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6.5) return 'text-yellow-600';
        if (score >= 5) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreMessage = (score) => {
        if (score >= 8) return 'Xuất sắc!';
        if (score >= 6.5) return 'Khá!';
        if (score >= 5) return 'Trung bình!';
        return 'Cần cố gắng thêm!';
    };

    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    const handlePrint = () => {
        setShowPrintView(true);
        setTimeout(() => {
            window.print();
            setShowPrintView(false);
        }, 500);
    };

    // Nếu đang trong chế độ in, chỉ hiển thị component PrintableResult
    if (showPrintView) {
        return (
            <PrintableResult
                score={score}
                correctAnswers={correctAnswers}
                totalQuestions={totalQuestions}
                examInfo={examInfo}
                studentInfo={studentInfo}
                questions={questions}
                studentAnswers={studentAnswers}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Kết Quả Bài Thi
                        </h1>
                        <p className="text-gray-600">
                            {examInfo?.TENMON || examInfo?.MAMH} - Lớp {examInfo?.MALOP} - Lần {examInfo?.LAN}
                        </p>
                    </div>

                    {/* Score Display */}
                    <div className="mb-8">
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                            {score.toFixed(1)}
                        </div>
                        <div className="text-2xl font-semibold text-gray-700 mb-2">
                            {getScoreMessage(score)}
                        </div>
                        <div className="text-lg text-gray-600">
                            {correctAnswers}/{totalQuestions} câu đúng ({percentage}%)
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full transition-all duration-500 ${
                                    score >= 8 ? 'bg-green-500' :
                                    score >= 6.5 ? 'bg-yellow-500' :
                                    score >= 5 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                            Tỷ lệ đúng: {percentage}%
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                            <div className="text-sm text-gray-600">Câu đúng</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                            <div className="text-sm text-gray-600">Câu sai</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/student-examinations')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            In kết quả
                        </button>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-8 text-sm text-gray-500">
                        Hoàn thành lúc: {new Date().toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* Motivational Message */}
                <div className="mt-6 bg-white rounded-xl shadow-md p-6 text-center">
                    <p className="text-gray-600">
                        {score >= 8 ? 
                            "Chúc mừng! Bạn đã đạt kết quả xuất sắc. Hãy tiếp tục duy trì phong độ này!" :
                        score >= 6.5 ?
                            "Kết quả khá tốt! Hãy ôn tập thêm để đạt điểm cao hơn trong lần thi tiếp theo." :
                        score >= 5 ?
                            "Bạn đã vượt qua bài thi. Hãy cố gắng học tập thêm để cải thiện kết quả." :
                            "Đừng nản lòng! Hãy ôn tập kỹ hơn và thử lại. Bạn chắc chắn sẽ có kết quả tốt hơn."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
} 