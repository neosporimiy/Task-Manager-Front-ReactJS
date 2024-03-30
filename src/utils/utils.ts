import { v4 as uuid } from 'uuid';

export function generateUniqueId(): number {
    const currentTime = new Date().getTime();
    const uniqueId = currentTime % 1000000000;
    return uniqueId;
}

export function generateUniqueStringId(): string {
  const uniqueId = uuid();
  return uniqueId;
}

export function truncateString(description: string, maxLength: number) {
  if (description && description.length > maxLength) {
    return description.slice(0, maxLength) + '...';
  } else {
    return description || '';
  }
}