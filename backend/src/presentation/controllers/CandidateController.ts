import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AddCandidateUseCase } from '../../application/use-cases/AddCandidateUseCase';
import { GetAllCandidatesUseCase } from '../../application/use-cases/GetAllCandidatesUseCase';
import { PrismaCandidateRepository } from '../../infrastructure/repositories/PrismaCandidateRepository';

const prisma = new PrismaClient();
const candidateRepository = new PrismaCandidateRepository(prisma);
const addCandidateUseCase = new AddCandidateUseCase(candidateRepository);
const getAllCandidatesUseCase = new GetAllCandidatesUseCase(candidateRepository);


export class CandidateController {
  async create(req: Request, res: Response) {
    try {
      const { name, surname, email, phone, address, education, experience } = req.body;
      const cvFile = req.file;

      // Validation
      const errors: string[] = [];
      if (!name?.trim()) errors.push('Name is required');
      if (!surname?.trim()) errors.push('Surname is required');
      if (!email?.trim()) errors.push('Email is required');
      if (!phone?.trim()) errors.push('Phone is required');
      if (!address?.trim()) errors.push('Address is required');
      if (!education?.trim()) errors.push('Education is required');
      if (!experience?.trim()) errors.push('Experience is required');

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      const candidateData = {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        education: education.trim(),
        experience: experience.trim(),
        cvFilePath: cvFile ? cvFile.path : undefined
      };

      const candidate = await addCandidateUseCase.execute(candidateData);

      res.status(201).json({
        success: true,
        message: 'Candidate added successfully',
        candidate
      });
    } catch (error) {
      console.error('Controller error:', error);
      if (error instanceof Error && error.message.includes('email already exists')) {
        res.status(400).json({
          success: false,
          message: 'A candidate with this email already exists',
          errors: ['Email already exists']
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          errors: ['Failed to add candidate']
        });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const candidates = await getAllCandidatesUseCase.execute();
      res.json({ success: true, data: candidates });
    } catch (error) {
      console.error('GetAllCandidates error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch candidates' });
    }
  }

  async getAutocomplete(req: Request, res: Response) {
    try {
      const { field, query } = req.query;

      if (!field || !query || typeof query !== 'string' || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      // Mock suggestions for now - later can be replaced with database queries
      const mockSuggestions: Record<string, string[]> = {
        education: [
          'Computer Science - Bachelor\'s Degree',
          'Software Engineering - Master\'s Degree',
          'Information Technology - Bachelor\'s Degree',
          'Business Administration - MBA',
          'Marketing - Bachelor\'s Degree',
          'Data Science - Master\'s Degree',
          'Cybersecurity - Bachelor\'s Degree',
          'Artificial Intelligence - PhD',
          'Web Development - Certificate',
          'Mobile Development - Certificate'
        ],
        experience: [
          'Software Developer - 3 years at Tech Corp',
          'Frontend Developer - 2 years at StartupXYZ',
          'Full Stack Engineer - 5 years at Enterprise Inc',
          'Project Manager - 4 years at Consulting Ltd',
          'UX/UI Designer - 2 years at Design Studio',
          'DevOps Engineer - 3 years at CloudTech',
          'Data Analyst - 2 years at Analytics Co',
          'QA Engineer - 4 years at TestLab',
          'Product Manager - 5 years at Product Inc',
          'Technical Lead - 6 years at Development Corp'
        ]
      };

      const suggestions = mockSuggestions[field as string]?.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      ) || [];

      res.json({ suggestions });
    } catch (error) {
      console.error('Autocomplete error:', error);
      res.status(500).json({ error: 'Failed to get autocomplete suggestions' });
    }
  }
}