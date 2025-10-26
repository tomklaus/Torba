import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Розрахунок віку з дати народження
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Отримати категорію віку
export function getAgeCategory(birthDate: string): string {
  const age = calculateAge(birthDate);
  
  if (age >= 18 && age <= 20) return "18-20";
  if (age >= 21 && age <= 26) return "21-26";
  if (age >= 27 && age <= 30) return "27-30";
  if (age >= 31 && age <= 35) return "31-35";
  if (age >= 36 && age <= 39) return "36-39";
  if (age >= 40 && age <= 45) return "40-45";
  if (age >= 46 && age <= 49) return "46-49";
  return "50+";
}

// Валідація email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
