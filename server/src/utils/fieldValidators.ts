export const passwordIsValid = (password: string): boolean => password.length >= 6;

export const emailIsValid = (email: string): boolean => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export const usernameIsValid = (username: string): boolean => /^[A-z_\d]{1,10}$/.test(username);
