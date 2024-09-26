export function generatePassword(length: number = 12): string {
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%^&*()_+{}[]|:;<>,.?/";
    const numbers = "0123456789"
    const allChars = lowerCaseChars + upperCaseChars + specialChars + numbers;

    let password = "";

     // Ensure at least one character from each category
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    // console.log(password)
    // return password;
    return password.split('').sort(() => Math.random() - 0.5).join('');
}
