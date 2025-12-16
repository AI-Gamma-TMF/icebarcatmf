import React from "react";
import Select from "react-select";
import { bonusTypeOptions } from "./constant";

const BonusTypeDropdown = ({ bonusType, setBonusType }) => {
    return (
        <Select
            isMulti
            value={bonusType}
            onChange={setBonusType}
            options={bonusTypeOptions}
            placeholder="Select Bonus Type"
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

export default BonusTypeDropdown;
