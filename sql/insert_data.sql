-- Insert data into Lop table
INSERT INTO Lop (MALOP, TENLOP)
VALUES 
    ('L01', N'Lớp Công nghệ thông tin 1'),
    ('L02', N'Lớp Công nghệ thông tin 2'),
    ('L03', N'Lớp Kỹ thuật phần mềm 1'),
    ('L04', N'Lớp Kỹ thuật phần mềm 2'),
    ('L05', N'Lớp Hệ thống thông tin 1');

-- Insert data into Monhoc table
INSERT INTO Monhoc (MAMH, TENMH)
VALUES 
    ('CS101', N'Cơ sở dữ liệu'),
    ('CS102', N'Lập trình Java'),
    ('CS103', N'Lập trình Web'),
    ('CS104', N'Mạng máy tính'),
    ('CS105', N'Trí tuệ nhân tạo');

-- Insert data into Sinhvien table
INSERT INTO Sinhvien (MASV, HO, TEN, NGAYSINH, DIACHI, MALOP)
VALUES 
    ('SV001', N'Nguyễn', N'Văn A', '2000-01-15', N'123 Đường ABC, Quận 1, TP.HCM', 'L01'),
    ('SV002', N'Trần', N'Thị B', '2000-03-20', N'456 Đường XYZ, Quận 2, TP.HCM', 'L01'),
    ('SV003', N'Lê', N'Văn C', '2000-05-10', N'789 Đường DEF, Quận 3, TP.HCM', 'L02'),
    ('SV004', N'Phạm', N'Thị D', '2000-07-25', N'321 Đường GHI, Quận 4, TP.HCM', 'L02'),
    ('SV005', N'Hoàng', N'Văn E', '2000-09-30', N'654 Đường JKL, Quận 5, TP.HCM', 'L03');

-- Insert data into Giaovien table
INSERT INTO Giaovien (MAGV, HO, TEN, SODTLL, DIACHI)
VALUES 
    ('GV001', N'Nguyễn', N'Văn X', '0123456789', N'123 Đường ABC, Quận 1, TP.HCM'),
    ('GV002', N'Trần', N'Thị Y', '0987654321', N'456 Đường XYZ, Quận 2, TP.HCM'),
    ('GV003', N'Lê', N'Văn Z', '0123987456', N'789 Đường DEF, Quận 3, TP.HCM'),
    ('GV004', N'Phạm', N'Thị W', '0987456321', N'321 Đường GHI, Quận 4, TP.HCM'),
    ('GV005', N'Hoàng', N'Văn V', '0123654789', N'654 Đường JKL, Quận 5, TP.HCM');

-- Insert data into Giaovien_Dangky table
INSERT INTO Giaovien_Dangky (MAGV, MALOP, MAMH, TRINHDO, NGAYTHI, LAN, SOCAUTHI, THOIGIAN)
VALUES 
    ('GV001', 'L01', 'CS101', 'A', '2024-03-15 08:00:00', 1, 20, 30),
    ('GV002', 'L02', 'CS102', 'B', '2024-03-15 13:00:00', 1, 25, 45),
    ('GV003', 'L03', 'CS103', 'C', '2024-03-16 08:00:00', 1, 30, 60),
    ('GV004', 'L04', 'CS104', 'A', '2024-03-16 13:00:00', 1, 20, 30),
    ('GV005', 'L05', 'CS105', 'B', '2024-03-17 08:00:00', 1, 25, 45);

-- Insert data into Bode table
INSERT INTO Bode (MAMH, TRINHDO, NOIDUNG, A, B, C, D, DAP_AN, MAGV)
VALUES 
    ('CS101', 'A', N'SQL là viết tắt của?', N'Structured Query Language', N'Simple Query Language', N'Standard Query Language', N'System Query Language', 'A', 'GV001'),
    ('CS101', 'B', N'Khóa chính trong SQL là gì?', N'Là khóa duy nhất xác định một bản ghi', N'Là khóa có thể trùng lặp', N'Là khóa không bắt buộc', N'Là khóa tạm thời', 'A', 'GV001'),
    ('CS102', 'A', N'Java là ngôn ngữ lập trình?', N'Hướng đối tượng', N'Thủ tục', N'Chức năng', N'Logic', 'A', 'GV002'),
    ('CS103', 'B', N'HTML là viết tắt của?', N'Hyper Text Markup Language', N'High Tech Modern Language', N'Hyper Transfer Markup Language', N'Hyper Text Modern Language', 'A', 'GV003'),
    ('CS104', 'C', N'Giao thức HTTP sử dụng cổng mặc định là?', N'80', N'443', N'8080', N'21', 'A', 'GV004');

-- Insert data into BangDiem table
INSERT INTO BangDiem (MASV, MAMH, LAN, NGAYTHI, DIEM)
VALUES 
    ('SV001', 'CS101', 1, '2024-03-15', 8.5),
    ('SV002', 'CS101', 1, '2024-03-15', 7.5),
    ('SV003', 'CS102', 1, '2024-03-15', 9.0),
    ('SV004', 'CS102', 1, '2024-03-15', 8.0),
    ('SV005', 'CS103', 1, '2024-03-16', 7.0); 