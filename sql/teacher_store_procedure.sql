USE testing;
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
END;Add commentMore actions
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