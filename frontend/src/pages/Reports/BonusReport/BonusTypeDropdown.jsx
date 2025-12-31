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
            classNamePrefix="bonus-select"
            styles={{
                control: (base) => ({
                    ...base,
                    minHeight: '38px',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderRadius: '14px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(18, 18, 18, 0.98)',
                    border: '1px solid rgba(0, 229, 160, 0.18)',
                    boxShadow: '0 18px 55px rgba(0, 0, 0, 0.55)',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                        ? 'rgba(0, 229, 160, 0.12)'
                        : 'transparent',
                    color: 'rgba(255,255,255,0.92)',
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(0, 229, 160, 0.14)',
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: '12px',
                    fontWeight: 800,
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    ':hover': {
                        backgroundColor: 'rgba(0, 229, 160, 0.20)',
                        color: 'rgba(0,0,0,0.9)',
                    },
                }),
            }}
        />
    );
};

export default BonusTypeDropdown;
