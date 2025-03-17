// src/utils/statusStyles.ts

export function getStatusStyles(color: string): string {
    switch (color) {
      case 'green':
        // Pastel green pill
        return 'bg-emerald-50 text-emerald-600';
      case 'yellow':
        // Pastel yellow pill
        return 'bg-amber-50 text-amber-600';
      case 'red':
        // Pastel red pill
        return 'bg-rose-50 text-rose-600';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }
  