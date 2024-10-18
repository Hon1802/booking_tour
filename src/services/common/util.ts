export function generateOTP(length: number = 6): string {
    let otp = '';
    const digits = '0123456789'; 
  
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
  
    return otp;
}

// 
export function generateUrlImage(images: string | '') {
  if(!images)
  {
    return
  }
  return images.split(",").map((url: string) => ({
    urlImage: url.trim()
  }));
}
export function generateUrlArrayImage(images: string[] | '') {
  if(!images)
  {
    return
  }
  // console.log(images)
  return images.map((url: string) => ({
    urlImage: url.trim()
  }));
}