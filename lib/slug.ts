import slugifyLib from 'slugify';

/**
 * Genera un slug seguro a partir de un texto.
 * Solo minúsculas, números y guiones. Regex: /^[a-z0-9-]+$/
 */
export function generateSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}
