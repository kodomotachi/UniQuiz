import React from 'react';

export default function PrintableExamResults({ examData, onClose }) {
    const handlePrint = () => {
        window.print();
    };

    if (!examData) return null;

    const { examInfo, results } = examData;

    const getGradeText = (score) => {
        if (score === null || score === undefined) return '';
        if (score >= 9) return 'Xuất sắc';
        if (score >= 8) return 'Giỏi';
        if (score >= 6.5) return 'Khá';
        if (score >= 5) return 'Trung bình';
        return 'Yếu';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-xl overflow-hidden">
                <div className="p-4 bg-gray-50 border-b print:hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Bảng điểm phiên thi</h2>
                        <div className="space-x-3">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                            >
                                In
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 max-h-screen overflow-y-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-lg font-bold mb-2">8. Bảng điểm môn học</h1>
                        <p className="text-sm text-gray-700 mb-4">
                            Giáo viên chọn tên lớp, tên môn học, lần thi, chương trình số in ra bảng điểm thi hết môn của lớp đã chọn. 
                            Mẫu in: thực hiện giống như của trường (STT_MASV_HO_TEN_DIEM_DIEM_CHU)
                        </p>
                    </div>

                    <div className="mb-6">
                        <table className="w-full border border-gray-400 text-sm">
                            <tbody>
                                <tr>
                                    <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold w-1/4">Lớp:</td>
                                    <td className="border border-gray-400 px-3 py-2">
                                        {examInfo.TENLOP || examInfo.MALOP}
                                    </td>
                                    <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold w-1/4">Môn học:</td>
                                    <td className="border border-gray-400 px-3 py-2">
                                        {examInfo.TENMH || examInfo.MAMH}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold">Lần thi:</td>
                                    <td className="border border-gray-400 px-3 py-2">
                                        {examInfo.LAN}
                                    </td>
                                    <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold">Trình độ:</td>
                                    <td className="border border-gray-400 px-3 py-2">
                                        {examInfo.TRINHDO}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold">Ngày thi:</td>
                                    <td className="border border-gray-400 px-3 py-2">
                                        {new Date(examInfo.NGAYTHI).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="border border-gray-400 px-3 py-2 bg-gray-100 font-semibold">Thời gian:</td>
                                    <td className="border border-gray-400 px-3 py-2">
                                        {examInfo.THOIGIAN} phút
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6">
                        <table className="w-full border border-gray-400 text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-400 px-3 py-2 text-center font-bold">STT</th>
                                    <th className="border border-gray-400 px-3 py-2 text-center font-bold">MASV</th>
                                    <th className="border border-gray-400 px-3 py-2 text-center font-bold">HỌ</th>
                                    <th className="border border-gray-400 px-3 py-2 text-center font-bold">TÊN</th>
                                    <th className="border border-gray-400 px-3 py-2 text-center font-bold">ĐIỂM</th>
                                    <th className="border border-gray-400 px-3 py-2 text-center font-bold">ĐIỂM CHỮ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((student, index) => (
                                    <tr key={student.MASV}>
                                        <td className="border border-gray-400 px-3 py-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-400 px-3 py-2 text-center">{student.MASV}</td>
                                        <td className="border border-gray-400 px-3 py-2">{student.HO?.trim() || ''}</td>
                                        <td className="border border-gray-400 px-3 py-2">{student.TEN?.trim() || ''}</td>
                                        <td className="border border-gray-400 px-3 py-2 text-center">
                                            {student.DIEM !== null ? student.DIEM.toFixed(2) : ''}
                                        </td>
                                        <td className="border border-gray-400 px-3 py-2 text-center">
                                            {getGradeText(student.DIEM)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-8 text-sm">
                            <div>
                                <h3 className="font-semibold mb-2">Thống kê kết quả:</h3>
                                <div className="space-y-1">
                                    <p>• Tổng số sinh viên: <strong>{results.length}</strong></p>
                                    <p>• Số sinh viên đã thi: <strong>{results.filter(s => s.DIEM !== null).length}</strong></p>
                                    <p>• Số sinh viên chưa thi: <strong>{results.filter(s => s.DIEM === null).length}</strong></p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold mb-2">Phân loại điểm:</h3>
                                <div className="space-y-1">
                                    <p>• Xuất sắc (9.0-10): <strong>{results.filter(s => s.DIEM >= 9).length}</strong></p>
                                    <p>• Giỏi (8.0-8.9): <strong>{results.filter(s => s.DIEM >= 8 && s.DIEM < 9).length}</strong></p>
                                    <p>• Khá (6.5-7.9): <strong>{results.filter(s => s.DIEM >= 6.5 && s.DIEM < 8).length}</strong></p>
                                    <p>• Trung bình (5.0-6.4): <strong>{results.filter(s => s.DIEM >= 5 && s.DIEM < 6.5).length}</strong></p>
                                    <p>• Yếu (dưới 5.0): <strong>{results.filter(s => s.DIEM !== null && s.DIEM < 5).length}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between text-sm">
                        <div className="text-center">
                            <p className="mb-12">Giáo viên</p>
                            <p className="border-t border-gray-400 pt-1 inline-block min-w-[150px]">(Ký tên)</p>
                        </div>
                        <div className="text-center">
                            <p className="mb-12">Ngày....tháng....năm.....</p>
                            <p>Hiệu trưởng</p>
                            <p className="border-t border-gray-400 pt-1 inline-block min-w-[150px] mt-8">(Ký tên và đóng dấu)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 