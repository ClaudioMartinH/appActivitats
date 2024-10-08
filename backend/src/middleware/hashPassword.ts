import bcrypt from "bcryptjs";

export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10); // Genera un salt
  const hashedPassword = await bcrypt.hash(password, salt); // Hashea la contraseña
  return hashedPassword;
};
