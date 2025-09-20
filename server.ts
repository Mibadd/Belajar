import express from 'express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- DATABASE PENGGUNA SEMENTARA DI SISI SERVER ---
interface User {
    username: string;
    passwordHash: string;
}
const users: User[] = [];

// --- ENDPOINT REGISTRASI ---
app.post('/api/register', async (req: Request, res: Response) => {
    // ... sisa kode Anda tidak perlu diubah
    const { newUsername, newPassword } = req.body;
    try {
        if (users.find(user => user.username === newUsername)) {
            return res.status(409).json({ message: 'Username sudah digunakan!' });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        users.push({ username: newUsername, passwordHash });
        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (error) {
        res.status(500).json({ message: 'Registrasi gagal!' });
    }
});

// --- ENDPOINT LOGIN ---
app.post('/api/login', async (req: Request, res: Response) => {
    // ... sisa kode Anda tidak perlu diubah
    const { username, password } = req.body;
    const foundUser = users.find(user => user.username === username);

    if (!foundUser) {
        return res.status(401).json({ message: 'Username atau password salah!' });
    }
    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);

    if (isMatch) {
        res.status(200).json({ message: 'Login berhasil!', username: foundUser.username });
    } else {
        res.status(401).json({ message: 'Username atau password salah!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});