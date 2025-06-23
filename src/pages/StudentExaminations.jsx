import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function StudentExaminations() {
    const [examinations, setExaminations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentName, setStudentName] = useState('');
    const navigate = useNavigate();

    // Lấy MASV từ token
    const getStudentId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch {
            return null;
        }
    };

    // Format ngày giờ hiển thị đẹp hơn
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Kiểm tra trạng thái phiên thi
    const getExamStatus = (exam) => {
        const now = new Date();
        const startTime = new Date(exam.NGAYTHI);
        const endTime = new Date(exam.NGAYKETTHUC || new Date(startTime.getTime() + exam.THOIGIAN * 60000));
        
        // Nếu đã thi rồi (có điểm trong database)
        if (exam.DA_THI !== null && exam.DA_THI !== undefined) {
            return 'completed'; // Đã hoàn thành
        }
        
        if (now < startTime) {
            return 'upcoming'; // Chưa đến giờ
        } else if (now >= startTime && now <= endTime) {
            return 'active'; // Đang diễn ra
        } else {
            return 'finished'; // Đã kết thúc
        }
    };

    // Kiểm tra xem có thể vào thi không
    const canStartExam = (exam) => {
        const status = getExamStatus(exam);
        return status === 'active';
    };

    // Xử lý bắt đầu thi
    const handleStartExam = (exam) => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('Không thể xác định thông tin sinh viên');
            return;
        }

        // Chuyển đến trang thi với thông tin exam
        navigate('/exam', {
            state: {
                studentId,
                exam: {
                    MAMH: exam.MAMH,
                    MALOP: exam.MALOP,
                    LAN: exam.LAN,
                    TRINHDO: exam.TRINHDO,
                    THOIGIAN: exam.THOIGIAN,
                    SOCAUTHI: exam.SOCAUTHI,
                    TENMON: exam.TENMON
                }
            }
        });
    };

    // Lấy tên sinh viên từ localStorage hoặc API
    const fetchStudentName = async (studentId) => {
        // Kiểm tra trong localStorage trước
        const storedName = localStorage.getItem('fullName');
        if (storedName) {
            setStudentName(storedName);
            return;
        }

        // Nếu không có trong localStorage, gọi API
        try {
            const response = await fetch(`http://localhost:3000/student/fullname/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setStudentName(data.fullName);
                localStorage.setItem('fullName', data.fullName);
            }
        } catch (err) {
            console.error('Error fetching student name:', err);
        }
    };

    useEffect(() => {
        const fetchExaminations = async () => {
            setLoading(true);
            setError(null);
            const studentId = getStudentId();
            if (!studentId) {
                setError('Cannot identify student.');
                setLoading(false);
                return;
            }

            // Lấy tên sinh viên
            await fetchStudentName(studentId);

            try {
                const response = await fetch(`http://localhost:3000/examination/upcoming/${studentId}`);
                if (!response.ok) throw new Error('Failed to fetch examinations');
                const data = await response.json();
                setExaminations(data);
            } catch (err) {
                console.error('Error fetching examinations:', err);
                setError('Failed to load examinations.');
            } finally {
                setLoading(false);
            }
        };
        fetchExaminations();

        // Auto refresh mỗi 30 giây để cập nhật trạng thái
        const interval = setInterval(fetchExaminations, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="flex flex-col items-center mt-8 mx-10">
                {/* Header với thông tin sinh viên */}
                <div className="w-full max-w-7xl mb-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Phiên Thi Của Tôi</h1>
                        {studentName && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Sinh viên:</span>
                                <span className="font-semibold text-blue-600">{studentName}</span>
                                <span className="text-gray-500">({getStudentId()})</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bảng danh sách phiên thi */}
                <div className="w-full max-w-7xl border border-gray-200 overflow-hidden rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Các Phiên Thi Sắp Tới</h2>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Môn Học</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Lớp</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trình Độ</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày Thi</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Lần</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Thời Gian</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Số Câu</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="8" className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2">Đang tải...</span>
                                        </div>
                                    </td></tr>
                                ) : error ? (
                                    <tr><td colSpan="8" className="text-center py-8 text-red-500">{error}</td></tr>
                                ) : examinations.length > 0 ? (
                                    examinations.map((exam, idx) => {
                                        const status = getExamStatus(exam);
                                        const canStart = canStartExam(exam);
                                        
                                        const getButtonConfig = (status, score) => {
                                            switch (status) {
                                                case 'upcoming':
                                                    return {
                                                        text: 'Chưa đến giờ',
                                                        className: 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60',
                                                        disabled: true,
                                                        title: 'Chưa đến thời gian thi'
                                                    };
                                                case 'active':
                                                    return {
                                                        text: 'Vào thi ngay',
                                                        className: 'bg-green-500 hover:bg-green-600 text-white cursor-pointer shadow-md hover:shadow-lg animate-pulse',
                                                        disabled: false,
                                                        title: 'Phiên thi đang diễn ra - Vào thi ngay!'
                                                    };
                                                case 'completed':
                                                    return {
                                                        text: `Đã thi (${score?.toFixed(1) || '0.0'})`,
                                                        className: 'bg-blue-500 text-white cursor-not-allowed opacity-80',
                                                        disabled: true,
                                                        title: `Bạn đã hoàn thành bài thi này với điểm ${score?.toFixed(1) || '0.0'}`
                                                    };
                                                default:
                                                    return {
                                                        text: 'Đã kết thúc',
                                                        className: 'bg-red-400 text-white cursor-not-allowed opacity-60',
                                                        disabled: true,
                                                        title: 'Phiên thi đã kết thúc'
                                                    };
                                            }
                                        };
                                        
                                        const buttonConfig = getButtonConfig(status, exam.DA_THI);
                                        
                                        return (
                                            <tr key={`${exam.MAMH}-${exam.MALOP}-${exam.LAN}-${idx}`} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{exam.TENMON || exam.MAMH}</div>
                                                    <div className="text-sm text-gray-500">({exam.MAMH})</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.MALOP}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.TRINHDO}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div>{formatDateTime(exam.NGAYTHI)}</div>
                                                    {status === 'active' && (
                                                        <div className="text-xs text-green-600 font-medium">🔴 Đang diễn ra</div>
                                                    )}
                                                    {status === 'upcoming' && (
                                                        <div className="text-xs text-blue-600 font-medium">⏰ Sắp diễn ra</div>
                                                    )}
                                                    {status === 'completed' && (
                                                        <div className="text-xs text-blue-600 font-medium">✅ Đã hoàn thành</div>
                                                    )}
                                                    {status === 'finished' && (
                                                        <div className="text-xs text-red-600 font-medium">❌ Đã kết thúc</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Lần {exam.LAN}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.THOIGIAN} phút</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exam.SOCAUTHI} câu</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleStartExam(exam)}
                                                        disabled={buttonConfig.disabled}
                                                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${buttonConfig.className}`}
                                                        title={buttonConfig.title}
                                                    >
                                                        {buttonConfig.text}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="8" className="text-center py-8 text-gray-500">Không có phiên thi nào sắp tới.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 