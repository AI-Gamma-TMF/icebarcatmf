import _ from 'lodash'

export const getOne = async ({ model, data = {}, attributes = [], include = [], order = [], raw = false }) => {
  let query = { raw, where: data, include, order }
  if (!_.isEmpty(attributes)) {
    query = { ...query, attributes }
  }
  return model.findOne(query)
}

export const getAll = async ({ model, data = {}, attributes = [], include = [], order = [], group = [], limit, offset, raw = false }) => {
  let query = { raw, where: data, include, order, limit, offset }
  if (!_.isEmpty(group)) {
    query = { ...query, group }
  }
  if (!_.isEmpty(attributes)) {
    query = { ...query, attributes }
  }
  return model.findAll(query)
}

export const createNewEntity = async ({ model, data = {}, include, transaction }) => {
  const dataValues = await model.create(data, { include, transaction })
  return dataValues.get({ plain: true })
}

export const updateEntity = async ({ model, values, data, transaction }) => {
  const dataValues = await model.update(data, { where: values, transaction })
  return dataValues
}

export const deleteEntity = async ({ model, values }) => {
  const deleteEntities = await model.destroy({
    where: values
  })
  return deleteEntities
}

export const updateOrCreateEntity = async ({ model, values, data, transaction }) => {
  const foundItem = await getOne({ model, data: values })
  if (!foundItem) {
    await createNewEntity({ model, data, transaction })
  }
  await updateEntity({ model, values, data, transaction })
}
