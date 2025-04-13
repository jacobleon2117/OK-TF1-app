export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return '';
};

export const validatePassword = (password: string): string => {
  if (!password.trim()) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return '';
};

export const validateFullName = (name: string): string => {
  if (!name.trim()) {
    return 'Full name is required';
  }

  return '';
};

export const validateOrganizationCode = (code: string): string => {
  if (!code.trim()) {
    return 'Organization code is required';
  }

  if (code.length !== 6) {
    return 'Organization code must be 6 digits';
  }

  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword.trim()) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return '';
};
