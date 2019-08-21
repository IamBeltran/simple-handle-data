//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const Store = require('electron-store');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const IFTFileJSON = require('./IFT.json');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  update: { IFT, database },
} = IFTFileJSON;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
// const serialize = value => JSON.stringify(value);
const serialize = value => JSON.stringify(value, null, 2);
// const encryptionKey = "oiV32mVp5lOwYneFESjrWq2xFByNOvNj";
const IFTSchema = {
  IFT: {
    type: 'object',
    properties: {
      version: {
        type: 'object',
        properties: {
          API: { type: 'string' },
          APP: { type: 'string' },
        },
        additionalProperties: false,
        required: ['API', 'APP'],
      },
      update: {
        type: 'object',
        properties: {
          IFT: { type: 'string' },
          database: { type: 'string' },
        },
        additionalProperties: false,
        required: ['IFT', 'database'],
      },
      nirs: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
      database: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            population: { type: 'string' },
            township: { type: 'string' },
            state: { type: 'string' },
            nir: { type: 'number' },
            serie: { type: 'number' },
            start: { type: 'number' },
            end: { type: 'number' },
            mobile: { type: 'boolean' },
          },
          additionalProperties: false,
          required: ['population', 'township', 'state', 'nir', 'serie', 'start', 'end', 'mobile'],
        },
      },
    },
    additionalProperties: false,
    required: ['version', 'update', 'nirs', 'database'],
  },
};

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - [NAME-MODULE].                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘

/**
 * @author        Victor Giovanni Beltrán Rodríguez
 * @version       2.0.0
 * @description   Create a new IFTStore, class for create
 * @class         IFTStore
 * @extends       {Store}
 */
class IFTStore extends Store {
  constructor() {
    super({ name: 'IFTStore', schema: IFTSchema, serialize });
    const updateIFT = this.get('IFT.update.IFT') || null;
    const updateDB = this.get('IFT.update.database') || null;
    this.hasStore = !!this.get('IFT');
    this.updated = this.hasStore && (IFT === updateIFT && database === updateDB);
    this.IFT = this.get('IFT') || null;
  }

  setupStore() {
    if (!this.hasStore) {
      this.set('IFT', IFTFileJSON);
      this.hasStore = true;
      this.updated = true;
    }
    if (!this.updated) {
      this.set('IFT', IFTFileJSON);
      this.updated = true;
    }
    this.IFT = this.get('IFT');
    return this;
  }
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
module.exports = IFTStore;
