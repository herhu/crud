// generate-keys.ts

import * as elliptic from 'elliptic';

const ec = new elliptic.ec('curve25519');

const keyPair = ec.genKeyPair();
const privateKey = keyPair.getPrivate('hex');
const publicKey = keyPair.getPublic('hex');

console.log(`Private Key: ${privateKey}`);
console.log(`Public Key: ${publicKey}`);
