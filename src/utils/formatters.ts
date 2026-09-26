// Formateador de moneda en pesos (COP / Formato latino)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formateador de fecha amigable en español
export const formatDateFriendly = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

// Formato de nombre de marca para visualización
export const getBrandNameDisplay = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'ésika':
      return 'Ésika';
    case 'cyzone':
      return 'Cyzone';
    case 'lbel':
      return "L'Bel";
    default:
      return brand;
  }
};

// Colores característicos por marca
export const getBrandTheme = (brand: string) => {
  switch (brand.toLowerCase()) {
    case 'ésika':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badge: 'bg-rose-600 text-white',
        accent: '#E11D48',
        gradient: 'from-rose-500 to-red-600',
        tag: 'Ésika Original'
      };
    case 'cyzone':
      return {
        bg: 'bg-fuchsia-50',
        text: 'text-fuchsia-700',
        border: 'border-fuchsia-200',
        badge: 'bg-fuchsia-600 text-white',
        accent: '#C026D3',
        gradient: 'from-fuchsia-500 to-purple-600',
        tag: 'Cyzone Trend'
      };
    case 'lbel':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badge: 'bg-neutral-900 text-amber-300',
        accent: '#D97706',
        gradient: 'from-neutral-900 via-neutral-800 to-amber-900',
        tag: "L'Bel Alta Gama"
      };
    default:
      return {
        bg: 'bg-neutral-100',
        text: 'text-neutral-700',
        border: 'border-neutral-200',
        badge: 'bg-neutral-800 text-white',
        accent: '#4F46E5',
        gradient: 'from-neutral-800 to-neutral-900',
        tag: 'Lausser'
      };
  }
};
