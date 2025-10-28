const API_BASE_URL = 'http://localhost:3010';

export interface CandidateFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFile?: File;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: string[];
  data?: any;
}

export const candidateService = {
  async addCandidate(candidateData: CandidateFormData): Promise<ApiResponse> {
    try {
      const formData = new FormData();

      // Add all text fields
      formData.append('name', candidateData.name);
      formData.append('surname', candidateData.surname);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('address', candidateData.address);
      formData.append('education', candidateData.education);
      formData.append('experience', candidateData.experience);

      // Add file if present
      if (candidateData.cvFile) {
        formData.append('cvFile', candidateData.cvFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to add candidate',
          errors: data.errors || []
        };
      }

      return {
        success: true,
        message: data.message || 'Candidate added successfully',
        data: data.candidate
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: []
      };
    }
  },

  async getAllCandidates() {
    const response = await fetch(`${API_BASE_URL}/api/candidates`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  },

  async getAutocomplete(field: string, query: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates/autocomplete?field=${field}&query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return []; // Return empty array on error
    }
  }

};



