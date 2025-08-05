const { User } = require('../models');
const bcrypt = require('bcryptjs');

(async () => {
  const exist = await User.findOne({ where: { email: 'admin@campus.com' } });
  if (!exist) {
    await User.create({
      name: 'Admin User',
      email: 'admin@campus.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });
    console.log('Admin created');
  }
})();
