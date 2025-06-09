USE testing;
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

-- EXEC spThemLopHoc @MaLop = 'L10', @TenLop = N'Lớp lập trình thi đấu';
-- GO

CREATE PROCEDURE spThemMonHoc
@MaMH nchar(5),
@TenMH nvarchar(40)
AS
BEGIN
    INSERT INTO Monhoc(MAMH, TENMH)
    VALUES (@MaMH, @TenMH);
END;
GO

CREATE PROCEDURE spXoaMonHoc
@MaMH nchar(5)
AS
BEGIN
    DELETE FROM Monhoc
    WHERE MAMH = @MaMH;
END;
GO

CREATE PROCEDURE spXoaLopHoc
@MaLop nchar(8)
AS 
BEGIN
    DELETE FROM Lop 
    WHERE MALOP = @MaLop;
END;

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

CREATE PROCEDURE spChinhsuaMonHoc
@MaMonCu nchar(5),
@MaMonMoi nchar(5),
@TenMonMoi nvarchar(40)
AS
BEGIN
    UPDATE Monhoc
    SET MAMH = @MaMonMoi,
        TENMH = @TenMonMoi
    WHERE MAMH = @MaMonCu
END;
GO

