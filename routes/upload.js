const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const admin = require('firebase-admin');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const serviceAccount = require('../firebaseServiceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const bucket = admin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
      'application/pdf', 
      'video/mp4', 'video/quicktime', 'video/x-matroska'
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Seuls images/PDF/vidéos sont autorisés !'));
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Aucun fichier fourni" });

    const ext = path.extname(file.originalname);
    const blob = bucket.file(`${uuidv4()}${ext}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype }
    });
    blobStream.on('error', err => res.status(500).json({ message: err.message }));
    blobStream.on('finish', async () => {
      await blob.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const fileRecord = await File.create({
        originalName: file.originalname,
        url,
        type: file.mimetype,
        uploader: req.user.id // à adapter selon ton auth et payload JWT
      });
      res.json({ success: true, file: fileRecord });
    });
    blobStream.end(file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', async (req, res) => {
  const files = await File.find({}).select(['originalName', 'url', 'type', 'createdAt']);
  res.json(files);
});

module.exports = router;