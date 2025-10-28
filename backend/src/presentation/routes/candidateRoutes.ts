import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { CandidateController } from '../controllers/CandidateController';

const router = Router();
const candidateController = new CandidateController();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Routes
router.post('/', upload.single('cvFile'), candidateController.create.bind(candidateController));
router.get('/autocomplete', candidateController.getAutocomplete.bind(candidateController));
router.get('/', candidateController.getAll.bind(candidateController));

export default router;