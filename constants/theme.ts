// Lzainova AI — Design Tokens
// Futuristic dark identity with electric blue and gold accents

export const Colors = {
  // Base surfaces
  background: '#070919',
  surface: '#0F1330',
  surfaceElevated: '#161C42',
  surfaceMuted: '#0B0F26',
  border: '#1F2653',
  borderSubtle: '#141936',

  // Brand
  brand: '#4A9EFF',
  brandDeep: '#2563EB',
  brandGlow: 'rgba(74, 158, 255, 0.18)',
  gold: '#F5C542',
  goldDeep: '#C99A1F',
  goldGlow: 'rgba(245, 197, 66, 0.18)',

  // Text
  textPrimary: '#F5F7FF',
  textSecondary: '#B3B9DA',
  textMuted: '#7982AB',
  textDim: '#4E5686',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#4A9EFF',

  // Chat
  userBubble: '#1B2454',
  aiBubble: '#0F1330',

  // Overlay
  overlay: 'rgba(2, 4, 15, 0.72)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  pill: 999,
};

export const Font = {
  size: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 26,
    display: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  glowBlue: {
    shadowColor: '#4A9EFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  glowGold: {
    shadowColor: '#F5C542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const Theme = {
  Colors,
  Spacing,
  Radii,
  Font,
  Shadows,
};

export default Theme;
