USE testing;
GO

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

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'spXoaLopHoc')
    DROP PROCEDURE spXoaLopHoc;
GO

CREATE PROCEDURE spXoaLopHoc
@MaLop nchar(8)
AS 
BEGIN
    -- First, delete referencing records from Giaovien_Dangky
    DELETE FROM Giaovien_Dangky
    WHERE MALOP = @MaLop;

    -- Second, delete referencing records from Sinhvien
    DELETE FROM Sinhvien
    WHERE MALOP = @MaLop;

    -- Finally, delete the class itself
    DELETE FROM Lop 
    WHERE MALOP = @MaLop;
END;
GO

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