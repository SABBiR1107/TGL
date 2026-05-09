import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
export function mapSize(size: string) {
  const maps: Record<string, string> = {
    'Small': '5KG',
    'Medium': '7KG',
    'Large': '10KG',
    'small': '5KG',
    'medium': '7KG',
    'large': '10KG'
  };
  return maps[size] || size;
}
