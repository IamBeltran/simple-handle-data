/* eslint-disable prefer-object-spread */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
import email from '../email';
import phone from '../phone';

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const HandleCollectionErrors = {
  UNDEFINED_COLLECTION: 'Cannot handle collection, records is undefined or null',
  UNDEFINED_KEYFIELD: 'Cannot handle collection, key field is undefined or null',
  WRONG_TYPE_RECORDS: 'Cannot handle collection, array object required for records',
  WRONG_TYPE_KEYFIELD: 'Cannot handle collection, string required for key field',
  WRONG_TYPE_NEWNAMESFIELDS: 'Cannot handle collection, object required for new names fields',
  NOT_HAS_KEYFIELD: 'Some record not has key field',
  EXCEEDS_FIELD: 'Some record exceeds the number of fields',
  IS_NOT_DUPLE: 'Some record is not duple',
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
 * @description   Create a new HandleCollectionError
 * @class         HandleCollectionError
 * @extends       {Error}
 */
class HandleCollectionError extends Error {
  /**
   * @param   {String} [error='Default error message'] - Name of error
   * @param   {Object} addInfo - Additional error information
   */
  constructor(error = 'Default error message', addInfo) {
    super();
    const ERRORS = HandleCollectionErrors;
    const message = ERRORS[`${error}`] ? ERRORS[`${error}`] : error;
    this.name = 'HandleCollectionError';
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
 * @name          removeDuplicateInArray
 * @description   Function that removes duplicate elements in an array
 * @param         {Array} array - Array with duplicate elements
 * @returns       {Array} Returns a array without duplicate elements
 */
function removeDuplicateInArray(array) {
  return Array.from(new Set(array));
}

/**
 * @name          recordsHasKeyField
 * @description   Function that checks that all records have the key field (primary key)
 * @param         {Array.<Object>} collection - Array object with records
 * @param         {string} keyField - Name of the primary key that is verified
 * @returns       {boolean} True if all records have the key field, false if any does not have it
 */
function recordsHasKeyField(collection, keyField) {
  return collection.findIndex(record => !hasProperty(record, keyField)) === -1;
}

/**
 * @name          recordExceedsFieldLimit
 * @description   Function that checks that record have exact number values
 * @param         {Array.<Object>} collection - Array object with records
 * @param         {number} maxFields - Number of max field required for the record
 * @returns       {boolean} True if record have exact number values, false if any does not have it
 */
function recordExceedsFieldLimit(collection, maxFields) {
  return collection.findIndex(record => Object.keys(record).length > maxFields + 1) === -1;
}

/**
 * @name          recordsIsDuples
 * @description   Function that checks that record is duple
 * @param         {Array.<Object>} collection - Array object with records
 * @returns       {boolean} True if record is duple, false if any does not have it
 */
function recordsIsDuples(collection) {
  return collection.findIndex(record => Object.keys(record).length > 2) === -1;
}

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - HANDLE COLLECTION.                                              │
//  └───────────────────────────────────────────────────────────────────────────────────┘

/**
 * @name          groupValuesByKeyField
 * @description   Function to group the values of a collection, based on the key field
 * @param         {Array.<Object>} collection - Array object with records, collection type tuple
 * @param         {string} keyField - Name of the primary key that is verified
 * @param         {Object} newNamesFields - Name of the fields, if you want to rename
 * @param         {string} newNamesFields.nameKeyField - New name of key field
 * @param         {string} newNamesFields.nameValues - New name of field value
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', values:['value_01', 'value_02']}]
 */
function groupValuesByKeyField(collection, keyField, newNamesFields = {}) {
  const MAX_FIELDS = 20;
  const { nameKeyField, nameValues } = newNamesFields;

  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (isType(newNamesFields) !== 'object') {
    throw new HandleCollectionError('WRONG_TYPE_NEWNAMESFIELDS');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordExceedsFieldLimit(collection, MAX_FIELDS)) {
    throw new HandleCollectionError('EXCEEDS_FIELD');
  }

  return collection.map(record => {
    const { [keyField]: $keyValue, ...restFields } = record;
    const $values = Object.values(restFields);
    const main = { [`${nameKeyField || `${keyField}`}`]: $keyValue };
    const values = { [`${nameValues || 'values'}`]: $values };
    const dupleValues = Object.assign({}, main, values);
    return dupleValues;
  });
}

/**
 * @name          mergeDuplasValues
 * @description   Function that merge records with the same key field
 * @param         {Array.<Object>} collection - Array object with records, collection type duple
 * @param         {string} keyField - Name of the primary key that is verified
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', values:['value_01', 'value_02']}]
 */
function mergeDuplasValues(collection, keyField) {
  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordsIsDuples(collection)) {
    throw new HandleCollectionError('IS_NOT_DUPLE');
  }

  return collection.reduce((record, curr) => {
    const { [keyField]: $keyValue, ...restFields } = curr;
    const [$field, $values] = Object.entries(restFields).shift();
    const idx = record.reduce((n, item, i) => (item[keyField] === curr[keyField] ? i : n), -1);
    if (idx >= 0) {
      record[idx][$field] = record[idx][$field].concat($values);
    } else {
      if (isType($values) !== 'array') {
        curr[$field] = [$values];
      }
      record.push(curr);
    }
    return record;
  }, []);
}

/**
 * @name          removeDuplicateInDuplaValues
 * @description   Function that remove fields Duplicate with the same key field
 * @param         {Array.<Object>} collection - Array object with records
 * @param         {string} keyField - Name of the primary key that is verified
 * @param         {Object} newNamesFields - Name of the fields, if you want to rename
 * @param         {string} newNamesFields.nameKeyField - New name of key field
 * @param         {string} newNamesFields.nameValues - New name of field value
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', values:['value_01', 'value_02']}]
 */
function removeDuplicateInDuplaValues(collection, keyField, newNamesFields = {}) {
  const { nameKeyField, nameValues } = newNamesFields;

  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordsIsDuples(collection)) {
    throw new HandleCollectionError('IS_NOT_DUPLE');
  }

  return collection.map(record => {
    const { [keyField]: $keyField, ...rest } = record;
    const $values = Array.isArray(Object.values(rest))
      ? Object.values(rest).shift()
      : Object.values(rest);
    const main = { [`${nameKeyField || `${keyField}`}`]: $keyField };
    const values = { [`${nameValues || 'values'}`]: removeDuplicateInArray($values) };
    const dupleValues = Object.assign({}, main, values);
    return dupleValues;
  });
}

/**
 * @name          compactDupleValues
 * @description   Function that compacts records by returning it to a new entity with a key field and your value
 * @param         {Array.<Object>} collection - Array object with records
 * @param         {string} keyField - Name of the primary key that is verified
 * @param         {Object} newNamesFields - Name of the fields, if you want to rename
 * @param         {string} newNamesFields.nameKeyField - New name of key field
 * @param         {string} newNamesFields.nameValues - New name of field value
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', value:'value_01'}]
 */
function compactDupleValues(collection, keyField, newNamesFields = {}) {
  const { nameKeyField, nameValues } = newNamesFields;

  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordsIsDuples(collection)) {
    throw new HandleCollectionError('IS_NOT_DUPLE');
  }

  return collection.reduce((record, curr) => {
    const { [keyField]: $keyField, ...rest } = curr;
    const main = { [`${nameKeyField || `${keyField}`}`]: $keyField };
    const $values = Array.isArray(Object.values(rest))
      ? Object.values(rest).shift()
      : Object.values(rest);
    $values.map(item => {
      const value = { [`${nameValues || 'value'}`]: item };
      const $record = Object.assign({}, main, value);
      record.push($record);
      return item;
    });
    return record;
  }, []);
}

/**
 * @name          removeDuplicateDuplas
 * @description   Function that remove  duplicate records of a collection
 * @param         {Array.<Object>} collection - Array object with records type Duplas
 * @param         {string} keyField - Name of the primary key that is verified
 * @param         {Object} newNamesFields - Name of the fields, if you want to rename
 * @param         {string} newNamesFields.nameKeyField - New name of key field
 * @param         {string} newNamesFields.nameValues - New name of field value
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', value:'value_01'}]
 */
function removeDuplicateDuplas(collection, keyField, newNamesFields = {}) {
  const { nameKeyField, nameValues } = newNamesFields;

  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordsIsDuples(collection)) {
    throw new HandleCollectionError('IS_NOT_DUPLE');
  }

  return collection.reduce((record, curr) => {
    const { [keyField]: $keyValue, ...rest } = curr;
    const [$field, $values] = Object.entries(rest).shift();
    const isUniqueItem =
      record.find(item => {
        return item[keyField] === curr[keyField] && item[$field] === curr[$field];
      }) === undefined;
    if (isUniqueItem) {
      const main = { [`${nameKeyField || `${keyField}`}`]: $keyValue };
      const value = { [`${nameValues || `${$field}`}`]: $values };
      const duple = Object.assign({}, main, value);
      return record.concat([duple]);
    }
    return record;
  }, []);
}

/**
 * @name          filterCollectionEmail
 * @description   Function to filter collections in two invalid and valid groups
 * @param         {Array.<Object>} collection - Array object with records type Duplas
 * @returns       {Array.<Object>} Array object with two object array, eg.: { valid:[{id: 'id_01', value:'value_01']}, invalid:[{id: 'id_01', value:'value_01']}}
 */
function filterCollectionEmail(collection) {
  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  const validRecords = collection.filter(record => record.ok === true);
  const invalidRecords = collection.filter(record => record.ok !== true);
  return Object.assign({}, { valid: validRecords }, { invalid: invalidRecords });
}

/**
 * @name          filterCollectionPhone
 * @description   Function to filter collections in two invalid and valid groups
 * @param         {Array.<Object>} collection - Array object with records type Duplas
 * @returns       {Array.<Object>} Array object with two object array, eg.: { valid:[{id: 'id_01', value:'value_01']}, invalid:[{id: 'id_01', value:'value_01']}}
 */
function filterCollectionPhone(collection) {
  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  const match = collection.filter(record => record.ok === true && record.valid === true);
  const notMatch = collection.filter(record => record.ok === true && record.valid === false);
  const withoutFormat = collection.filter(record => record.ok !== true);
  return Object.assign({}, { match }, { notMatch }, { withoutFormat });
}

/**
 * @name          checkCollectionEmail
 * @description   Function to classify collections of electronic mail
 * @param         {Array.<Object>} collection - Array object with records type Duplas
 * @param         {string} keyField - Name of the primary key that is verified
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', value:'value_01'}]
 */
function checkCollectionEmail(collection, keyField) {
  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordsIsDuples(collection)) {
    throw new HandleCollectionError('IS_NOT_DUPLE');
  }
  return collection.reduce(async (previousPromise, curr) => {
    const collectionProm = await previousPromise;
    const { [keyField]: $keyField, ...rest } = curr;
    const $value = Object.values(rest).shift();
    const value = await email.getAddressInfo($value);
    const main = { [`${keyField}`]: $keyField };
    const duple = Object.assign({}, main, value);

    await collectionProm.push(duple);
    return collectionProm;
  }, Promise.resolve([]));
}

/**
 * @name          checkCollectionEmail
 * @description   Function to classify collections of phone
 * @param         {Array.<Object>} collection - Array object with records type Duplas
 * @param         {string} keyField - Name of the primary key that is verified
 * @returns       {Array.<Object>} Array object with two fields, eg.: [{id: 'id_01', value:'value_01'}]
 */
function checkCollectionPhone(collection, keyField) {
  if (collection === undefined) {
    throw new HandleCollectionError('UNDEFINED_COLLECTION');
  }
  if (keyField === undefined) {
    throw new HandleCollectionError('UNDEFINED_KEYFIELD');
  }
  if (isType(collection) !== 'array') {
    throw new HandleCollectionError('WRONG_TYPE_RECORDS');
  }
  if (isType(keyField) !== 'string') {
    throw new HandleCollectionError('WRONG_TYPE_KEYFIELD');
  }
  if (!recordsHasKeyField(collection, keyField)) {
    throw new HandleCollectionError('NOT_HAS_KEYFIELD');
  }
  if (!recordsIsDuples(collection)) {
    throw new HandleCollectionError('IS_NOT_DUPLE');
  }
  return collection.reduce((record, curr) => {
    const { [keyField]: $keyField, ...rest } = curr;
    const $value = Object.values(rest).shift();
    const value = phone.getInfo($value);
    const main = { [`${keyField}`]: $keyField };
    const duple = Object.assign({}, main, value);

    record.push(duple);
    return record;
  }, []);
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-multi-assign
const handleCollection = {};

// Main Modules
handleCollection.groupValuesByKeyField = groupValuesByKeyField;
handleCollection.mergeDuplasValues = mergeDuplasValues;
handleCollection.removeDuplicateInDuplaValues = removeDuplicateInDuplaValues;
handleCollection.compactDupleValues = compactDupleValues;
handleCollection.removeDuplicateDuplas = removeDuplicateDuplas;
handleCollection.filterCollectionEmail = filterCollectionEmail;
handleCollection.filterCollectionPhone = filterCollectionPhone;
handleCollection.checkCollectionEmail = checkCollectionEmail;
handleCollection.checkCollectionPhone = checkCollectionPhone;

export default handleCollection;
