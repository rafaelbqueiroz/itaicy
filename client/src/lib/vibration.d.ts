declare interface VibrationAPI {
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

export const Vibration: VibrationAPI;
