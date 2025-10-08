import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ini memperluas tipe Request dari Express agar kita bisa menambahkan data 'user'
export interface AuthRequest extends Request {
    user?: { userId: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Ambil token dari header 'Authorization'
    const authHeader = req.headers.authorization;

    // 2. Cek apakah token ada dan formatnya benar ('Bearer <token>')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Akses ditolak, token tidak tersedia.' });
    }

    // 3. Ekstrak token dari header
    const token = authHeader.split(' ')[1];

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET tidak ditemukan di file .env');
        }

        // 4. Verifikasi token menggunakan kunci rahasia Anda
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };

        // 5. Jika valid, tambahkan payload (data pengguna) ke objek request
        req.user = { userId: decoded.userId };

        // 6. Lanjutkan ke fungsi endpoint selanjutnya
        next();
    } catch (error) {
        // Jika token tidak valid atau kedaluwarsa, kirim error
        res.status(401).json({ success: false, message: 'Token tidak valid.' });
    }
};
