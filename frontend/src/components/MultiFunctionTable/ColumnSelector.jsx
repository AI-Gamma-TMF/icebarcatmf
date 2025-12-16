import { Col, Form } from "@themesberg/react-bootstrap";
import React from "react";
import { MultiSelect } from "react-multi-select-component";

export default function FilterDemo({
  options,
  selectedOptions,
  setSelectedOptions,
  marginTop,
}) {
  return (
    <Col sm={6} lg={3} className={marginTop}>
      <Form.Label>Select Columns</Form.Label>

      <MultiSelect
        options={options}
        value={selectedOptions}
        onChange={setSelectedOptions}
        labelledBy="Select Column"
        className="custom-multiselect"
        hasSelectAll={true}
        overrideStrings={{
          selectSomeItems: "Select Column",
          allItemsAreSelected: "All Selected",
          search: "Search...",
        }}
      />
    </Col>
  );
}
