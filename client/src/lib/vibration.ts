/**
 * Interface para o utilitário de vibração
 */
interface VibrationAPI {
  /**
   * Fornece feedback tátil
   * @param type - Tipo de feedback
   */
  feedback: (type: 'light' | 'medium' | 'heavy') => void;

  /**
   * Verifica se o dispositivo suporta vibração
   */
  isSupported: () => boolean;
}

/**
 * Utilitário para feedback tátil em dispositivos móveis com fallback seguro
 */
export const Vibration: VibrationAPI = {
  /**
   * Fornece feedback tátil
   * @param type - Tipo de feedback: 'light' | 'medium' | 'heavy'
   */
  feedback: (type: 'light' | 'medium' | 'heavy') => {
    if (typeof window === 'undefined' || !window.navigator?.vibrate) return;

    const durations = {
      light: 10,
      medium: 20,
      heavy: 30
    };

    window.navigator.vibrate(durations[type]);
  },

  /**
   * Verifica se o dispositivo suporta vibração
   */
  isSupported: (): boolean => {
    return typeof window !== 'undefined' && !!window.navigator?.vibrate;
  }
};
