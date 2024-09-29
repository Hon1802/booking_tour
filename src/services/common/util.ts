export function generateOTP(length: number = 6): string {
    let otp = '';
    const digits = '0123456789'; 
  
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
  
    return otp;
}