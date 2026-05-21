import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const payload = { id: 'SOME_USER_ID' };
const secret = process.env.JWT_SECRET || 'testsecret';
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log(token);