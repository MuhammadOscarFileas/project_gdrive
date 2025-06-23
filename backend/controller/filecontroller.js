import { File } from '../models/files_model.js';
import { uploadToGCS, deleteFromGCS, getSignedUrlGCS } from '../utils/gcs.js';

export const createFile = async (req, res) => {
  try {
    const { originalname, mimetype, buffer, size } = req.file;
    const { id: user_id } = req.user;

    const gcsPath = await uploadToGCS(buffer, originalname);

    const file = await File.create({
      user_id,
      filename: originalname,
      gcs_path: gcsPath,
      mimetype,
      size,
    });

    res.status(201).json({ msg: 'File berhasil diunggah', file });
  } catch (err) {
    res.status(500).json({ msg: 'Upload file gagal', error: err.message });
  }
};

export const updateFilename = async (req, res) => {
  try {
    const { id } = req.params;
    const { filename } = req.body;
    const file = await File.findOne({ where: { id, user_id: req.user.id } });
    if (!file) return res.status(404).json({ msg: 'File tidak ditemukan' });

    file.filename = filename;
    await file.save();
    res.json({ msg: 'Nama file berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengubah nama file', error: err.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.findAll({ where: { user_id: req.user.id } });
    res.json({ msg: 'Berhasil mengambil daftar file', files });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengambil file', error: err.message });
  }
};

export const getFilePreview = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ where: { id, user_id: req.user.id } });
    if (!file) return res.status(404).json({ msg: 'File tidak ditemukan' });

    const url = await getSignedUrlGCS(file.gcs_path);
    res.json({ msg: 'Preview tersedia', previewUrl: url });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengambil preview', error: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ where: { id, user_id: req.user.id } });
    if (!file) return res.status(404).json({ msg: 'File tidak ditemukan' });

    const url = await getSignedUrlGCS(file.gcs_path, 'download');
    res.redirect(url);
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengunduh file', error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ where: { id, user_id: req.user.id } });
    if (!file) return res.status(404).json({ msg: 'File tidak ditemukan' });

    await deleteFromGCS(file.gcs_path);
    await file.destroy();
    res.json({ msg: 'File berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menghapus file', error: err.message });
  }
};

export const getSharedFile = async (req, res) => {
  try {
    const { shareId } = req.params;
    const file = await File.findOne({ where: { share_id: shareId } });
    if (!file) return res.status(404).json({ msg: 'File tidak ditemukan atau link tidak valid' });

    const url = await getSignedUrlGCS(file.gcs_path, 'read'); // atau 'download'
    res.json({ msg: 'Link berhasil ditemukan', file: { filename: file.filename, url } });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengambil link file', error: err.message });
  }
};

