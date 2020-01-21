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
const PNMFileJSON = require('./PNMDB.json');
const sendNotification = require('../utils/sendNotification');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  information: {
    updated: { IFT: IFTFileUpdated, PNM: PNMFileUpdated },
  },
} = PNMFileJSON;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const nameStore = 'store';
const serialize = value => JSON.stringify(value, null, 2);
const encryptionKey = 'oiV32mVp5lOwYneFESjrWq2xFByNOvNj';
const defaults = {
  database: {
    information: {
      version: {
        APP: '1.0.0',
        API: '2.0.0',
      },
      updated: {
        IFT: '2019-12-20',
        PNM: '2019-12-20',
      },
    },
    NIRS: [],
    PNM: [], // PLAN NACIONAL DE MARCACÍON
  },
};
const schema = {
  database: {
    type: 'object',
    properties: {
      information: {
        type: 'object',
        properties: {
          version: {
            type: 'object',
            properties: {
              APP: {
                type: 'string',
              },
              API: {
                type: 'string',
              },
            },
            additionalProperties: false,
            required: ['APP', 'API'],
          },
          updated: {
            type: 'object',
            properties: {
              IFT: {
                type: 'string',
                format: 'date',
              },
              PNM: {
                type: 'string',
                format: 'date',
              },
            },
            additionalProperties: false,
            required: ['IFT', 'PNM'],
          },
        },
        additionalProperties: false,
        required: ['version', 'updated'],
      },
      NIRS: {
        type: 'array',
        items: {
          type: 'number',
        },
        uniqueItems: true,
      },
      PNM: {
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
            company: { type: 'string' },
          },
          additionalProperties: true,
          required: [
            'population',
            'township',
            'state',
            'nir',
            'serie',
            'start',
            'end',
            'mobile',
            'company',
          ],
        },
      },
    },
    additionalProperties: false,
    required: ['information', 'NIRS', 'PNM'],
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
 * @description   Create a new Database, class for create
 * @class         Database
 * @extends       {Store}
 */
class DataStore extends Store {
  constructor() {
    super({
      name: nameStore,
      defaults,
      encryptionKey,
      serialize,
      schema,
    });
    this.database = this.get('database') || null;
  }

  setDatabaseFromFile(action) {
    try {
      this.set('database', PNMFileJSON);
      return this;
    } catch (error) {
      throw new Error(`Error in operation type ${action}`);
    }
  }

  checkStore() {
    const hasDatabase = !!this.database;
    const updatedIFT = this.get('database.information.updated.IFT') || null;
    const updatedPNM = this.get('database.information.updated.PNM') || null;
    // eslint-disable-next-line prettier/prettier
    const updated = hasDatabase && updatedIFT === IFTFileUpdated && updatedPNM === PNMFileUpdated;
    if (!hasDatabase) {
      this.setDatabaseFromFile('CREATE');
      sendNotification({
        title: 'SIMPLE HANDLE DATA',
        message: 'BASE DE DATOS CREADA',
        type: 'info',
      });
    }
    if (hasDatabase && !updated) {
      this.clear();
      this.setDatabaseFromFile('UPDATE');
      sendNotification({
        title: 'SIMPLE HANDLE DATA',
        message: 'BASE DE DATOS ACTUALIZADA',
        type: 'info',
      });
    }
    if (hasDatabase && updated) {
      sendNotification({
        title: 'SIMPLE HANDLE DATA',
        message: 'BASE DE DATOS SIN PROBLEMAS',
        type: 'info',
      });
    }
    return this;
  }

  getInformation() {
    const hasDatabase = !!this.database;
    if (!hasDatabase) {
      return null;
    }
    return this.get('database.information');
  }

  getNIRS() {
    const hasDatabase = !!this.database;
    if (!hasDatabase) {
      return null;
    }
    return this.get('database.NIRS');
  }

  getPNM() {
    const hasDatabase = !!this.database;
    if (!hasDatabase) {
      return null;
    }
    return this.get('database.PNM');
  }
}

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ INSTANCE CLASS                                                                    │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const dataStore = new DataStore().checkStore();

const INFORMATION = dataStore.getInformation();
const NIRS = dataStore.getNIRS();
const PNM = dataStore.getPNM();

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const DATASTORE = (module.exports = exports = {}); // eslint-disable-line no-multi-assign

// » Main Modules
DATASTORE.INFORMATION = INFORMATION;
DATASTORE.NIRS = NIRS;
DATASTORE.PNM = PNM;
