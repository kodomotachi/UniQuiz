-- Stored Procedure to get all examinations
CREATE PROCEDURE sp_GetExaminations
AS
BEGIN
    SELECT * FROM Giaovien_Dangky;
END
GO

-- Stored Procedure to add a new examination
CREATE PROCEDURE sp_AddExamination
    @MAGV NCHAR(8),
    @MALOP NCHAR(8),
    @MAMH NCHAR(5),
    @TRINHDO NCHAR(1),
    @NGAYTHI DATETIME,
    @LAN SMALLINT,
    @SOCAUTHI SMALLINT,
    @THOIGIAN SMALLINT
AS
BEGIN
    INSERT INTO Giaovien_Dangky (MAGV, MALOP, MAMH, TRINHDO, NGAYTHI, LAN, SOCAUTHI, THOIGIAN)
    VALUES (@MAGV, @MALOP, @MAMH, @TRINHDO, @NGAYTHI, @LAN, @SOCAUTHI, @THOIGIAN);
END
GO

-- Stored Procedure to edit an existing examination
CREATE PROCEDURE sp_EditExamination
    @MALOP NCHAR(8),
    @MAMH NCHAR(5),
    @LAN SMALLINT,
    @TRINHDO NCHAR(1),
    @NGAYTHI DATETIME,
    @SOCAUTHI SMALLINT,
    @THOIGIAN SMALLINT
AS
BEGIN
    UPDATE Giaovien_Dangky 
    SET 
        TRINHDO = @TRINHDO, 
        NGAYTHI = @NGAYTHI, 
        SOCAUTHI = @SOCAUTHI, 
        THOIGIAN = @THOIGIAN
    WHERE 
        MALOP = @MALOP AND 
        MAMH = @MAMH AND 
        LAN = @LAN;
END
GO

-- Stored Procedure to delete an examination
CREATE PROCEDURE sp_DeleteExamination
    @MALOP NCHAR(8),
    @MAMH NCHAR(5),
    @LAN SMALLINT
AS
BEGIN
    DELETE FROM Giaovien_Dangky 
    WHERE 
        MALOP = @MALOP AND 
        MAMH = @MAMH AND 
        LAN = @LAN;
END
GO 