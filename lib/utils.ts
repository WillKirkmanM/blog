import { statSync } from "fs"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * This function returns the last modified date in DD/MM/YY format.
 * @param {string} path
 * @returns {string} 
 */
export function formattedLastModifiedDate(path: string): string {
    const lastModified = statSync(path).mtime;
    const lastModifiedDate = new Date(lastModified);
    const formattedLastModified = `${("0" + lastModifiedDate.getDate()).slice(-2)}/${("0" + (lastModifiedDate.getMonth() + 1)).slice(-2)}/${lastModifiedDate.getFullYear().toString().substr(-2)}`;

    return formattedLastModified
}

formattedLastModifiedDate
