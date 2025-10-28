export class PhoneNumber {
  private readonly value: string;

  constructor(phone: string) {
    this.validatePhone(phone);
    this.value = this.normalizePhone(phone);
  }

  private validatePhone(phone: string): void {
    if (!phone) {
      throw new Error('Phone number is required');
    }

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      throw new Error('Phone number must be between 9 and 15 digits');
    }
  }

  private normalizePhone(phone: string): string {
    // Remove all non-digit characters except + at the beginning
    return phone.replace(/(?!^)\+|\s|-|\(|\)/g, '').trim();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}