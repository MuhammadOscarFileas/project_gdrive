import { User} from '../models/users_model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ msg: 'Email sudah digunakan' });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.status(201).json({ msg: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ msg: 'Registrasi gagal', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Password salah' });

    // Generate access token dan refresh token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email }, 
      ACCESS_TOKEN_SECRET, 
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email }, 
      REFRESH_TOKEN_SECRET, 
      { expiresIn: '7d' }
    );

    // Simpan refresh token ke database
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    // Set refresh token sebagai httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ 
      msg: 'Login berhasil', 
      accessToken,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Login gagal', error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Hapus refresh token dari database
    await User.update(
      { refresh_token: null },
      { where: { id } }
    );

    // Hapus cookie
    res.clearCookie('refreshToken');
    
    res.json({ msg: 'Logout berhasil' });
  } catch (err) {
    res.status(500).json({ msg: 'Logout gagal', error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ msg: 'Refresh token tidak ditemukan' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    
    // Cek apakah refresh token ada di database
    const user = await User.findOne({ 
      where: { 
        id: decoded.id,
        refresh_token: refreshToken 
      } 
    });

    if (!user) {
      return res.status(403).json({ msg: 'Refresh token tidak valid' });
    }

    // Generate access token baru
    const accessToken = jwt.sign(
      { id: user.id, email: user.email }, 
      ACCESS_TOKEN_SECRET, 
      { expiresIn: '15m' }
    );

    res.json({ 
      msg: 'Token berhasil diperbarui',
      accessToken,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ msg: 'Refresh token tidak valid' });
    }
    res.status(500).json({ msg: 'Gagal memperbarui token', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { email, password } = req.body;

    const hash = password ? await bcrypt.hash(password, 10) : undefined;
    await User.update(
      { email, ...(hash && { password: hash }) },
      { where: { id } }
    );
    res.json({ msg: 'Profil berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ msg: 'Update profil gagal', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    await File.destroy({ where: { user_id: id } });
    await User.destroy({ where: { id } });
    res.json({ msg: 'Akun dan semua file berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menghapus akun', error: err.message });
  }
};
