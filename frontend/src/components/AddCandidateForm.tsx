import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { candidateService, CandidateFormData } from '../services/candidateService';

interface FormErrors {
  [key: string]: string;
}

interface AutocompleteState {
  [key: string]: {
    suggestions: string[];
    showSuggestions: boolean;
    loading: boolean;
  };
}

export const AddCandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autocomplete state
  const [autocomplete, setAutocomplete] = useState<AutocompleteState>({
    education: { suggestions: [], showSuggestions: false, loading: false },
    experience: { suggestions: [], showSuggestions: false, loading: false }
  });

  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.education.trim()) newErrors.education = 'Education is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (formData.phone && !/^[\d\s\-\+\(\)]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // File validation
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.cvFile = 'Only PDF and DOCX files are allowed';
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        newErrors.cvFile = 'File size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle autocomplete for education and experience
    if (name === 'education' || name === 'experience') {
      handleAutocomplete(name, value);
    }
  };

  const handleAutocomplete = useCallback((field: string, value: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length < 2) {
      setAutocomplete(prev => ({
        ...prev,
        [field]: { ...prev[field], suggestions: [], showSuggestions: false }
      }));
      return;
    }

    setAutocomplete(prev => ({
      ...prev,
      [field]: { ...prev[field], loading: true }
    }));

    debounceTimer.current = setTimeout(async () => {
      try {
        const suggestions = await candidateService.getAutocomplete(field, value);
        setAutocomplete(prev => ({
          ...prev,
          [field]: {
            suggestions,
            showSuggestions: suggestions.length > 0,
            loading: false
          }
        }));
      } catch (error) {
        console.error('Autocomplete error:', error);
        setAutocomplete(prev => ({
          ...prev,
          [field]: { ...prev[field], loading: false, showSuggestions: false }
        }));
      }
    }, 300);
  }, []);

  const handleSuggestionClick = (field: string, suggestion: string) => {
    setFormData(prev => ({ ...prev, [field]: suggestion }));
    setAutocomplete(prev => ({
      ...prev,
      [field]: { ...prev[field], showSuggestions: false }
    }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setSelectedFile(files[0]);
      if (errors.cvFile) {
        setErrors(prev => ({ ...prev, cvFile: '' }));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const dataToSubmit = { ...formData };
      if (selectedFile) {
        dataToSubmit.cvFile = selectedFile;
      }

      const response = await candidateService.addCandidate(dataToSubmit);

      if (response.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Candidate added successfully!'
        });
        
        // Reset form
        setFormData({
          name: '',
          surname: '',
          email: '',
          phone: '',
          address: '',
          education: '',
          experience: '',
        });
        setSelectedFile(null);
        setErrors({});

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: response.message || 'Failed to add candidate'
        });
        
        if (response.errors) {
          const newErrors: FormErrors = {};
          response.errors.forEach(error => {
            if (error.includes('email')) newErrors.email = error;
            else if (error.includes('phone')) newErrors.phone = error;
            else if (error.includes('file') || error.includes('File')) newErrors.cvFile = error;
          });
          setErrors(prev => ({ ...prev, ...newErrors }));
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div className="flex items-center justify-between">
          <h1>Add New Candidate</h1>
          <Link to="/" className="btn-secondary">
            &#8592; Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Success/Error Message */}
        {submitMessage && (
          <div className={submitMessage.type === 'success' ? 'success-message' : 'error-message'}>
            {submitMessage.text}
          </div>
        )}

        {/* Personal Information */}
        <div className="form-row">
          <div>
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter first name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="surname">Surname *</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              className={errors.surname ? 'error' : ''}
              placeholder="Enter last name"
            />
            {errors.surname && <p className="error-text">{errors.surname}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-row">
          <div>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter email address"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleInputChange}
            className={errors.address ? 'error' : ''}
            placeholder="Enter full address"
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        {/* Education with Autocomplete */}
        <div style={{ position: 'relative' }}>
          <label htmlFor="education">Education *</label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className={errors.education ? 'error' : ''}
            placeholder="Enter education details"
            onFocus={() => {
              if (formData.education.length >= 2) {
                handleAutocomplete('education', formData.education);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setAutocomplete(prev => ({
                  ...prev,
                  education: { ...prev.education, showSuggestions: false }
                }));
              }, 150);
            }}
          />
          {autocomplete.education.showSuggestions && (
            <div className="autocomplete-dropdown">
              {autocomplete.education.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="autocomplete-item"
                  onClick={() => handleSuggestionClick('education', suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          {errors.education && <p className="error-text">{errors.education}</p>}
        </div>

        {/* Experience with Autocomplete */}
        <div style={{ position: 'relative' }}>
          <label htmlFor="experience">Work Experience *</label>
          <textarea
            id="experience"
            name="experience"
            rows={4}
            value={formData.experience}
            onChange={handleInputChange}
            className={errors.experience ? 'error' : ''}
            placeholder="Describe work experience"
            onFocus={() => {
              if (formData.experience.length >= 2) {
                handleAutocomplete('experience', formData.experience);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setAutocomplete(prev => ({
                  ...prev,
                  experience: { ...prev.experience, showSuggestions: false }
                }));
              }, 150);
            }}
          />
          {autocomplete.experience.showSuggestions && (
            <div className="autocomplete-dropdown">
              {autocomplete.experience.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="autocomplete-item"
                  onClick={() => handleSuggestionClick('experience', suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          {errors.experience && <p className="error-text">{errors.experience}</p>}
        </div>

        {/* CV Upload */}
        <div>
          <label>CV Upload (Optional)</label>
          <div
            className={`file-upload${dragActive ? ' drag-active' : ''}${errors.cvFile ? ' error' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div>
              <span style={{ fontSize: '2rem', color: '#cbd5e1' }}>📄</span>
              <div style={{ margin: '0.5rem 0' }}>
                <label htmlFor="cv-upload" style={{ cursor: 'pointer', color: '#457b9d', fontWeight: 500 }}>
                  <span>Upload a file</span>
                  <input
                    id="cv-upload"
                    name="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </label>
                <span style={{ marginLeft: '0.5rem', color: '#374151' }}>or drag and drop</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>PDF, DOC, DOCX up to 5MB</div>
              {selectedFile && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#166534', fontWeight: 500 }}>{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    style={{ color: '#e63946', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    &#10005;
                  </button>
                </div>
              )}
            </div>
          </div>
          {errors.cvFile && <p className="error-text">{errors.cvFile}</p>}
        </div>

        {/* Submit Button */}
        <div className="button-row">
          <Link to="/" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin" style={{ marginRight: '0.5rem', display: 'inline-block' }}>⏳</span>
                Adding Candidate...
              </>
            ) : (
              'Add Candidate'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};