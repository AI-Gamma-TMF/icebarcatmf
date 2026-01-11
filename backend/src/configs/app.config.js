import convict from 'convict'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))

  for (const key in envConfig) {
    process.env[key] = envConfig[key]
  }
}

const config = convict({
  app: {
    name: {
      doc: 'Name of the service',
      format: String,
      default: 'moneyFactory-admin-backend'
    },
    url: {
      doc: 'URL of the service',
      format: String,
      default: 'user-backend:8003',
      env: 'APP_URL'
    },
    appName: {
      doc: 'Name of the application',
      format: String,
      default: 'Money Factory Admin Backend',
      env: 'APP_NAME'
    }
  },

  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'pre-prod'],
    default: 'development',
    env: 'NODE_ENV'
  },

  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT'
  },

  origin: {
    doc: 'cors origin',
    format: String,
    default: 'true',
    env: 'ORIGIN'
  },

  db: {
    name: {
      doc: 'Database Name',
      format: String,
      default: 'api',
      env: 'DB_NAME'
    },
    username: {
      doc: 'Database user',
      format: String,
      default: 'postgres',
      env: 'DB_USERNAME'
    },
    password: {
      doc: 'Database password',
      format: '*',
      default: 'postgres',
      env: 'DB_PASSWORD'
    },
    ssl: {
      doc: 'Enable SSL for Postgres connections (needed for many managed Postgres providers, including DigitalOcean)',
      format: Boolean,
      default: false,
      env: 'DB_SSL'
    },
    readHost: {
      doc: 'DB read host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_READ_HOST'
    },
    writeHost: {
      doc: 'DB write host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_WRITE_HOST'
    },
    port: {
      doc: 'DB PORT',
      format: 'port',
      default: '5432',
      env: 'DB_PORT'
    }
  },
  logConfig: {
    maxSize: {
      default: '50m',
      env: 'WINSTON_LOG_MAX_SIZE'
    },
    maxFiles: {
      default: '10d',
      env: 'WINSTON_MAX_FILES_DURATION'
    },
    dirname: {
      default: 'logs',
      env: 'WINSTON_LOG_DIR'
    },
    datePattern: {
      default: 'YYYY-MM-DD-HH',
      env: 'WINSTON_FILE_NAME_DATE_PATTERN'
    },
    zippedArchive: {
      default: true,
      env: 'WINSTON_ZIPPED_ARCHIVE'
    }
  },
  redis_db: {
    password: {
      doc: 'Redis Database password',
      format: '*',
      default: '',
      env: 'REDIS_DB_PASSWORD'
    },
    host: {
      doc: 'Redis DB host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'REDIS_DB_PORT'
    },
    tls: {
      doc: 'Enable TLS for Redis connection (needed for many managed Redis providers, including DigitalOcean)',
      format: Boolean,
      default: false,
      env: 'REDIS_DB_TLS'
    }
  },

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },
  jwt: {
    loginTokenSecret: {
      default: '',
      env: 'JWT_LOGIN_SECRET'
    },
    loginTokenExpiry: {
      default: '2d',
      env: 'JWT_LOGIN_TOKEN_EXPIRY'
    },
    verificationTokenSecret: {
      default: '',
      env: 'VERIFICATION_TOKEN_SECRET'
    },
    verificationTokenExpiry: {
      default: '120s',
      env: 'VERIFICATION_TOKEN_EXPIRY'
    },
    secretKey: {
      default: '',
      env: 'SECRET_KEY'
    },
    resetPasswordKey: {
      default: '',
      env: 'RESET_PASSWORD_KEY'
    },
    resetPasswordExpiry: {
      default: '',
      env: 'RESET_PASSWORD_EXPIRY'
    },
    emailTokenExpiry: {
      default: '1d',
      env: 'EMAIL_TOKEN_EXPIRY'
    },
    emailTokenKey: {
      default: '',
      env: 'EMAIL_TOKEN_KEY'
    }
  },
  elastic: {
    url: {
      default: '',
      env: 'ELASTIC_URL'
    },
    id: {
      default: '',
      env: 'ELASTIC_CLOUD_ID'
    },
    user: {
      default: '',
      env: 'ELASTIC_USER'
    },
    password: {
      default: '',
      env: 'ELASTIC_PASSWORD'
    },
    httpCrtPath: {
      default: '',
      env: 'ELASTIC_HTTP_CRT_PATH'
    }
  },
  s3: {
    region: {
      doc: 'Region where s3 located.',
      format: String,
      default: 'us-east-1',
      env: 'S3_REGION'
    },
    endpoint: {
      doc: 'Optional S3-compatible endpoint (e.g., DigitalOcean Spaces: https://nyc3.digitaloceanspaces.com)',
      format: String,
      default: '',
      env: 'S3_ENDPOINT'
    },
    bucket: {
      doc: 'Bucket used in S3',
      format: String,
      default: '',
      env: 'S3_BUCKET'
    },
    access_key_id: {
      doc: 'Access key for s3.',
      format: String,
      default: '',
      env: 'S3_ACCESS_KEY_ID'
    },
    secret_access_key: {
      doc: 'Secret key for s3.',
      format: String,
      default: '',
      env: 'S3_SECRET_ACCESS_KEY'
    },
    S3_DOMAIN_KEY_PREFIX: {
      doc: 'S3 domain PREFIX key for s3.',
      format: String,
      default: '',
      env: 'S3_DOMAIN_KEY_PREFIX'
    }
  },
  credentialEncryptionKey: {
    default: '',
    env: 'CREDENTIAL_ENCRYPTION_KEY'
  },
  jobScheduler: {
    url: {
      default: '',
      format: String,
      env: 'JOB_SCHEDULER_ADDRESS'
    },
    authKey: {
      default: '',
      format: String,
      env: 'JOB_SCHEDULER_AUTH'
    }
  },
  payment: {
    paysafe: {
      base_url: {
        format: String,
        default: '',
        env: 'PAYSAFE_BASE_URL'
      },
      username: {
        format: String,
        default: '',
        env: 'PAYSAFE_API_USERNAME'
      },
      password: {
        format: String,
        default: '',
        env: 'PAYSAFE_API_PASSWORD'
      },
      account_id: {
        format: String,
        default: '',
        env: 'PAYSAFE_ACCOUNT_ID'
      }
    }
  },
  adminBeUrl: {
    format: String,
    default: '',
    env: 'ADMIN_BE_URL'
  },
  userFrontendUrl: {
    doc: 'User Frontend Url',
    format: String,
    default: '',
    env: 'USER_FRONTEND_URL'
  },
  adminFrontendUrl: {
    doc: 'Admin Frontend Url',
    format: String,
    default: '',
    env: 'ADMIN_FRONTEND_URL'
  },
  gSoft: {
    sinartra_game_url: {
      doc: 'Base Api for GSoft Games',
      format: String,
      default: '',
      env: 'GSOFT_SINARTRA_GAME_URL'
    },
    version: {
      doc: 'API version',
      format: String,
      default: '',
      env: 'GSOFT_API_VERSION'
    },
    email: {
      doc: 'Email to login on gSoft',
      format: String,
      default: '',
      env: 'GSOFT_USER_EMAIL'
    },
    password: {
      doc: 'Password to login on gSoft',
      format: String,
      default: '',
      env: 'GSOFT_USER_PASSWORD'
    }
  },
  alea: {
    casino_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_ID'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_KEY'
    },
    secret_token: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_TOKEN'
    }
  },
  send_grid: {
    api_key: {
      doc: 'SendGrid API Key',
      format: String,
      default: '',
      env: 'SEND_GRID_API_KEY'
    },
    base_url: {
      doc: 'SendGrid Base Url',
      format: String,
      default: '',
      env: 'SEND_GRID_BASE_URL'
    },
    sender_email: {
      doc: 'SendGrid Sender Email',
      format: String,
      default: '',
      env: 'SEND_GRID_FROM_EMAIL'
    },
    sender_name: {
      doc: 'SendGrid Sender Name',
      format: String,
      default: '',
      env: 'SEND_GRID_FROM_NAME'
    }
  },
  scaleo: {
    base_url: {
      format: String,
      default: '',
      env: 'SCALEO_BASE_URL'
    },
    api_key: {
      format: String,
      default: '',
      env: 'SCALEO_API_KEY'
    }
  },
  beterLive: {
    casino: {
      format: String,
      default: '',
      env: 'BETER_CASINO'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'BETER_SECRET_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'BETER_BASE_URL'
    }
  },
  sumSub: {
    url: {
      format: String,
      default: '',
      env: 'SUM_SUB_URL'
    },
    token: {
      format: String,
      default: '',
      env: 'SUM_SUB_TOKEN'
    },
    secret: {
      format: String,
      default: '',
      env: 'SUM_SUB_SECRET'
    }
  },
  optimove: {
    base_url: {
      format: String,
      default: '',
      env: 'OPTIMOVE_BASE_URL'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'OPTIMOVE_SECRET_KEY'
    }
  },
  pragmaticPlay: {
    secureScLogin: {
      format: String,
      default: '',
      env: 'PRAGMATIC_SECURE_SC_LOGIN'
    },
    secureGcLogin: {
      format: String,
      default: '',
      env: 'PRAGMATIC_SECURE_GC_LOGIN'
    },
    secretScKey: {
      format: String,
      default: '',
      env: 'PRAGMATIC_SECRET_SC_KEY'
    },
    secretGcKey: {
      format: String,
      default: '',
      env: 'PRAGMATIC_SECRET_GC_KEY'
    },
    baseUrl: {
      format: String,
      default: '',
      env: 'PRAGMATIC_BASE_URL'
    }
  },
  mancala: {
    clientGuid: {
      format: String,
      default: '',
      env: 'MANCALA_CLIENT_GUID'
    },
    apiKey: {
      format: String,
      default: '',
      env: 'MANCALA_API_KEY'
    },
    apiUrl: {
      format: String,
      default: '',
      env: 'MANCALA_API_URL'
    },
    apiTournamentUrl: {
      format: String,
      default: '',
      env: 'MANCALA_API_TOURNAMENT_URL'
    }
  }
})

config.validate({ allowed: 'strict' })

export default config
