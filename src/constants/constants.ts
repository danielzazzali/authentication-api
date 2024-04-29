/**
 * This file contains constants related to password restoration.
 * @file
 */

/**
 * The lower bound for the password reset code generator.
 * @constant
 * @type {number}
 */
export const RESTORE_PASSWORD_CODE_GENERATOR_LOWER_BOUND: number = 100000;

/**
 * The multiplier for the password reset code generator.
 * @constant
 * @type {number}
 */
export const RESTORE_PASSWORD_CODE_GENERATOR_MULTIPLIER: number = 900000;

/**
 * The subject text for the password reset email.
 * @constant
 * @type {string}
 */
export const RESTORE_PASSWORD_CODE_SUBJECT_TEXT: string =
  'Código para reestablecer la contraseña';

/**
 * The body text for the password reset email. The {code} placeholder will be replaced with the actual reset code.
 * @constant
 * @type {string}
 */
export const RESTORE_PASSWORD_CODE_TEXT: string =
  'Hola! 👋😃\n\nTu código para reestablecer la contraseña es: {code}\n\nEste código es válido por 15 minutos. ¡Apúrate!🤌';
