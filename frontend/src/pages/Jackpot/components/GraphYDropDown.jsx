import React from "react";
import Select from "react-select";
import { YAxisOptions } from "../constant";

const GraphYDropDown = ({ jackpotMetrics, setJackpotMetrics }) => {
    return (
        <Select
            isMulti
            value={jackpotMetrics}
            onChange={setJackpotMetrics}
            options={YAxisOptions}
            placeholder="Select Graph Types"
            styles={{
                control: (base) => ({
                    ...base,
                    minHeight: '44px',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    borderRadius: '14px',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                }),
                valueContainer: (base) => ({
                    ...base,
                    padding: '2px 12px',
                }),
                indicatorsContainer: (base) => ({
                    ...base,
                    height: '44px',
                }),
                indicatorSeparator: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 255, 255, 0.10)',
                }),
                placeholder: (base) => ({
                    ...base,
                    color: 'rgba(234, 250, 245, 0.55)',
                }),
                singleValue: (base) => ({
                    ...base,
                    color: 'rgba(255, 255, 255, 0.92)',
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(var(--gs-cta-rgb), 0.16)',
                    borderRadius: '10px',
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: 'rgba(255, 255, 255, 0.92)',
                    fontSize: '12px'
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    ':hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        color: 'rgba(255, 255, 255, 0.92)',
                    },
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(18, 18, 18, 0.98)',
                    border: '1px solid rgba(0, 229, 160, 0.18)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? 'rgba(0, 229, 160, 0.12)'
                      : state.isSelected
                        ? 'rgba(var(--gs-cta-rgb), 0.18)'
                        : 'transparent',
                    color: 'rgba(234, 250, 245, 0.92)',
                }),
            }}
        />
    );
};

export default GraphYDropDown;
