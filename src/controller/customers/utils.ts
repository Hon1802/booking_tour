export const isValidDate = (day: number, month: number, year: number): boolean => {
    const date = new Date(year, month - 1, day); // Month is 0-indexed, so subtract 1
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }
export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/; // Định dạng số điện thoại Việt Nam
    return phoneRegex.test(phone);
  }
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
