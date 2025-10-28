import * as bcrypt from 'bcryptjs';

export const verifyPassword = async (password: string, checkPassword: string) => {
  try {
    const data = await bcrypt.compare(password, checkPassword);
   if (!data) throw 'invalid password';
    return true
  } catch (error) {
    return false;
  }
};

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const data = await bcrypt.hash(password, salt);
    return { data };
  } catch (error) {
    return { error };
  }
};
