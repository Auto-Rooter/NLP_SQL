import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // the higher the number the more secure, but it will take longer to verify

export async function hashPassword(password: string): Promise<string>{
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}