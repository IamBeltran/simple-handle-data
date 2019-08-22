/* eslint-disable prefer-object-spread */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
import { resolveMx } from 'dns';

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

const EmailErrors = {
  ADDRESS_MISSING: 'Falta el valor de la dirección de Email',
  WRONG_TYPE_ADDRESS: 'Incorrecto el tipo de valor del Email, debe ser una cadena',
};

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

/**
 * @name          isType
 * @description   Function that returns the type of value you want to evaluate.
 * @param         {*} value - Value to evaluate
 * @returns       {String} A string with the name of the type of variable evaluated
 */
function isType(value) {
  return Object.prototype.toString
    .call(value)
    .match(/\s([a-z|A-Z]+)/)[1]
    .toLowerCase();
}

/**
 * @author        Victor Giovanni Beltrán Rodríguez
 * @version       2.0.0
 * @description   Create a new EmailError
 * @class         EmailError
 * @extends       {Error}
 */
class EmailError extends Error {
  /**
   * @param   {String} [error='Default error message'] - Name of error
   * @param   {Object} addInfo - Additional error information
   */
  constructor(error = 'Default error message', addInfo) {
    super();
    const ERRORS = EmailErrors;
    const message = ERRORS[`${error}`] ? ERRORS[`${error}`] : error;
    this.name = 'EmailError';
    this.message = message;
    const $this = this;
    if (addInfo && Object.entries(addInfo).length !== 0 && addInfo.constructor) {
      Object.getOwnPropertyNames(addInfo).forEach(value => {
        if (value === 'name') {
          $this.originalNameError = addInfo[value];
        } else if (value === 'stack') {
          $this.originalStackError = addInfo[value];
        } else {
          $this[value] = addInfo[value];
        }
      });
    }
  }
}

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - EMAIL.                                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
/**
 *
 * @name          emailSanitize
 * @description   Function to format and sanitize emails
 * @param         {string} address - Email to check
 * @returns       {string} - Email sanetized
 */
function emailSanitize(address) {
  const [localPart, domain] = address.split('@');
  const regExp00 = /\s+/g;
  const regExp01 = /[^A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.\-"]+/g; // eslint-disable-line
  const regExp02 = /[^A-Za-z0-9.-]+/g;
  const regExp03 = /^\./g;
  const regExp04 = /\.$/g;
  const regExp05 = /\.{2,}/g;

  const localPartSanitize = localPart
    .trim() // Remove whitespace at both ends of the string
    .replace(regExp00, '') // Remove whitespace between string
    .replace(regExp01, '') // Remove invalid characters in local part
    .replace(regExp03, '') // Delete dot at the start in local part
    .replace(regExp04, '') // Delete dot at the end in local part
    .replace(regExp05, '.'); // Delete two or more consecutive dots

  const addressSanitize = domain
    .trim() // Remove whitespace at both ends of the string
    .replace(regExp00, '') // Remove whitespace between string
    .replace(regExp02, '') // Remove invalid characters in domain
    .replace(regExp03, '') // Delete dot at the start in the domain
    .replace(regExp04, '') // Delete dot at the end in the domain
    .replace(regExp05, '.'); // Delete two or more consecutive dots

  return `${localPartSanitize}@${addressSanitize}`;
}

/**
 * @name          emailIsValidAddress
 * @description   Function to evaluate if email address is valid
 * @param         {string} address - Email to check
 * @returns       {Boolean} Return true if address is valid, false if not valid
 */
function emailIsValidAddress(address) {
  // eslint-disable-next-line
  const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regExp.test(address)) {
    return false;
  }
  const hasAt = address.indexOf('@') !== -1;

  // Missing "@" symbol
  if (!hasAt) {
    return false;
  }
  const [localPart, domain] = address.split('@');

  const localPartLen = localPart.length;
  const domainLen = domain.length;

  // Local part length exceeded
  if (localPartLen < 1 || localPartLen > 64) {
    return false;
  }

  // Domain part length exceeded
  if (domainLen < 1 || domainLen > 255) {
    return false;
  }

  // Local part starts or ends with '.'
  if (localPart.charAt(0) === '.' || localPart.charAt(localPartLen - 1) === '.') {
    return false;
  }

  // Local part has two consecutive dots
  if (localPart.match(/\.\./)) {
    return false;
  }
  // Character not valid in domain part
  if (!domain.match(/^[A-Za-z0-9.-]+$/)) {
    return false;
  }

  // Domain part has two consecutive dots
  if (domain.match(/\\.\\./)) {
    return false;
  }

  // Local part has invalid characters
  if (!localPart.match(/^[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.\-" ]+$/)) { // eslint-disable-line
    return false;
  }
  return true;
}

/**
 * @name          emailIsValidDomain
 * @description   Function to evaluate if the domain of an email is valid
 * @param         {string} address - Email to check
 * @returns       {Promise<boolean>} Return resolve true if domain is valid, false if not valid
 */
function emailIsValidDomain(address) {
  const hasAt = address.indexOf('@') !== -1;
  // Missing "@" symbol
  if (!hasAt) {
    return false;
  }
  const domain = address.split('@')[1];
  return new Promise(resolve => {
    resolveMx(domain, (err, addresses) => { // eslint-disable-line
      return err ? resolve(false) : resolve(true);
    });
  });
}

/**
 * @async
 * @name          emailGetObjectInfo
 * @description   Function that returns an object with information from an email
 * @param         {string} address - Email to check
 * @returns       {Promise<Object>} Email information
 */
async function emailGetAddressInfo(address) {
  if (!address) {
    throw new EmailError('ADDRESS_MISSING');
  }
  if (isType(address) !== 'string') {
    throw new EmailError('WRONG_TYPE_ADDRESS');
  }
  const hasAt = address.indexOf('@') !== -1;
  let hasFormatted = false;
  let addressFormatted = '';
  let isValidAddress = emailIsValidAddress(address);
  let isValidDomain = await emailIsValidDomain(address);
  let detail;
  let isValidEmail = isValidAddress && isValidDomain;
  if (!isValidEmail && hasAt) {
    hasFormatted = true;
    addressFormatted = emailSanitize(address);
    isValidAddress = emailIsValidAddress(addressFormatted);
    isValidDomain = await emailIsValidDomain(addressFormatted);
    isValidEmail = isValidAddress && isValidDomain;
  }
  const [localPart, domain] = !hasFormatted ? address.split('@') : addressFormatted.split('@');
  const validAddress = isValidAddress;
  const validDomain = isValidDomain;
  const ok = isValidEmail;

  if (!hasAt) {
    detail = 'FALTA ARROBA';
  } else if (!isValidAddress && !isValidDomain) {
    detail = 'USUARIO Y DOMINIO NO SON VALIDOS';
  } else if (!isValidAddress && isValidDomain) {
    detail = 'USUARIO NO ES VALIDO';
  } else if (isValidAddress && !isValidDomain) {
    detail = 'DOMINIO NO ES VALIDO';
  } else {
    detail = 'NINGUNO';
  }

  return Object.assign(
    {},
    {
      EMAIL: address,
      ARREGLADO: hasFormatted,
      ARREGLO: addressFormatted,
      USUARIO: hasAt ? localPart : '',
      DOMINIO: hasAt ? domain : '',
      'DIRECCIÓN VÁLIDA': validAddress,
      'DOMINIO VÁLIDA': validDomain,
      DETALLES: detail,
      VÁLIDO: ok,
    },
  );
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const email = {}; // eslint-disable-line no-multi-assign

// Main Modules
email.sanitize = emailSanitize;
email.isValidAddress = emailIsValidAddress;
email.isValidDomain = emailIsValidDomain;
email.getAddressInfo = emailGetAddressInfo;

export default email;
