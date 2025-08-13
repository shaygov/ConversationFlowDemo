export const getInitials = (name: string = '') => {
  return name
    .split(' ')
    .map((n, i) => i > 1 ? '' : (Array.from(n)[0] || '').toUpperCase())
    .join('');
};

export const errorHandler = (error: any, defaultErrorMessage: string = 'Unknown error!') => {
  let result = defaultErrorMessage;

  try {
    const errorObj = JSON.parse(error.message);

    if (errorObj.message) {
      result = errorObj.message;
    } else if (errorObj.errors) {
      result = errorObj.errors.map((item: any) => item?.message || '').join(', ');
    }
  } catch (err) {
    if (typeof error?.message === 'string') {
      result = error.message;
    }
  }

  return result;
}

export function isValidEmail(email: string = ''): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
  return emailRegex.test(email); // Returns true if valid, false otherwise
}
