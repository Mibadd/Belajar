import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
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

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Berhasil terhubung ke MongoDB');
    } catch (err) {
        console.error('Koneksi MongoDB gagal:', err);
        process.exit(1);
    }
};

connectDB();

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Endpoint Registrasi (Tidak ada perubahan di sini)
app.post('/api/register', async (req: Request, res: Response) => {
    const { newUsername, newPassword } = req.body;
    try {
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password tidak boleh kosong dan minimal harus 8 karakter.'
            });
        }
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan!'
            });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        const newUser = new User({ username: newUsername, passwordHash });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Registrasi gagal, terjadi kesalahan server.'
        });
    }
});

// Endpoint Login
app.post('/api/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah!'
            });
        }

        const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
        if (isMatch) {
            // --- PERUBAHAN UTAMA: Membuat JWT ---
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET tidak ditemukan di file .env');
            }

            // Buat token yang berisi ID pengguna dan berlaku selama 1 jam
            const token = jwt.sign(
                { userId: foundUser._id },
                jwtSecret,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                success: true,
                message: 'Login berhasil!',
                data: {
                    username: foundUser.username,
                    token: token // <-- 2. Kirim token ke frontend
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Username atau password salah!'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Login gagal, terjadi kesalahan server.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});