export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validateEmail(email);
    this.value = email.toLowerCase().trim();
  }

  private validateEmail(email: string): void {
    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}