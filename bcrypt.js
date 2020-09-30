const bcrypt = require("bcrypt");
const saltRound = 10;

module.exports = {
  encrypt: async (password) => {
    try {
      const salt = await bcrypt.genSalt(saltRound);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (erorr) {
      return erorr;
    }
  },
  comparePassword: (plainPassword, encryptPassword) => {
    return bcrypt.compare(plainPassword, encryptPassword);
  },
};
