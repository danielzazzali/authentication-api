import {
  RESTORE_PASSWORD_CODE_GENERATOR_LOWER_BOUND,
  RESTORE_PASSWORD_CODE_GENERATOR_MULTIPLIER,
  RESTORE_PASSWORD_CODE_SUBJECT_TEXT,
  RESTORE_PASSWORD_CODE_TEXT,
} from './constants';

describe('Constants', () => {
  it('should have correct values', () => {
    expect(RESTORE_PASSWORD_CODE_GENERATOR_LOWER_BOUND).toEqual(100000);
    expect(RESTORE_PASSWORD_CODE_GENERATOR_MULTIPLIER).toEqual(900000);
    expect(RESTORE_PASSWORD_CODE_SUBJECT_TEXT).toEqual(
      'Código para reestablecer la contraseña',
    );
    expect(RESTORE_PASSWORD_CODE_TEXT).toEqual(
      'Hola! 👋😃\n\nTu código para reestablecer la contraseña es: {code}\n\nEste código es válido por 15 minutos. ¡Apúrate!🤌',
    );
  });
});