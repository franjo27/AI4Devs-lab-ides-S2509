import { PrismaClient } from '@prisma/client';
import { CandidateRepository } from '../../application/repositories/CandidateRepository';
import { Candidate } from '../../domain/entities/Candidate';

export class PrismaCandidateRepository implements CandidateRepository {
  constructor(private prisma: PrismaClient) { }

  async save(candidate: Candidate): Promise<Candidate> {
    try {
      const candidateData = candidate.toPersistence();

      const savedCandidate = await this.prisma.candidate.create({
        data: {
          name: candidateData.name,
          surname: candidateData.surname,
          email: candidateData.email,
          phone: candidateData.phone,
          address: candidateData.address,
          education: candidateData.education,
          experience: candidateData.experience,
          cvFilePath: candidateData.cvFilePath,
        }
      });

      return Candidate.fromPersistence(savedCandidate);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new Error('A candidate with this email already exists');
      }
      throw new Error(`Failed to save candidate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    try {
      const candidate = await this.prisma.candidate.findUnique({
        where: { email }
      });

      return candidate ? Candidate.fromPersistence(candidate) : null;
    } catch (error) {
      throw new Error(`Failed to find candidate by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: number): Promise<Candidate | null> {
    try {
      const candidate = await this.prisma.candidate.findUnique({
        where: { id }
      });

      return candidate ? Candidate.fromPersistence(candidate) : null;
    } catch (error) {
      throw new Error(`Failed to find candidate by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const candidate = await this.prisma.candidate.findUnique({
        where: { email },
        select: { id: true }
      });

      return candidate !== null;
    } catch (error) {
      throw new Error(`Failed to check candidate existence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  async findAll(): Promise<Candidate[]> {
    try {
      const candidates = await this.prisma.candidate.findMany();
      return candidates.map(c => Candidate.fromPersistence(c));
    } catch (error) {
      throw error;
    }
  }
}