import React from "react";
import Select from "react-select";
import { NewYAxisOptions, YAxisOptions } from "./constant";

const GraphYDropDown = ({ jackpotMetrics, setJackpotMetrics }) => {
    return (
        <Select
            isMulti
            value={jackpotMetrics}
            onChange={setJackpotMetrics}
            options={NewYAxisOptions}
            placeholder="Select Graph Types"
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

export default GraphYDropDown;
