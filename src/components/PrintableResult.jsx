import React from 'react';

export default function PrintableResult({ 
    score, 
    correctAnswers, 
    totalQuestions, 
    examInfo, 
    studentInfo,
    questions,
    studentAnswers 
}) {
    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentDate = new Date();

    return (
        <div className="print-container bg-white p-8 font-serif" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-lg font-bold mb-2">7. Xem kết quả:</h1>
                <p className="text-sm">
                    Mục này cho phép user in ra lại các câu đã thi dưa vào các thông tin: 
                    <span className="underline">tên lớp</span>, <span className="underline">môn học</span>, 
                    <span className="underline">trình độ</span>, (login của user <span className="underline">đã nhập</span>).
                </p>
                <p className="text-sm mt-2 font-semibold">Màn hình kết xuất có dạng:</p>
            </div>

            {/* Student Info */}
            <div className="mb-4" style={{ fontSize: '11px' }}>
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="w-20">Lớp</td>
                            <td className="w-4">:</td>
                            <td className="border-b border-dotted border-black">{examInfo?.MALOP || 'xxxxxxxxxxxxxxxxxxxxx'}</td>
                        </tr>
                        <tr>
                            <td>Họ tên</td>
                            <td>:</td>
                            <td className="border-b border-dotted border-black">{studentInfo?.fullName || 'xxxxxxxxxxxxxxxxxxxxx'}</td>
                            <td className="pl-8">Mã số SV:</td>
                            <td className="border-b border-dotted border-black text-red-600 font-bold">
                                {studentInfo?.studentId || 'xxxxxxxxxxxxx'}
                            </td>
                        </tr>
                        <tr>
                            <td>Môn thi</td>
                            <td>:</td>
                            <td className="border-b border-dotted border-black">
                                {examInfo?.TENMON || examInfo?.MAMH || 'xxxxxxxxxxxxx'}
                            </td>
                        </tr>
                        <tr>
                            <td>Ngày thi</td>
                            <td>:</td>
                            <td className="border-b border-dotted border-black">
                                {formatDate(currentDate)}
                            </td>
                            <td className="pl-8">Lần thi:</td>
                            <td className="border-b border-dotted border-black font-bold">
                                #{examInfo?.LAN || '1'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Results Table */}
            <div className="mb-6">
                <table className="w-full border-collapse border border-black" style={{ fontSize: '10px' }}>
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>STT</th>
                            <th className="border border-black p-2 text-center" style={{ width: '12%' }}>
                                Câu số<br/>(trong bộ đề)
                            </th>
                            <th className="border border-black p-2 text-center" style={{ width: '35%' }}>
                                Nội dung câu hỏi
                            </th>
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>A</th>
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>B</th>
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>C</th>
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>D</th>
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>
                                Trả lời<br/>của SV
                            </th>
                            <th className="border border-black p-2 text-center" style={{ width: '8%' }}>
                                Đáp án
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions && questions.length > 0 ? (
                            questions.map((question, index) => {
                                const studentAnswer = studentAnswers?.[question.questionId] || '';
                                const isCorrect = studentAnswer === question.correctAnswer;
                                
                                return (
                                    <tr key={question.questionId}>
                                        <td className="border border-black p-1 text-center">{index + 1}</td>
                                        <td className="border border-black p-1 text-center">{question.questionId}</td>
                                        <td className="border border-black p-1">{question.content}</td>
                                        <td className="border border-black p-1 text-center">
                                            {studentAnswer === 'A' ? '✓' : ''}
                                        </td>
                                        <td className="border border-black p-1 text-center">
                                            {studentAnswer === 'B' ? '✓' : ''}
                                        </td>
                                        <td className="border border-black p-1 text-center">
                                            {studentAnswer === 'C' ? '✓' : ''}
                                        </td>
                                        <td className="border border-black p-1 text-center">
                                            {studentAnswer === 'D' ? '✓' : ''}
                                        </td>
                                        <td className={`border border-black p-1 text-center font-bold ${
                                            isCorrect ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {studentAnswer || '-'}
                                        </td>
                                        <td className="border border-black p-1 text-center font-bold text-blue-600">
                                            {question.correctAnswer}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            // Empty rows for template
                            Array.from({ length: 10 }, (_, index) => (
                                <tr key={index}>
                                    <td className="border border-black p-1 text-center h-8"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-4" style={{ fontSize: '11px' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <strong>Tổng điểm: {score?.toFixed(1) || '0.0'}/10</strong>
                    </div>
                    <div>
                        <strong>Số câu đúng: {correctAnswers || 0}/{totalQuestions || 0}</strong>
                    </div>
                    <div>
                        <strong>Thời gian hoàn thành: {formatTime(currentDate)} {formatDate(currentDate)}</strong>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .print-container {
                        margin: 0;
                        padding: 20px;
                        box-shadow: none;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    .border-dotted {
                        border-bottom: 1px dotted black !important;
                    }
                    
                    table {
                        page-break-inside: avoid;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    .text-red-600 {
                        color: #dc2626 !important;
                    }
                    
                    .text-green-600 {
                        color: #16a34a !important;
                    }
                    
                    .text-blue-600 {
                        color: #2563eb !important;
                    }
                    
                    .bg-gray-100 {
                        background-color: #f3f4f6 !important;
                    }
                }
            `}</style>
        </div>
    );
}
