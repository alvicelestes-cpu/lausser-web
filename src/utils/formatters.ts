// Normaliza valores en pesos colombianos (si se ingresa 20 se asume 20.000)
export const normalizeCOP = (amount: number): number => {
  if (isNaN(amount) || amount === null || amount === undefined) return 0;
  // Si el valor ingresado es menor a 1000 (ej. 20, 25, 75), se normaliza como miles (20.000)
  if (amount > 0 && amount < 1000) {
    return Math.round(amount * 1000);
  }
  return Math.round(amount);
};

// Convierte cualquier string o número ingresado (ej: "20", "20000", "20.000") a número entero COP
export const parseCOP = (value: string | number): number => {
  if (typeof value === 'number') {
    return normalizeCOP(value);
  }
  if (!value) return 0;
  const str = String(value).trim();
  // Limpiar caracteres que no sean dígitos
  const cleaned = str.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10) || 0;
  return normalizeCOP(parsed);
};

// Formateador de moneda en pesos colombianos ($ XX.XXX COP)
export const formatCurrency = (amount: number): string => {
  const normalized = normalizeCOP(amount);
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(normalized);
  return `$ ${formatted} COP`;
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
