const fs = require('fs');
/** // run to get private key and public key
import crypto from 'crypto';
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
});

// console.log('Private Key:', privateKey);
// console.log('Public Key:', publicKey);

const privateKeyPath = 'private_key.pem';
const publicKeyPath = 'public_key.pem';

fs.writeFileSync(privateKeyPath, privateKey);
fs.writeFileSync(publicKeyPath, publicKey);

// console.log(`Private key saved to ${privateKeyPath}`);
// console.log(`Public key saved to ${publicKeyPath}`);
*/

// read key

// const privateKeyPath = './src/auth/private_key.pem';

// const publicKeyPath = './src/auth/public_key.pem';


// export const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
// export const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

// console.log('Private Key:', privateKey);
// console.log('Public Key:', publicKey);