export const bannerUploadSchemas = {
  bodySchema: {
    $ref: '/banner-upload.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createBanner: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const bannerUpdateSchemas = {
  bodySchema: {
    $ref: '/banner-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateBanner: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const bannerDeleteSchemas = {
  bodySchema: {
    $ref: '/banner-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const bannerGetAllSchemas = {
  querySchema: {
    $ref: '/banner-get.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        banners: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const bannerKeysSchemas = {
  bodySchema: {
    $ref: '/banner-keys.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        bannerKey: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const bannerOrderSchemas = {
  bodySchema: {
    $ref: '/order-banner.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}
