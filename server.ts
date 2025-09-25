import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MONGO_URI tidak ditemukan di file .env');
    process.exit(1);
}

// Menggunakan async/await untuk koneksi agar lebih mudah dibaca
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Berhasil terhubung ke MongoDB');
    } catch (err) {
        console.error('Koneksi MongoDB gagal:', err);
        process.exit(1); // Keluar dari aplikasi jika koneksi gagal
    }
};

connectDB(); // Panggil fungsi untuk koneksi

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Endpoint Registrasi
app.post('/api/register', async (req: Request, res: Response) => {
    const { newUsername, newPassword } = req.body;
    try {
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(409).json({ message: 'Username sudah digunakan!' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        const newUser = new User({ username: newUsername, passwordHash });
        await newUser.save();

        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registrasi gagal, terjadi kesalahan server.' });
    }
});

// Endpoint Login
app.post('/api/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
        if (isMatch) {
            res.status(200).json({ message: 'Login berhasil!', username: foundUser.username });
        } else {
            res.status(401).json({ message: 'Username atau password salah!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login gagal, terjadi kesalahan server.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});