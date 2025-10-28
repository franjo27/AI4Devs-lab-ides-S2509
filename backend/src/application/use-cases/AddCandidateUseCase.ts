import { Candidate, CandidateData } from '../../domain/entities/Candidate';
import { CandidateRepository } from '../repositories/CandidateRepository';

export interface AddCandidateRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFile?: Express.Multer.File;
}

export interface AddCandidateResponse {
  success: boolean;
  message: string;
  candidate?: {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    education: string;
    experience: string;
    cvFilePath?: string;
  };
  errors?: string[];
}

export class AddCandidateUseCase {
  constructor(private candidateRepository: CandidateRepository) {}

  async execute(request: AddCandidateRequest): Promise<AddCandidateResponse> {
    try {
      // Check if candidate already exists
      const existingCandidate = await this.candidateRepository.existsByEmail(request.email);
      if (existingCandidate) {
        return {
          success: false,
          message: 'A candidate with this email already exists',
          errors: ['Email is already registered']
        };
      }

      // Create candidate entity (this will validate the data)
      const candidateData: CandidateData = {
        name: request.name,
        surname: request.surname,
        email: request.email,
        phone: request.phone,
        address: request.address,
        education: request.education,
        experience: request.experience,
      };

      const candidate = new Candidate(candidateData);

      // Set CV file path if provided
      if (request.cvFile) {
        this.validateCvFile(request.cvFile);
        const cvPath = this.generateCvFilePath(request.cvFile, candidate.getEmail());
        candidate.setCvFilePath(cvPath);
      }

      // Save candidate
      const savedCandidate = await this.candidateRepository.save(candidate);

      return {
        success: true,
        message: 'Candidate added successfully',
        candidate: {
          id: savedCandidate.getId()!,
          name: savedCandidate.getName(),
          surname: savedCandidate.getSurname(),
          email: savedCandidate.getEmail(),
          phone: savedCandidate.getPhone(),
          address: savedCandidate.getAddress(),
          education: savedCandidate.getEducation(),
          experience: savedCandidate.getExperience(),
          cvFilePath: savedCandidate.getCvFilePath(),
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        message: 'Failed to add candidate',
        errors: [errorMessage]
      };
    }
  }

  private validateCvFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file format. Only PDF and DOCX files are allowed.');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }
  }

  private generateCvFilePath(file: Express.Multer.File, email: string): string {
    const timestamp = Date.now();
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
    const extension = file.originalname.split('.').pop();
    return `uploads/${sanitizedEmail}_${timestamp}.${extension}`;
  }
}