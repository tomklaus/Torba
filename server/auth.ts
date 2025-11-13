import bcrypt from 'bcrypt';
import { z } from 'zod';

const SALT_ROUNDS = 10;
const CURRENT_AGREEMENT_VERSION = '1.0';
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export interface PasswordStrengthResult {
  isValid: boolean;
  errors: string[];
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Пароль має бути не менше 8 символів');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Пароль має містити рядкові букви (a-z)');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль має містити прописні букви (A-Z)');
  }

  if (!/\d/.test(password)) {
    errors.push('Пароль має містити цифри (0-9)');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Пароль має містити спеціальні символи');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAge(birthDateString: string): { isValid: boolean; age?: number; error?: string } {
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return {
        isValid: false,
        age,
        error: 'Вам має бути мінімум 18 років для реєстрації',
      };
    }

    if (age > 150) {
      return {
        isValid: false,
        age,
        error: 'Невірна дата народження',
      };
    }

    return {
      isValid: true,
      age,
    };
  } catch (err) {
    return {
      isValid: false,
      error: 'Невірна дата народження',
    };
  }
}

export const registrationSchema = z.object({
  email: z.string().email('Невірна електронна адреса'),
  password: z.string().min(8, 'Пароль має бути не менше 8 символів'),
  confirmPassword: z.string(),
  birthDate: z.string().refine(
    (date) => validateAge(date).isValid,
    'Вам має бути мінимум 18 років',
  ),
  termsAccepted: z.boolean().refine((val) => val === true, 'Ви маєте прийняти умови'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Паролі не збігаються',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Невірна електронна адреса'),
  password: z.string().min(1, 'Пароль обов\'язковий'),
});

export function getCurrentAgreementVersion(): string {
  return CURRENT_AGREEMENT_VERSION;
}

export function getMaxLoginAttempts(): number {
  return MAX_LOGIN_ATTEMPTS;
}

export function getLoginAttemptWindowMs(): number {
  return LOGIN_ATTEMPT_WINDOW_MS;
}

export class LoginThrottleManager {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  recordAttempt(userId: string): void {
    const now = Date.now();
    const existing = this.attempts.get(userId);

    if (existing && now < existing.resetTime) {
      existing.count++;
    } else {
      this.attempts.set(userId, {
        count: 1,
        resetTime: now + getLoginAttemptWindowMs(),
      });
    }
  }

  resetAttempts(userId: string): void {
    this.attempts.delete(userId);
  }

  getAttemptCount(userId: string): number {
    const existing = this.attempts.get(userId);
    if (!existing) return 0;

    const now = Date.now();
    if (now >= existing.resetTime) {
      this.attempts.delete(userId);
      return 0;
    }

    return existing.count;
  }

  isThrottled(userId: string): boolean {
    return this.getAttemptCount(userId) >= getMaxLoginAttempts();
  }

  getSecondsUntilReset(userId: string): number {
    const existing = this.attempts.get(userId);
    if (!existing) return 0;

    const now = Date.now();
    if (now >= existing.resetTime) {
      this.attempts.delete(userId);
      return 0;
    }

    return Math.ceil((existing.resetTime - now) / 1000);
  }
}

export const loginThrottleManager = new LoginThrottleManager();
