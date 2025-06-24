import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimplePrintResults from '../../components/SimplePrintResults';

export default function ExamResults() {
    const { malop, mamh, lan } = useParams();
    const navigate = useNavigate();
    
    const [examData, setExamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPrintable, setShowPrintable] = useState(false);

    useEffect(() => {
        fetchExamResults();
    }, [malop, mamh, lan]);

    const fetchExamResults = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/examination/results/${malop}/${mamh}/${lan}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch exam results');
            }
            
            const data = await response.json();
            setExamData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        setShowPrintable(true);
    };

    const handleClosePrint = () => {
        setShowPrintable(false);
    };

    const getScoreColor = (score) => {
        if (score === null || score === undefined) return 'text-gray-500';
        if (score >= 8) return 'text-green-600';
        if (score >= 6.5) return 'text-blue-600';
        if (score >= 5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score) => {
        if (score === null || score === undefined) return 'Chưa thi';
        if (score >= 8) return 'Giỏi';
        if (score >= 6.5) return 'Khá';
        if (score >= 5) return 'Trung bình';
        return 'Yếu';
    };

    if (loading) {
        return (
            <div className="container mx-auto p-10">
                <div className="text-center">
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-10">
                <div className="text-center text-red-600">
                    <p>Lỗi: {error}</p>
                    <button 
                        onClick={() => navigate('/teacher-dashboard/prepare-examination')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!examData) {
        return (
            <div className="container mx-auto p-10">
                <div className="text-center">
                    <p>Không tìm thấy dữ liệu phiên thi</p>
                </div>
            </div>
        );
    }

    const { examInfo, results } = examData;
    const studentsWithResults = results.filter(student => student.DIEM !== null);
    const studentsWithoutResults = results.filter(student => student.DIEM === null);

    return (
        <>
            <div className="container mx-auto p-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bảng điểm phiên thi</h1>
                        <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Lớp:</strong> {examInfo.TENLOP || examInfo.MALOP}</p>
                            <p><strong>Môn học:</strong> {examInfo.TENMH || examInfo.MAMH}</p>
                            <p><strong>Lần thi:</strong> {examInfo.LAN}</p>
                            <p><strong>Trình độ:</strong> {examInfo.TRINHDO}</p>
                            <p><strong>Ngày thi:</strong> {new Date(examInfo.NGAYTHI).toLocaleString()}</p>
                            <p><strong>Thời gian:</strong> {examInfo.THOIGIAN} phút</p>
                            <p><strong>Số câu hỏi:</strong> {examInfo.SOCAUTHI}</p>
                        </div>
                    </div>
                    <div className="space-x-3">
                        <button
                            onClick={handlePrint}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                        >
                            In bảng điểm
                        </button>
                        <button
                            onClick={() => navigate('/teacher-dashboard/prepare-examination')}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Thống kê */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-blue-800">Tổng số sinh viên</h3>
                        <p className="text-2xl font-bold text-blue-900">{results.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-sm font-medium text-green-800">Đã hoàn thành</h3>
                        <p className="text-2xl font-bold text-green-900">{studentsWithResults.length}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h3 className="text-sm font-medium text-yellow-800">Chưa thi</h3>
                        <p className="text-2xl font-bold text-yellow-900">{studentsWithoutResults.length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-sm font-medium text-purple-800">Điểm trung bình</h3>
                        <p className="text-2xl font-bold text-purple-900">
                            {studentsWithResults.length > 0 
                                ? (studentsWithResults.reduce((sum, s) => sum + s.DIEM, 0) / studentsWithResults.length).toFixed(2)
                                : '--'
                            }
                        </p>
                    </div>
                </div>

                {/* Bảng điểm */}
                <div className="border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mã SV</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Họ và tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Điểm</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Xếp loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày thi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map((student, index) => (
                                    <tr key={student.MASV} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.MASV}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {`${student.HO?.trim() || ''} ${student.TEN?.trim() || ''}`.trim()}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getScoreColor(student.DIEM)}`}>
                                            {student.DIEM !== null ? student.DIEM.toFixed(2) : '--'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getScoreColor(student.DIEM)}`}>
                                            {getScoreLabel(student.DIEM)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {student.NGAYTHI ? new Date(student.NGAYTHI).toLocaleDateString() : '--'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal in bảng điểm */}
            {showPrintable && (
                <SimplePrintResults 
                    examData={examData}
                    onClose={handleClosePrint}
                />
            )}
        </>
    );
} 