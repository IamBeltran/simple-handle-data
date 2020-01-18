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
const PNNFileJSON = require('./PNNDB.json');
const sendNotification = require('../helpers/sendNotification');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  information: {
    updated: { IFT: IFTFileUpdated, PNN: PNNFileUpdated },
  },
} = PNNFileJSON;

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
        PNN: '2019-12-20',
      },
    },
    NIRS: [],
    PNN: [], // PLAN NACIONAL DE MARCACÍON
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
              PNN: {
                type: 'string',
                format: 'date',
              },
            },
            additionalProperties: false,
            required: ['IFT', 'PNN'],
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
      PNN: {
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
    required: ['information', 'NIRS', 'PNN'],
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
      clearInvalidConfig: true,
    });
    this.database = this.get('database') || null;
  }

  setDatabaseFromFile(action) {
    try {
      this.set('database', PNNFileJSON);
      return this;
    } catch (error) {
      throw new Error(`Error in operation type ${action}`);
    }
  }

  checkStore() {
    const hasDatabase = !!this.database;
    const updatedIFT = this.get('database.information.updated.IFT') || null;
    const updatedPNN = this.get('database.information.updated.PNN') || null;
    const updated = hasDatabase && (updatedIFT === IFTFileUpdated && updatedPNN === PNNFileUpdated);
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

  getPNN() {
    const hasDatabase = !!this.database;
    if (!hasDatabase) {
      return null;
    }
    return this.get('database.PNN');
  }
}

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ INSTANCE CLASS                                                                    │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const dataStore = new DataStore().checkStore();

const INFORMATION = dataStore.getInformation();
const NIRS = dataStore.getNIRS();
const PNN = dataStore.getPNN();

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const DATASTORE = (module.exports = exports = {}); // eslint-disable-line no-multi-assign

// » Main Modules
DATASTORE.INFORMATION = INFORMATION;
DATASTORE.NIRS = NIRS;
DATASTORE.PNN = PNN;
