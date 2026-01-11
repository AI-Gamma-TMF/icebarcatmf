import config from './app.config'

const commonSetting = {
  database: config.get('db.name'),
  replication: {
    read: {
      username: config.get('db.username'),
      password: config.get('db.password'),
      host: config.get('db.readHost'),
      port: config.get('db.port')
    },
    write: {
      username: config.get('db.username'),
      password: config.get('db.password'),
      host: config.get('db.writeHost'),
      port: config.get('db.port')
    }
  },
  dialect: 'postgres',
  dialectOptions: {
    application_name: config.get('app.name'),
    ...(config.get('db.ssl')
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {})
  },
  define: {
    underscored: true,
    timestamps: true
  },
  logging: true,
  benchmark: true,
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_migration_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seed_meta'
}

export const development = {
  ...commonSetting,
  pool: {
    max: 50,
    min: 5,
    idle: 5000,
    evict: 5000,
    acquire: 200000
  }
}

export const test = {
  ...commonSetting,
  pool: {
    max: 100,
    min: 5,
    idle: 5000,
    evict: 5000,
    acquire: 200000
  }
}

export const staging = {
  ...commonSetting,
  pool: {
    max: 150,
    min: 5,
    idle: 5000,
    evict: 5000,
    acquire: 200000
  }
}

export const production = {
  ...commonSetting,
  pool: {
    max: 200,
    min: 5,
    idle: 5000,
    evict: 5000,
    acquire: 200000
  }
}
