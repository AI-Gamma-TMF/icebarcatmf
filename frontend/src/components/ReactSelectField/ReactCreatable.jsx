import React from 'react'

import CreatableSelect from 'react-select/creatable'

const ReactCreatable = (props) => {
  const {
    options,
    value,
    setValue,
    isLoading,
    handleCreateOption,
    isMulti=false,
    ...rest
  } = props
  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={setValue}
      onCreateOption={handleCreateOption}
      options={options || []}
      value={value}
      isMulti={isMulti}
      {...rest}
    />
  )
}

export default ReactCreatable
