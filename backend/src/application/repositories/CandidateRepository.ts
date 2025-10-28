import { Candidate } from '../../domain/entities/Candidate';

export interface CandidateRepository {
  save(candidate: Candidate): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
  findById(id: number): Promise<Candidate | null>;
  existsByEmail(email: string): Promise<boolean>;
  findAll(): Promise<Candidate[]>;
}