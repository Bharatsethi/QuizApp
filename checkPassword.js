const bcrypt = require('bcryptjs');

const plainPassword = 'PoojaBharat';
const hashedPassword = bcrypt.hashSync(plainPassword, 10);

console.log('Hashed password:', hashedPassword);

bcrypt.compare(plainPassword, '$2a$10$/t/QyUSaCqjQ5aLApYSPwurrBCKYZBFNj/Q1KdiwVFj7GVxbVBAZy', (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    if (result) {
      console.log('Password matches');
    } else {
      console.log('Password does not match');
    }
  }
});
