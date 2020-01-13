/* eslint-disable prefer-object-spread */
/* eslint-disable no-nested-ternary */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const Store = require('../../store/IFTStore');

const IFTSTORE = new Store().setupStore();
const IFTStore = IFTSTORE.IFT;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const { nirs, database: DBIFT } = IFTStore;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const PhoneErrors = {
  MISSING_PHONE: 'Missing phone number',
  MISSING_PHONE_PARTS: 'Missing phone parts',
  NOT_STRING: 'Value is not string',
  NOT_OBJECT: 'Value is not object',
  INVALID_FORMAT: 'Input value is invalid format',
};

// YCG = YES CAPTURING GROUP
// NCG = NON CAPTURING GROUP
// PLG = POSITIVE LOOKAHEAD GROUP
// NLG = NEGATIVE LOOKAHEAD GROUP

// Declaration of chunk Regular expression
const YCGTenDigits = '(\\d{10})';
const YCGNumbers = '([0-9]+)';
const YCGZeros = '(0+)';
const YCGWhiteSpaces = '(\\s+)';
const YCGDigits = '([0-9]+)';
const YCGCharacters = '([^0-9\\s]+)';
const YCGNotNumber = '([^0-9]+)';
const YCGpreFixWrong = '((?:0{2,}(?:44|45|1))(?!0{1,10}))';
const YCGPreFix = '((?:0(?:44|45|1))(?!0{1,10}))';
const YCGOK = '((?!0{1,10})(?!0(?:44|45|1))(?:\\d{1})(?!0{9})(?:\\d{9}))';
const YCGMissingOne = '((?!0{1,10})(?!0(?:44|45|1))(?:\\d{1})(?!0{8})(?:\\d{8}))';

// Declaration of Regular expression
const regExpTenDigits = new RegExp(`^${YCGTenDigits}$`); // tenDigits
const regExpOnlyNumbers = new RegExp(`^${YCGNumbers}$`);
const regExpMissingOne = new RegExp(`^${YCGMissingOne}$`);
const regExp00 = new RegExp(`^${YCGZeros}$`); // onlyZeros
const regExp01 = new RegExp(`^${YCGWhiteSpaces}$`); // onlyWhiteSpace
const regExp02 = new RegExp(`^${YCGCharacters}$`); // onlyCharacters
const regExp03 = new RegExp(`^${YCGNotNumber}$`); // onlyNotNumber
const regExp04 = new RegExp(`^${YCGDigits}${YCGNotNumber}${YCGDigits}$`); // digits-notNumber-digits
const regExp05 = new RegExp(`^${YCGNotNumber}${YCGpreFixWrong}${YCGOK}${YCGNotNumber}$`); // notNumber-preFixWrong-OK-notNumber
const regExp06 = new RegExp(`^${YCGNotNumber}${YCGpreFixWrong}${YCGOK}$`); // notNumber-preFixWrong-OK
const regExp07 = new RegExp(`^${YCGpreFixWrong}${YCGOK}${YCGNotNumber}$`); // preFixWrong-OK-notNumber
const regExp08 = new RegExp(`^${YCGpreFixWrong}${YCGOK}$`); // preFixWrong-OK
const regExp09 = new RegExp(`^${YCGNotNumber}${YCGPreFix}${YCGOK}${YCGNotNumber}$`); // notNumber-preFix-OK-notNumber
const regExp10 = new RegExp(`^${YCGNotNumber}${YCGPreFix}${YCGOK}$`); // notNumber-preFix-OK
const regExp11 = new RegExp(`^${YCGNotNumber}${YCGOK}${YCGNotNumber}$`); // notNumber-OK-notNumber
const regExp12 = new RegExp(`^${YCGNotNumber}${YCGOK}$`); // notNumber-OK
const regExp13 = new RegExp(`^${YCGPreFix}${YCGOK}${YCGNotNumber}$`); // preFix-OK-notNumber
const regExp14 = new RegExp(`^${YCGPreFix}${YCGOK}$`); // preFix-OK
const regExp15 = new RegExp(`^${YCGOK}${YCGNotNumber}$`); // OK-notNumber
const regExp16 = new RegExp(`^${YCGOK}$`); // OK

// Array of Regular expression
const phoneRegExps = [
  regExp00, // onlyZeros
  regExp01, // onlyWhiteSpace
  regExp02, // onlyCharacters
  regExp03, // onlyNotNumber
  regExp04, // digits-notNumber-digits
  regExp05, // notNumber-preFixWrong-OK-notNumber
  regExp06, // notNumber-preFixWrong-OK
  regExp07, // preFixWrong-OK-notNumber
  regExp08, // preFixWrong-OK
  regExp09, // notNumber-preFix-OK-notNumber
  regExp10, // notNumber-preFix-OK
  regExp11, // notNumber-OK-notNumber
  regExp12, // notNumber-OK
  regExp13, // preFix-OK-notNumber
  regExp14, // preFix-OK
  regExp15, // OK-notNumber
  regExp16, // OK
];

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
 * @name          hasProperty
 * @description   Shortcut to hasOwnProperty of the Object method
 * @param         {Object} object - The object to which the property is sought
 * @param         {string} property - The name of the property to look for
 * @returns       {boolean} Returns a boolean indicating whether the object has the specified property.
 */
function hasProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

/**
 * @author        Victor Giovanni Beltrán Rodríguez
 * @version       2.0.0
 * @description   Create a new PhoneError
 * @class         EmailError
 * @extends       {Error}
 */
class PhoneError extends Error {
  /**
   * @param   {String} [error='Default error message'] - Name of error
   * @param   {Object} addInfo - Additional error information
   */
  constructor(error = 'Default error message', addInfo) {
    super();
    const ERRORS = PhoneErrors;
    const message = ERRORS[`${error}`] ? ERRORS[`${error}`] : error;
    this.name = 'PhoneError';
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
//  │ SET MAIN MODULE - PHONE.                                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘

/**
 * @name          getIndex
 * @description   Function that returns index of match in array phoneRegExps
 * @param         {string} phone - Phone number
 * @returns       {number} Index of match in array, return -1 if not match
 */
function getIndex(phone) {
  if (isType(phone) === 'undefined') {
    throw new PhoneError('MISSING_PHONE');
  }
  if (isType(phone) !== 'string') {
    throw new PhoneError('NOT_STRING');
  }
  return phoneRegExps.findIndex(regExp => regExp.test(phone) === true);
}

/**
 * @name          phoneGetEvaluation
 * @description   Function that returns evaluation of format of a phone
 * @param         {string} phone - Phone number
 * @returns       {{type:string, isFixed:string}} Index of match in array, return -1 if not match
 */
function phoneGetEvaluation(phone) {
  if (isType(phone) === 'undefined') {
    throw new PhoneError('MISSING_PHONE');
  }
  if (isType(phone) !== 'string') {
    throw new PhoneError('NOT_STRING');
  }
  const index = phoneRegExps.findIndex(regExp => regExp.test(phone) === true);
  const evaluations = [
    'ONLY_ZEROS', // 00
    'ONLY_WHITESPACE', // 01
    'ONLY_CHARACTERS', // 02
    'ONLY_NOT_NUMBER', // 03
    'DIGITS-NOT_NUMBER-DIGITS', // 04
    'NOT_NUMBER-PREFIX_WRONG-OK-NOT_NUMBER', // 05
    'NOT_NUMBER-PREFIX_WRONG-OK', // 06
    'PREFIX_WRONG-OK-NOT_NUMBER', // 07
    'PREFIX_WRONG-OK', // 08
    'NOT_NUMBER-PREFIX-OK-NOT_NUMBER', // 09
    'NOT_NUMBER-PREFIX-OK', // 10
    'NOT_NUMBER-OK-NOT_NUMBER', // 11
    'NOT_NUMBER-OK', // 12
    'PREFIX-OK-NOT_NUMBER', // 13
    'PREFIX-OK', // 14
    'OK-NOT_NUMBER', // 15
    'OK', // 16
  ];
  let isFixed;
  let type;
  const isMatching = index !== -1;
  const phoneLen = phone.length;
  type = isMatching
    ? evaluations[index]
    : phoneLen <= 7
    ? 'TOO_SHORT'
    : phoneLen === 8
    ? 'MISSING_TWO_NUMBERS'
    : regExpOnlyNumbers.test(phone) === true
    ? 'CHECK_MANUALLY'
    : 'INVALID';

  if (type === 'DIGITS-NOT_NUMBER-DIGITS') {
    const tempPhone = phone.replace(regExp04, '$1$3');
    const tempIndex = getIndex(tempPhone);
    type = tempIndex >= 5 ? 'FIXED_WITH_SECOND_SANITIZE' : 'NOT_FIXED';
  }

  if (type === 'CHECK_MANUALLY' && regExpMissingOne.test(phone)) {
    type = 'MISSING_ONE_NUMBER';
  }

  switch (type) {
    // NOT MATCHING
    case 'TOO_SHORT':
      isFixed = false;
      break;
    case 'MISSING_TWO_NUMBERS':
      isFixed = false;
      break;
    case 'MISSING_ONE_NUMBER':
      isFixed = 'MANUALLY';
      break;
    case 'CHECK_MANUALLY':
      isFixed = 'MANUALLY';
      break;
    case 'INVALID':
      isFixed = 'MANUALLY';
      break;
    // MATCHING
    case 'ONLY_ZEROS':
      isFixed = false;
      break;
    case 'ONLY_WHITESPACE':
      isFixed = false;
      break;
    case 'ONLY_CHARACTERS':
      isFixed = false;
      break;
    case 'ONLY_NOT_NUMBER':
      isFixed = false;
      break;
    case 'FIXED_WITH_SECOND_SANITIZE':
      isFixed = 'WITH_SECOND_SANITIZE';
      break;
    case 'NOT_FIXED':
      isFixed = false;
      break;
    case 'NOT_NUMBER-PREFIX_WRONG-OK-NOT_NUMBER':
      isFixed = 'WITH_REPLACE';
      break;
    case 'NOT_NUMBER-PREFIX_WRONG-OK':
      isFixed = 'WITH_REPLACE';
      break;
    case 'PREFIX_WRONG-OK-NOT_NUMBER':
      isFixed = 'WITH_REPLACE';
      break;
    case 'PREFIX_WRONG-OK':
      isFixed = 'WITH_REPLACE';
      break;
    case 'NOT_NUMBER-PREFIX-OK-NOT_NUMBER':
      isFixed = 'WITH_REPLACE';
      break;
    case 'NOT_NUMBER-PREFIX-OK':
      isFixed = 'WITH_REPLACE';
      break;
    case 'NOT_NUMBER-OK-NOT_NUMBER':
      isFixed = 'WITH_REPLACE';
      break;
    case 'NOT_NUMBER-OK':
      isFixed = 'WITH_REPLACE';
      break;
    case 'PREFIX-OK-NOT_NUMBER':
      isFixed = 'WITH_REPLACE';
      break;
    case 'PREFIX-OK':
      isFixed = 'WITH_REPLACE';
      break;
    case 'OK-NOT_NUMBER':
      isFixed = 'WITH_REPLACE';
      break;
    case 'OK':
      isFixed = 'READY';
      break;
    // DEFAULT
    default:
      isFixed = 'FIXED_UNDEFINED';
      break;
  }

  return { type, isFixed };
}

/**
 * @name          phoneSanetize
 * @description   Function that returns index index of match in array phoneRegExps
 * @param         {string} phone - Phone number
 * @returns       {string} Index of match in array, return -1 if not match
 */
function phoneSanetize(phone) {
  if (isType(phone) === 'undefined') {
    throw new PhoneError('MISSING_PHONE');
  }
  if (isType(phone) !== 'string') {
    throw new PhoneError('NOT_STRING');
  }
  const evaluation = phoneGetEvaluation(phone);
  const { type, isFixed } = evaluation;
  if (isFixed === 'WITH_SECOND_SANITIZE') {
    const temp = phone.replace(regExp04, '$1$3');
    return phoneSanetize(temp);
  }
  if (isFixed === 'WITH_REPLACE') {
    if (type === 'NOT_NUMBER-PREFIX_WRONG-OK-NOT_NUMBER') {
      // 05 notNumber-preFixWrong-OK-notNumber
      return phone.replace(regExp05, '$3');
    }
    if (type === 'NOT_NUMBER-PREFIX_WRONG-OK') {
      // 06 notNumber-preFixWrong-OK
      return phone.replace(regExp06, '$3');
    }
    if (type === 'PREFIX_WRONG-OK-NOT_NUMBER') {
      // 07 preFixWrong-OK-notNumber
      return phone.replace(regExp07, '$2');
    }
    if (type === 'PREFIX_WRONG-OK') {
      // 08 preFixWrong-OK
      return phone.replace(regExp08, '$2');
    }
    if (type === 'NOT_NUMBER-PREFIX-OK-NOT_NUMBER') {
      // 09 notNumber-preFix-OK-notNumber
      return phone.replace(regExp09, '$3');
    }
    if (type === 'NOT_NUMBER-PREFIX-OK') {
      // 10 notNumber-preFix-OK
      return phone.replace(regExp10, '$3');
    }
    if (type === 'NOT_NUMBER-OK-NOT_NUMBER') {
      // 11 notNumber-OK-notNumber
      return phone.replace(regExp11, '$2');
    }
    if (type === 'NOT_NUMBER-OK') {
      // 12 notNumber-OK
      return phone.replace(regExp12, '$2');
    }
    if (type === 'PREFIX-OK-NOT_NUMBER') {
      // 13 preFix-OK-notNumber
      return phone.replace(regExp13, '$2');
    }
    if (type === 'PREFIX-OK') {
      // 14 preFix-OK
      return phone.replace(regExp14, '$2');
    }
    if (type === 'OK-NOT_NUMBER') {
      // 15 OK-notNumber
      return phone.replace(regExp15, '$1');
    }
  }
  return phone;
}

/**
 * @typedef       {Object} phoneParts
 * @property      {number} nir - Nir of phone
 * @property      {number} series - Series of phone
 * @property      {number} numeration - Series of numeration
 *
 * @name          phoneGetParts
 * @description   Function that returns the information of a telephone, which is: nir, series, numeration.
 * @param         {String} phone - Phone number, only ten numbers
 * @returns       {phoneParts} Object with information of phone
 */
function phoneGetParts(phone) {
  if (isType(phone) === 'undefined') {
    throw new PhoneError('MISSING_PHONE');
  }
  if (isType(phone) !== 'string') {
    throw new PhoneError('NOT_STRING');
  }
  if (!regExpTenDigits.test(phone)) {
    throw new PhoneError('INVALID_FORMAT');
  }

  const test = parseInt(phone.slice(0, 2), 10);
  let nir;
  let serie;
  let numeration;
  if (nirs.includes(test)) {
    nir = parseInt(phone.slice(0, 2), 10);
    serie = parseInt(phone.slice(2, 6), 10);
    numeration = parseInt(phone.slice(6, 10), 10);
  } else {
    nir = parseInt(phone.slice(0, 3), 10);
    serie = parseInt(phone.slice(3, 6), 10);
    numeration = parseInt(phone.slice(6, 10), 10);
  }
  return { nir, serie, numeration };
}

/**
 * @typedef       {Object} phoneIFT
 * @property      {boolean} valid - Nir of phone
 * @property      {boolean} is_mobile - Series of phone
 * @property      {string} population - Series of numeration
 * @property      {string} township - Series of numeration
 * @property      {string} state - Series of numeration
 *
 * @typedef       {Object} phoneParts
 * @property      {string} nir - Nir of phone
 * @property      {string} series - Series of phone
 * @property      {string} numeration - Series of numeration
 *
 * @name					phoneGetIFT
 * @description	  Function that returns the IFT information of a telephone, which is: valid, is_mobile, population, township, state.
 * @param				  {phoneParts}  phoneParts - Object number with nir, series, numeration of a phone
 * @return				{phoneIFT}	Object with IFT information
 */
function phoneGetIFT(phoneParts) {
  if (isType(phoneParts) === 'undefined') {
    throw new PhoneError('MISSING_PHONE_PARTS');
  }
  if (isType(phoneParts) !== 'object') {
    throw new PhoneError('NOT_OBJECT');
  }
  if (!hasProperty(phoneParts, 'nir')) {
    throw new PhoneError(`Phone parts missing nir value`);
  }
  if (!hasProperty(phoneParts, 'serie')) {
    throw new PhoneError('Phone parts missing series value');
  }
  if (!hasProperty(phoneParts, 'numeration')) {
    throw new PhoneError('Phone parts missing numeration value');
  }
  const { nir, serie, numeration } = phoneParts;
  if (isType(nir) !== 'number') {
    throw new PhoneError(`Phone part nir value, is not number`);
  }
  if (isType(serie) !== 'number') {
    throw new PhoneError('Phone part series value, is not number');
  }
  if (isType(numeration) !== 'number') {
    throw new PhoneError('Phone part numeration value, is not number');
  }
  const DB = DBIFT;
  const result = DB.filter(record => {
    return (
      record.nir === nir &&
      record.serie === serie &&
      record.start <= numeration &&
      record.end >= numeration
    );
  });

  const isValid = result.length !== 0;
  if (!isValid) {
    return Object.assign(
      {},
      { ENCONTRADO: isValid, MÓVIL: '', POBLACIÓN: '', MUNICIPIO: '', ESTADO: '', COMPAÑIA: '' },
    );
  }
  // eslint-disable-next-line camelcase
  // válido, móvil, población, municipio, estado
  const { mobile, population, township, state, company } = result[0];
  return Object.assign(
    {},
    {
      ENCONTRADO: isValid,
      MÓVIL: mobile,
      POBLACIÓN: population,
      MUNICIPIO: township,
      ESTADO: state,
      COMPAÑIA: company,
    },
  );
}

/**
 * @name          phoneGetInfo
 * @description   Information of a telephone, if it is mobile, address
 * @param         {string} phone - Phone number
 * @returns       {Object} Object with information of a telephone
 */
function phoneGetInfo(phone) {
  if (isType(phone) === 'undefined') {
    throw new PhoneError('MISSING_PHONE');
  }
  if (isType(phone) !== 'string') {
    throw new PhoneError('NOT_STRING');
  }
  const evaluation = phoneGetEvaluation(phone);
  let IFT;
  let hasFormatted = false;
  let phoneFormatted = '';
  let phoneEvaluate;
  let isValidFormat;

  const { type, isFixed } = evaluation;

  if (isFixed !== 'WITH_REPLACE' || isFixed !== 'WITH_SECOND_SANITIZE' || isFixed !== 'READY') {
    isValidFormat = false;
  }

  if (isFixed === 'WITH_REPLACE' || isFixed === 'WITH_SECOND_SANITIZE') {
    hasFormatted = true;
    phoneFormatted = phoneSanetize(phone);
    phoneEvaluate = phoneFormatted;
    isValidFormat = true;
  }

  if (isFixed === 'READY') {
    phoneEvaluate = phone;
    isValidFormat = true;
  }

  if (isValidFormat === true) {
    const phoneParts = phoneGetParts(phoneEvaluate);
    IFT = phoneGetIFT(phoneParts);
  }

  const ok = isValidFormat;
  return Object.assign(
    {},
    isValidFormat ? { TELÉFONO: phone } : null,
    !isValidFormat ? { TELÉFONO: phone } : null,
    isValidFormat ? { ARREGLADO: hasFormatted } : null,
    isValidFormat ? { ARREGLO: phoneFormatted } : null,
    IFT || null,
    !isValidFormat ? { DETALLES: type } : null,
    !isValidFormat ? { 'TIENE ARREGLO': isFixed } : null,
    { VÁLIDO: ok },
  );
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const phone = (module.exports = exports = {}); // eslint-disable-line no-multi-assign

// » Main Modules
phone.getEvaluation = phoneGetEvaluation;
phone.sanetize = phoneSanetize;
phone.getParts = phoneGetParts;
phone.getIFT = phoneGetIFT;
phone.getInfo = phoneGetInfo;
