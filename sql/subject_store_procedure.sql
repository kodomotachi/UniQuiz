USE testing;
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