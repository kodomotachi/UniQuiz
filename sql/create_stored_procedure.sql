USE testing;
GO

-- Xóa và tạo lại spThemLopHoc
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spThemLopHoc')
    DROP PROCEDURE spThemLopHoc;
GO

CREATE PROCEDURE spThemLopHoc
@MaLop nchar(8),
@TenLop nvarchar(40)
AS
BEGIN
    INSERT INTO Lop(MALOP, TENLOP)
    VALUES (@MaLop, @TenLop);
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXemMonHoc')
	DROP PROCEDURE spXemMonHoc;
GO

CREATE PROCEDURE spXemMonHoc
AS
BEGIN
	SELECT * FROM Monhoc;
END;
GO

-- Xóa và tạo lại spThemMonHoc
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spThemMonHoc')
    DROP PROCEDURE spThemMonHoc;
GO

CREATE PROCEDURE spThemMonHoc
@MaMHMoi nchar(5),
@TenMHMoi nvarchar(40)
AS
BEGIN
    INSERT INTO Monhoc(MAMH, TENMH)
    VALUES (@MaMHMoi, @TenMHMoi);
END;
GO

-- Xóa và tạo lại spXoaMonHoc
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXoaMonHoc')
    DROP PROCEDURE spXoaMonHoc;
GO

CREATE PROCEDURE spXoaMonHoc
@MaMH nchar(5)
AS
BEGIN
    DELETE FROM Monhoc
    WHERE MAMH = @MaMH;
END;
GO

-- Xóa và tạo lại spXoaLopHoc
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXoaLopHoc')
    DROP PROCEDURE spXoaLopHoc;
GO

CREATE PROCEDURE spXoaLopHoc
@MaLop nchar(8)
AS 
BEGIN
    DELETE FROM Lop 
    WHERE MALOP = @MaLop;
END;
GO

-- Xóa và tạo lại spChinhsuaLopHoc
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spChinhsuaLopHoc')
    DROP PROCEDURE spChinhsuaLopHoc;
GO

CREATE PROCEDURE spChinhsuaLopHoc
@MaLopCu nchar(8),
@MaLopMoi nchar(8),
@TenLopMoi nvarchar(40)
AS
BEGIN
    UPDATE Lop
    SET MALOP = @MaLopMoi,
        TENLOP = @TenLopMoi
    WHERE MALOP = @MaLopCu;
END;
GO

-- Xóa và tạo lại spChinhsuaMonHoc
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spChinhsuaMonHoc')
    DROP PROCEDURE spChinhsuaMonHoc;
GO

CREATE PROCEDURE spChinhsuaMonHoc
@MaMonCu nchar(5),
@MaMonMoi nchar(5),
@TenMonMoi nvarchar(40)
AS
BEGIN
    UPDATE Monhoc
    SET MAMH = @MaMonMoi,
        TENMH = @TenMonMoi
    WHERE MAMH = @MaMonCu;
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXemGiaoVien')
    DROP PROCEDURE spXemGiaoVien;
GO

CREATE PROCEDURE spXemGiaoVien
AS 
BEGIN
	SELECT * FROM Giaovien;
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spThemGiaoVien')
	DROP PROCEDURE spThemGiaoVien;
GO

CREATE PROCEDURE spThemGiaoVien
@MaGVMoi nchar(8),
@HoMoi nchar(8),
@TenMoi nvarchar(10),
@SoDTLLMoi nchar(15),
@DiaChiMoi nvarchar(50)
AS
BEGIN
	INSERT INTO Giaovien(MAGV, HO, TEN, SODTLL, DIACHI)
	VALUES (@MaGVMoi, @HoMoi, @TenMoi, @SoDTLLMoi, @DiaChiMoi);
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spChinhsuaGiaoVien')
	DROP PROCEDURE spChinhsuaGiaoVien;
GO

CREATE PROCEDURE spChinhsuaGiaoVien
@MaGVCu nchar(8),
@MaGVMoi nchar(8),
@HoMoi nvarchar(10),
@TenMoi nvarchar(40),
@SoDTLLMoi nchar(15),
@DiaChiMoi nvarchar(50)
AS
BEGIN
	UPDATE Giaovien
	SET MAGV = @MaGVMoi,
		HO = @HoMoi,
		TEN = @TenMoi,
		SODTLL = @SoDTLLMoi,
		DIACHI = @DiaChiMoi
	WHERE MAGV = @MaGVCu;
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXoaGiaoVien')
	DROP PROCEDURE spXoaGiaoVien;
GO

CREATE PROCEDURE spXoaGiaoVien
@MaGV nchar(8)
AS 
BEGIN
	DELETE FROM Giaovien
	WHERE MAGV = @MaGV;
END;
GO