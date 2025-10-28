import { CandidateRepository } from '../repositories/CandidateRepository';

export class GetAllCandidatesUseCase {
  constructor(private candidateRepository: CandidateRepository) {}

  async execute() {
    return await this.candidateRepository.findAll();
  }
}