const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../lib/prisma');

// Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// GET /api/documents
router.get('/', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadDate: 'desc' }
    });
    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/documents/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, documentType } = req.body;
    
    if (!title || !documentType) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Title and documentType are required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const newDocument = await prisma.document.create({
      data: {
        userId: req.user.id,
        title,
        documentType,
        fileName: req.file.originalname,
        fileUrl,
        fileSize: req.file.size,
        status: 'verified'
      }
    });

    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (error) {
    console.error('Error uploading document:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const filePath = path.join(__dirname, '../uploads', path.basename(document.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.document.delete({
      where: { id: documentId }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;