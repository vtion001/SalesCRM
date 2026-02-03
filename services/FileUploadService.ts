/**
 * FileUploadService - Handle file upload and conversion
 * Responsibility: File reading, validation, and conversion
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileUploadService {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  /**
   * Validate image file
   */
  validateImageFile(file: File): FileValidationResult {
    if (!file) {
      return {
        isValid: false,
        error: 'No file provided'
      };
    }

    if (!this.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
      };
    }

    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `File size must be less than ${this.maxFileSize / 1024 / 1024}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * Read file as data URL
   */
  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validate file first
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        reject(new Error(validation.error));
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Read file from input change event
   */
  async readFileFromEvent(event: React.ChangeEvent<HTMLInputElement>): Promise<string | null> {
    const file = event.target.files?.[0];
    if (!file) {
      return null;
    }

    try {
      return await this.readFileAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const fileUploadService = new FileUploadService();
