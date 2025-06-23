const bcrypt = require('bcrypt');
const saltRounds = 10;

const teacherAccounts = [
  { username: 'admin', password: 'admin' },
  { username: 'GV001', password: 'gv001' },
  { username: 'GV002', password: 'gv002' },
  { username: 'GV003', password: 'gv003' },
  { username: 'GV004', password: 'gv004' },
  { username: 'GV005', password: 'gv005' },
];

const studentAccounts = [
  { username: 'SV0004', password: '27022004' },
  { username: 'SV005', password: '30092000' },
];

async function main() {
  console.log('--- Taikhoan_Giaovien ---');
  for (const acc of teacherAccounts) {
    const hash = await bcrypt.hash(acc.password, saltRounds);
    console.log(`INSERT INTO Taikhoan_Giaovien (MAGV, MATKHAU) VALUES ('${acc.username}', '${hash}');`);
  }
  console.log('\n--- Taikhoan_Sinhvien ---');
  for (const acc of studentAccounts) {
    const hash = await bcrypt.hash(acc.password, saltRounds);
    console.log(`INSERT INTO Taikhoan_Sinhvien (MASV, MATKHAU) VALUES ('${acc.username}', '${hash}');`);
  }
}

main(); 