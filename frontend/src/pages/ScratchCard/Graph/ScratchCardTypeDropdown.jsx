import React from "react";
import Select from "react-select";

const ScratchCardTypeDropdown = ({ scratchCardId, setScratchCardId, scratchCardDropdownList }) => {
    return (
        <Select
            isMulti
            value={scratchCardId}
            onChange={setScratchCardId}
            options={scratchCardDropdownList}
            placeholder="Select Scratchcard Type"
            styles={{
                control: (base) => ({
                    ...base,
                    minHeight: '38px',
                    borderColor: '#ced4da',
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#e9ecef',
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: '#495057',
                    fontSize: '12px'
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    ':hover': {
                        backgroundColor: '#adb5bd',
                        color: 'white',
                    },
                }),
            }}
        />
    );
};

export default ScratchCardTypeDropdown;
