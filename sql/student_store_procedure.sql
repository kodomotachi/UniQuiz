USE testing;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXemSinhVien')
	DROP PROCEDURE spXemSinhVien;
GO

CREATE PROCEDURE spXemSinhVien
AS
BEGIN
	SELECT * FROM Sinhvien;
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spThemSinhVien')
	DROP PROCEDURE spThemSinhVien;
GO
 
CREATE PROCEDURE spThemSinhVien
@MaSinhVien nchar(8),
@Ho nvarchar(10),
@Ten nvarchar (40),
@NgaySinh date,
@DiaChi nvarchar(100),
@MaLop nchar(8)
AS
BEGIN
	INSERT INTO Sinhvien(MASV, HO, TEN, NGAYSINH, DIACHI, MALOP)
    VALUES (@MaSinhVien, @Ho, @Ten, @NgaySinh, @DiaChi, @MaLop);
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXoaSinhVien')
	DROP PROCEDURE spXoaSinhVien;
GO

CREATE PROCEDURE spXoaSinhVien
@MaSinhVien nchar(8)
AS
BEGIN
	DELETE FROM Sinhvien
	WHERE MASV = @MaSinhVien;	
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spChinhSuaSinhVien')
	DROP PROCEDURE spChinhSuaSinhVien; 
GO

CREATE PROCEDURE spChinhSuaSinhVien
@MaSinhVienCu nchar(8),
@MaSinhVienMoi nchar(8),
@HoMoi nvarchar(10),
@TenMoi nvarchar(40),
@NgaySinhMoi date,
@DiaChiMoi nvarchar(100)
AS
BEGIN
	UPDATE Sinhvien
	SET MASV = @MaSinhVienMoi,
		HO = @HoMoi,
		TEN = @TenMoi,
		NGAYSINH = @NgaySinhMoi,
		DIACHI = @DiaChiMoi
	WHERE MASV = @MaSinhVienCu;
END;
GO