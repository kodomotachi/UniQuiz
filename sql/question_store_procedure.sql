USE testing;
GO

-- Lấy danh sách câu hỏi theo môn học
CREATE PROCEDURE sp_GetQuestionsBySubject
    @MAMH NCHAR(5)
AS
BEGIN
    SELECT CAUHOI, MAMH, TRINHDO, NOIDUNG, A, B, C, D, DAP_AN, MAGV
    FROM Bode
    WHERE MAMH = @MAMH;
END
GO

-- Thêm câu hỏi mới
CREATE PROCEDURE sp_AddQuestion
    @MAMH NCHAR(5),
    @TRINHDO NCHAR(1),
    @NOIDUNG NVARCHAR(200),
    @A NVARCHAR(50),
    @B NVARCHAR(50),
    @C NVARCHAR(50),
    @D NVARCHAR(50),
    @DAP_AN NCHAR(1),
    @MAGV NCHAR(8)
AS
BEGIN
    INSERT INTO Bode (MAMH, TRINHDO, NOIDUNG, A, B, C, D, DAP_AN, MAGV)
    VALUES (@MAMH, @TRINHDO, @NOIDUNG, @A, @B, @C, @D, @DAP_AN, @MAGV);
    SELECT SCOPE_IDENTITY() AS NewQuestionID;
END
GO

-- Sửa câu hỏi
CREATE PROCEDURE sp_EditQuestion
    @CAUHOI INT,
    @MAMH NCHAR(5),
    @TRINHDO NCHAR(1),
    @NOIDUNG NVARCHAR(200),
    @A NVARCHAR(50),
    @B NVARCHAR(50),
    @C NVARCHAR(50),
    @D NVARCHAR(50),
    @DAP_AN NCHAR(1)
AS
BEGIN
    UPDATE Bode
    SET
        MAMH = @MAMH,
        TRINHDO = @TRINHDO,
        NOIDUNG = @NOIDUNG,
        A = @A,
        B = @B,
        C = @C,
        D = @D,
        DAP_AN = @DAP_AN
    WHERE CAUHOI = @CAUHOI;
END
GO

-- Xóa câu hỏi
CREATE PROCEDURE sp_DeleteQuestion
    @CAUHOI INT
AS
BEGIN
    DELETE FROM Bode
    WHERE CAUHOI = @CAUHOI;
END
GO 