import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';

export interface CandidateData {
  id?: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFilePath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Candidate {
  private readonly id?: number;
  private readonly name: string;
  private readonly surname: string;
  private readonly email: Email;
  private readonly phone: PhoneNumber;
  private readonly address: string;
  private readonly education: string;
  private readonly experience: string;
  private cvFilePath?: string;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  constructor(data: CandidateData) {
    this.validateRequiredFields(data);
    
    this.id = data.id;
    this.name = this.validateAndTrimString(data.name, 'Name');
    this.surname = this.validateAndTrimString(data.surname, 'Surname');
    this.email = new Email(data.email);
    this.phone = new PhoneNumber(data.phone);
    this.address = this.validateAndTrimString(data.address, 'Address');
    this.education = this.validateAndTrimString(data.education, 'Education');
    this.experience = this.validateAndTrimString(data.experience, 'Experience');
    this.cvFilePath = data.cvFilePath;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  private validateRequiredFields(data: CandidateData): void {
    const requiredFields = ['name', 'surname', 'email', 'phone', 'address', 'education', 'experience'];
    
    for (const field of requiredFields) {
      if (!data[field as keyof CandidateData]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateAndTrimString(value: string, fieldName: string): string {
    if (!value || value.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    
    if (value.trim().length > 255) {
      throw new Error(`${fieldName} cannot exceed 255 characters`);
    }
    
    return value.trim();
  }

  // Getters
  public getId(): number | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getSurname(): string {
    return this.surname;
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getPhone(): string {
    return this.phone.getValue();
  }

  public getAddress(): string {
    return this.address;
  }

  public getEducation(): string {
    return this.education;
  }

  public getExperience(): string {
    return this.experience;
  }

  public getCvFilePath(): string | undefined {
    return this.cvFilePath;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  public getFullName(): string {
    return `${this.name} ${this.surname}`;
  }

  public setCvFilePath(path: string): void {
    this.cvFilePath = path;
  }

  // Convert to plain object for database operations
  public toPersistence(): any {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      email: this.email.getValue(),
      phone: this.phone.getValue(),
      address: this.address,
      education: this.education,
      experience: this.experience,
      cvFilePath: this.cvFilePath,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Create from database data
  public static fromPersistence(data: any): Candidate {
    return new Candidate({
      id: data.id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      education: data.education,
      experience: data.experience,
      cvFilePath: data.cvFilePath,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}