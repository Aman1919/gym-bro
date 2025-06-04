import Colors from './Colors';

export const Theme = {
  colors: Colors.dark,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  typography: {
    h1: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      lineHeight: 40,
    },
    h2: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      lineHeight: 32,
    },
    h3: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      lineHeight: 28,
    },
    h4: {
      fontFamily: 'Inter-Medium',
      fontSize: 18,
      lineHeight: 26,
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodySmall: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      lineHeight: 16,
    },
    button: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      lineHeight: 24,
    },
  },
};