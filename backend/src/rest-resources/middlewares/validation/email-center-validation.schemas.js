export const createEmailTemplateSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      templateName: { type: 'string' },
      subjectName: { type: 'string' },
      contentHtml: { type: 'string' },
      dynamicFields: { type: 'array' },
      isActive: {
        type: ['string'],
        enum: ['true', 'false']
      },
      templateType: { type: 'string' }
    },
    required: ['templateName', 'subjectName', 'contentHtml', 'dynamicFields']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
        status: { type: 'number' }
      },
      required: ['message']
    }
  }
}

export const updateEmailTemplateSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      emailTemplateId: { type: 'number' },
      templateName: { type: 'string' },
      subjectName: { type: 'string' },
      contentHtml: { type: 'string' },
      dynamicFields: { type: 'array' },
      isActive: {
        type: ['string'],
        enum: ['true', 'false']
      },
      templateType: { type: 'string' }
    },
    required: ['emailTemplateId']
  }
}

export const deleteEmailTemplateSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      emailTemplateId: { type: 'number' }
    },
    required: ['emailTemplateId']
  }
}

export const defaultResponseSchema = {
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
        status: { type: 'number' }
      },
      required: ['message']
    }
  }
}
