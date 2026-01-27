import { useState, ChangeEvent, FocusEvent } from 'react';

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  };

  return {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    reset,
  };
};
