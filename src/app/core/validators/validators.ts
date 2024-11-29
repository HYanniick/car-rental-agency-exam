import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fullNameValidator(): ValidatorFn {
  const namePattern = /^[a-zA-Z\- ]+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const fullName = control.value;
    const isValid = fullName && fullName.trim().split(/\s+/).length >= 2 && namePattern.test(fullName);
    return isValid ? null : { 'invalidFullName': true };
  };
}

export function emailValidator(): ValidatorFn {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    return email && !emailPattern.test(email) ? { 'invalidEmail': true } : null;
  };
}

export function phoneNumberValidator(): ValidatorFn {
  const phonePattern = /^[0-9]{10,15}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;
    return phoneNumber && !phonePattern.test(phoneNumber) ? { 'invalidPhoneNumber': true } : null;
  };
}

export function strongPasswordValidator(): ValidatorFn {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*])/;
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const isValid = password && password.length >= 8 && passwordPattern.test(password);
    return isValid ? null : { 'weakPassword': true };
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  };
}

export function licencePlateNumberValidator(): ValidatorFn {
  const platePattern = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const plateNumber = control.value;
    if (plateNumber && !platePattern.test(plateNumber)) {
      return { 'invalidPlateNumber': true };
    }
    return null;
  };
}
