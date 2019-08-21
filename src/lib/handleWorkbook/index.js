/* eslint-disable no-async-promise-executor */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
import XLSX from 'xlsx';

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
import getTimestamp from '../getTimeStamp';
import handleCollection from '../handleCollection';

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  groupValuesByKeyField,
  mergeDuplasValues,
  removeDuplicateInDuplaValues,
  compactDupleValues,
  removeDuplicateDuplas,
  filterCollectionEmail,
  filterCollectionPhone,
  checkCollectionEmail,
  checkCollectionPhone,
} = handleCollection;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const HandleWorkbookErrors = {
  UNDEFINED_WORKBOOK: 'The value of workbook is undefined',
  WRONG_TYPE_WORKBOOK: 'The value of workbook is wrong, requiere a object',
  UNDEFINED_TYPE_COLLECTION: 'The value of type collection is undefined',
  WRONG_TYPE_COLLECTION: 'The value of type collection is wrong, requiere a string',
  WRONG_NAME_COLLECTION: 'The name of type collection is wrong, the allowed are tuple or dupla',
  MAX_SHEETS: '',
  EMPTY_WORKBOOK: '',
  WRONG_START_RANGE: '',
  MAX_COLUMS_TUPLA: '',
  MAX_COLUMS_DUPLA: '',
  UNDEFINED_JSONDATA: '',
  UNDEFINED_WORKBOOK_OPTIONS: '',
  UNDEFINED_COLLECTION_OPTION: '',
  UNDEFINED_DATA_OPTION: '',
  WRONG_NAME_DATA: '',
};

const columns = [
  'A', 'B', 'C', 'D', 'E', // eslint-disable-line prettier/prettier
  'F', 'G', 'H', 'I', 'J', // eslint-disable-line prettier/prettier
  'K', 'L', 'M', 'N', 'O', // eslint-disable-line prettier/prettier
  'P', 'Q', 'R', 'S', 'T', // eslint-disable-line prettier/prettier
  'U', 'V', 'W', 'X', 'Y', // eslint-disable-line prettier/prettier
  'Z',
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
 * @description   Create a new HandleWorkbookError
 * @class         HandleWorkbookError
 * @extends       {Error}
 */
class HandleWorkbookError extends Error {
  /**
   * @param   {String} [error='Default error message'] - Name of error
   * @param   {Object} addInfo - Additional error information
   */
  constructor(error = 'Default error message', addInfo) {
    super();
    const ERRORS = HandleWorkbookErrors;
    const message = ERRORS[`${error}`] ? ERRORS[`${error}`] : error;
    this.name = 'HandleWorkbookError';
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
//  │ SET MAIN MODULE - [NAME-MODULE].                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘

/**
 * @name          getInfoSheets
 * @description   Function that returns information from a workbook
 * @param         {Object} workbook
 * @returns       {Object} Information from sheets of a book
 */
function getInfoSheets(workbook) {
  const {
    Props: { SheetNames },
    Sheets,
  } = workbook;
  const sheetsInfo = Object.keys(Sheets).reduce((sheet, curr) => {
    const rangeEmpty = { s: { c: null, r: null }, e: { c: null, r: null } };
    const isEmpty = !Sheets[curr]['!ref'];
    const ref = Sheets[curr]['!ref'] ? Sheets[curr]['!ref'] : null;
    const range = !isEmpty ? XLSX.utils.decode_range(Sheets[curr]['!ref']) : rangeEmpty;
    const {
      s: { c: SC, r: SR },
      e: { c: EC, r: ER },
    } = range;
    const item = {
      sheetName: curr,
      empty: isEmpty,
      ref,
      range: {
        SC,
        SR,
        EC,
        ER,
      },
    };
    sheet.push(item);
    return sheet;
  }, []);
  return {
    sheetsName: SheetNames,
    sheetsNumber: SheetNames.length,
    sheetsInfo,
  };
}

/**
 * @name          getRange
 * @description   Function that returns range of a worksheet
 * @param         {{SC: Number, SR: Number, EC: Number, ER: Number}} range - range of a worksheet
 * @returns       {string} Range where the data is in a worksheet
 */
function getRange(range) {
  const { SC, SR, EC, ER } = range;
  const start = `${columns[SC]}${SR + 2}`;
  const end = `${columns[EC]}${ER + 1}`;
  return `${start}:${end}`;
}

/**
 * @name          getHeaders
 * @description   Function that returns headers of a worksheet
 * @param         {{SC: Number, SR: Number, EC: Number, ER: Number}} range - range of a worksheet
 * @returns       {string[]} Header where the data is in a worksheet
 */
function getHeaders(range) {
  const { EC } = range;
  const headers = ['id'];
  for (let index = 0; index < EC; index += 1) {
    headers.push(`value${index + 1}`);
  }
  return headers;
}

/**
 *
 * @name          sheetToJSON
 * @description   Function that returns information from a worksheet to json format
 * @param         {Object} workbook
 * @returns       {Promise} Promise if resolve return a object or error if reject
 */
function sheetToJSON(workbook, collection) {
  return new Promise((resolve, reject) => {
    try {
      if (workbook === undefined) {
        return reject(new HandleWorkbookError('UNDEFINED_WORKBOOK'));
      }
      if (collection === undefined) {
        return reject(new HandleWorkbookError('UNDEFINED_TYPE_COLLECTION'));
      }
      if (isType(workbook) !== 'object') {
        return reject(new HandleWorkbookError('WRONG_TYPE_WORKBOOK'));
      }
      if (isType(collection) !== 'string') {
        return reject(new HandleWorkbookError('WRONG_TYPE_COLLECTION'));
      }
      if (collection !== 'tuple' && collection !== 'dupla') {
        return reject(new HandleWorkbookError('WRONG_NAME_COLLECTION'));
      }
      const MAX_COLUMS_TUPLE = 25;
      const MAX_COLUMS_DUPLA = 1;
      const MAX_SHEETS = 1;
      const infoSheets = getInfoSheets(workbook);
      const { sheetsName, sheetsNumber, sheetsInfo } = infoSheets;
      if (sheetsNumber !== MAX_SHEETS) {
        return reject(new HandleWorkbookError('MAX_SHEETS')); // exceeded max sheets
      }
      const [sheetInfo] = sheetsInfo;
      const [sheetName] = sheetsName;
      const { empty, range } = sheetInfo;
      const { SC, SR, EC } = range;
      if (empty === true) {
        return reject(new HandleWorkbookError('EMPTY_WORKBOOK'));
      }
      if (SC !== 0 && SR !== 0) {
        return reject(new HandleWorkbookError('WRONG_START_RANGE'));
      }
      if (collection === 'tuple' && EC > MAX_COLUMS_TUPLE) {
        return reject(new HandleWorkbookError('MAX_COLUMS_TUPLA'));
      }
      if (collection === 'dupla' && EC > MAX_COLUMS_DUPLA) {
        return reject(new HandleWorkbookError('MAX_COLUMS_DUPLA'));
      }
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        range: getRange(range),
        header: getHeaders(range),
      });
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

function createWorkbook(JSONDATA, options) {
  return new Promise(async (resolve, reject) => {
    try {
      if (JSONDATA === undefined) {
        return reject(new HandleWorkbookError('UNDEFINED_JSONDATA'));
      }
      if (options === undefined) {
        return reject(new HandleWorkbookError('UNDEFINED_WORKBOOK_OPTIONS'));
      }
      if (!hasProperty(options, 'collection')) {
        return reject(new HandleWorkbookError('UNDEFINED_COLLECTION_OPTION'));
      }
      if (!hasProperty(options, 'data')) {
        return reject(new HandleWorkbookError('UNDEFINED_DATA_OPTION'));
      }
      const { collection, data } = options;
      if (collection !== 'tuple' && collection !== 'dupla') {
        return reject(new HandleWorkbookError('WRONG_NAME_COLLECTION'));
      }
      if (data !== 'email' && data !== 'phone') {
        return reject(new HandleWorkbookError('WRONG_NAME_DATA'));
      }
      const workbook = XLSX.utils.book_new();
      let records;
      if (collection === 'tuple' && data === 'email') {
        records = groupValuesByKeyField(JSONDATA, 'id');
        records = mergeDuplasValues(records, 'id');
        records = removeDuplicateInDuplaValues(records, 'id');
        records = compactDupleValues(records, 'id');
        records = await checkCollectionEmail(records, 'id');
        records = filterCollectionEmail(records);
        const { valid, invalid } = records;
        const workSheetValid = XLSX.utils.json_to_sheet(valid);
        const workSheetInvalid = XLSX.utils.json_to_sheet(invalid);
        XLSX.utils.book_append_sheet(workbook, workSheetValid, 'Valid Emails');
        XLSX.utils.book_append_sheet(workbook, workSheetInvalid, 'Invalid Emails');
      }
      if (collection === 'tuple' && data === 'phone') {
        records = groupValuesByKeyField(JSONDATA, 'id');
        records = mergeDuplasValues(records, 'id');
        records = removeDuplicateInDuplaValues(records, 'id');
        records = compactDupleValues(records, 'id');
        records = checkCollectionPhone(records, 'id');
        records = filterCollectionPhone(records);
        const { match, notMatch, withoutFormat } = records;
        const workSheetMatch = XLSX.utils.json_to_sheet(match);
        const workSheetNotMatch = XLSX.utils.json_to_sheet(notMatch);
        const workSheetWithoutFormat = XLSX.utils.json_to_sheet(withoutFormat);
        XLSX.utils.book_append_sheet(workbook, workSheetMatch, 'Valid Phones');
        XLSX.utils.book_append_sheet(workbook, workSheetNotMatch, 'Invalid Phones');
        XLSX.utils.book_append_sheet(workbook, workSheetWithoutFormat, 'Phones Without Format');
      }
      if (collection === 'dupla' && data === 'email') {
        records = removeDuplicateDuplas(JSONDATA, 'id');
        records = await checkCollectionEmail(records, 'id');
        records = filterCollectionEmail(records);
        const { valid, invalid } = records;
        const workSheetValid = XLSX.utils.json_to_sheet(valid);
        const workSheetInvalid = XLSX.utils.json_to_sheet(invalid);
        XLSX.utils.book_append_sheet(workbook, workSheetValid, 'Valid Emails');
        XLSX.utils.book_append_sheet(workbook, workSheetInvalid, 'Invalid Emails');
      }
      if (collection === 'dupla' && data === 'phone') {
        records = removeDuplicateDuplas(JSONDATA, 'id');
        records = checkCollectionPhone(records, 'id');
        records = filterCollectionPhone(records);
        const { match, notMatch, withoutFormat } = records;
        const workSheetMatch = XLSX.utils.json_to_sheet(match);
        const workSheetNotMatch = XLSX.utils.json_to_sheet(notMatch);
        const workSheetWithoutFormat = XLSX.utils.json_to_sheet(withoutFormat);
        XLSX.utils.book_append_sheet(workbook, workSheetMatch, 'Valid Phones');
        XLSX.utils.book_append_sheet(workbook, workSheetNotMatch, 'Invalid Phones');
        XLSX.utils.book_append_sheet(workbook, workSheetWithoutFormat, 'Phones Without Format');
      }
      const timestamp = getTimestamp();
      const filename = `${timestamp}_${data}.xlsx`;
      return resolve({ wb: workbook, filename });
    } catch (error) {
      return reject(error);
    }
  });
}

/**
 * @name          writeXLSXFile
 * @description   Function that write a XLSX File
 * @param         {Object} workbook
 * @returns       {Promise.<boolean>} Promise if resolve return a true or false if reject
 */
function writeXLSXFile(workbook, options) {
  return new Promise((resolve, reject) => {
    if (workbook === undefined) {
      return reject(new HandleWorkbookError('UNDEFINED_WORKBOOK'));
    }
    if (isType(workbook) !== 'object') {
      return reject(new HandleWorkbookError('WRONG_TYPE_WORKBOOK'));
    }
    if (options === undefined) {
      return reject(new HandleWorkbookError('UNDEFINED_WORKBOOK_OPTIONS'));
    }
    if (!hasProperty(options, 'collection')) {
      return reject(new HandleWorkbookError('UNDEFINED_COLLECTION_OPTION'));
    }
    if (!hasProperty(options, 'data')) {
      return reject(new HandleWorkbookError('UNDEFINED_DATA_OPTION'));
    }
    const { collection, data } = options;
    if (collection !== 'tuple' && collection !== 'dupla') {
      return reject(new HandleWorkbookError('WRONG_NAME_COLLECTION'));
    }
    if (data !== 'email' && data !== 'phone') {
      return reject(new HandleWorkbookError('WRONG_NAME_DATA'));
    }
    const timestamp = getTimestamp();
    const filename = `${timestamp}_${data}.xlsx`;
    return XLSX.writeFileAsync(filename, workbook, error => {
      return error ? reject(error) : resolve(true);
    });
  });
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const handleWorkbook = {};

handleWorkbook.getInfoSheets = getInfoSheets;
handleWorkbook.sheetToJSON = sheetToJSON;
handleWorkbook.createWorkbook = createWorkbook;
handleWorkbook.writeXLSXFile = writeXLSXFile;

export default handleWorkbook;
