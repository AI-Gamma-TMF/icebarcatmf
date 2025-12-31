import React, { useEffect, useState } from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "./style.css";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import "react-querybuilder/dist/query-builder.css";
import "react-querybuilder/dist/query-builder-layout.css";
import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";
import { ErrorMessage } from "formik";
import Select from "react-select";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";

import { AdminRoutes } from "../../../routes.js";

import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import { toast } from "../../../components/Toast/index.jsx";
import {
  customOperators,
  fields,
  KycLevel,
  states,
  paymentProviderOptions,
} from "../constants.js";

const customStyles = {
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 2000,
  }),
  container: (provided) => ({ ...provided, width: "100%" }),
};

// ✅ Custom Multi-Select Value Editor
const CustomValueEditor = ({
  field,
  handleOnChange,
  value,
  focusedField,
  setFocusedField,
}) => {
  // const [isFocused, setIsFocused] = useState(false);

  // const inputRef = useRef(null);

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [value]);
  const numberFields = [
    "minimumLastRedeemHours",
    "ngr",
    "ggr",
    "playThrough",
    "depositAmount",
    "totalRedeemAmount",
    "redeemAmount",
  ];

  const handleNumberChange = (e) => {
    const inputValue = e.target.value;

    // Allow numbers, decimals (up to 2 places), and negative values
    if (/^-?\d*\.?\d{0,2}$/.test(inputValue)) {
      handleOnChange(inputValue);
    }
  };
  if (numberFields.includes(field)) {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={
          numberFields.includes(field)
            ? handleNumberChange
            : (e) => handleOnChange(e.target.value)
        }
        className="form-control"
        placeholder="Enter a value"
        onFocus={() => setFocusedField(field)} // Track only this field
        onBlur={() => setFocusedField(null)} // Reset on blur
        autoFocus={focusedField === field} // Focus only the active field
        onKeyDown={(evt) =>
          numberFields.includes(field) &&
          ["e", "E", "+"].includes(evt.key) &&
          evt.preventDefault()
        }
      />
    );
  }
  if (field === "tierLevel") {
    const tierOptions = [
      { label: "Empire", value: "Empire" },
      { label: "Reserve", value: "Reserve" },
      { label: "Forge", value: "Forge" },
      { label: "Valut", value: "Valut" }, // Typo? Should it be "Vault"?
      { label: "Mint", value: "Mint" },
      { label: "Nexus", value: "Nexus" },
    ];

    const handleChange = (selectedOptions) => {
      handleOnChange(
        selectedOptions ? selectedOptions.map((opt) => opt.value) : []
      );
    };

    return (
      <Select
        isMulti
        options={tierOptions}
        value={tierOptions.filter((opt) => value?.includes(opt.value))} // Pre-select values
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select Tier Levels..."
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    );
  }
  if (field === "notAllowedStates") {
    const handleChange = (selectedOptions) => {
      handleOnChange(
        selectedOptions ? selectedOptions.map((opt) => opt.value) : []
      );
    };

    return (
      <Select
        isMulti
        options={states}
        value={states.filter((opt) => value?.includes(opt.value))} // Pre-select values
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select States."
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    );
  }
  if (field === "kycStatus") {
    const handleChange = (selectedOptions) => {
      handleOnChange(
        selectedOptions ? selectedOptions.map((opt) => opt.value) : []
      );
    };

    return (
      <Select
        isMulti
        options={KycLevel}
        value={KycLevel.filter((opt) => value?.includes(opt.value))} // Pre-select values
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select KYC level"
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    );
  }
  if (field === "paymentProvider") {
    const handleChange = (selectedOptions) => {
      handleOnChange(
        selectedOptions ? selectedOptions.map((opt) => opt.value) : []
      );
    };

    return (
      <Select
        isMulti
        options={paymentProviderOptions}
        value={paymentProviderOptions.filter((opt) =>
          value?.includes(opt.value)
        )} // Pre-select values
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select Payment Provider"
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    );
  }

  return (
    <input
      // ref={inputRef}
      type="text"
      value={value || ""}
      onChange={(e) => handleOnChange(e.target.value)}
      className="form-control"
      disabled
      placeholder="Enter a value"
    />
  );
};

// const customOperators = [
//   { name: "=", label: "=" },
//   { name: "!=", label: "≠" },
//   { name: "<", label: "<" },
//   { name: ">", label: ">" },
//   { name: "<=", label: "≤" },
//   { name: ">=", label: "≥" },
// ];
const initialQuery = {
  combinator: "and",
  rules: [],
};

// const cleanQuery = (query) => {
//   const cleanRules = (rules) =>
//     rules.map(({ id, valueSource, rules, ...rest }) => ({
//       ...rest,
//       ...(rules ? { rules: cleanRules(rules) } : {}), // Recursively clean nested rules
//     }));

//   return {
//     ...query,
//     id: undefined, // Remove root-level id if needed
//     rules: cleanRules(query.rules),
//   };
// };
const cleanQuery = (query) => {
  const cleanRules = (rules) =>
    rules.map(({ rules, ...rest }) => ({
      ...rest,
      ...(rules ? { rules: cleanRules(rules) } : {}), // Recursively clean nested rules
    }));

  return {
    ...query,
    id: undefined, // Remove root-level id if needed
    rules: cleanRules(query.rules),
  };
};
const transformToCombinatorRules = (data) => {
  if (!data) return null;

  const transformed = {};

  if (data.operator && (data.operator === "and" || data.operator === "or")) {
    transformed.combinator = data.operator;
  }

  if (data.conditions) {
    transformed.rules = data.conditions.map((condition) =>
      transformToCombinatorRules(condition)
    );
  } else {
    transformed.field = data.field;
    transformed.value = data.value;
    transformed.operator = data.operator;
  }

  return transformed;
};
const transformToOperatorConditions = (data) => {
  if (!data) return null;

  const transformed = {};

  if (data.combinator) {
    transformed.operator = data.combinator;
  }

  if (data.rules) {
    transformed.conditions = data.rules.map((rule) =>
      transformToOperatorConditions(rule)
    );
  } else {
    transformed.field = data.field;
    transformed.value = data.value;
    transformed.operator = data.operator;
  }

  return transformed;
};
export const Queries = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  createLoading,
  ruleName,
  setRuleName,
  completionTime,
  setCompletionTime,
  isActive,
  setIsActive,
  isSubscriberOnly,
  setIsSubscriberOnly,
  ruleConditon,
  setRuleConditon,
  tempdata,
}) => {
  useEffect(() => {
    if (tempdata) {
      setQuery(cleanQuery(transformToCombinatorRules(tempdata?.ruleCondition)));
    }
  }, [tempdata]);
  const navigate = useNavigate();
  const _finalquery = tempdata
    ? transformToCombinatorRules(tempdata?.ruleCondition)
    : initialQuery;

  const [query, setQuery] = useState(cleanQuery(initialQuery));

  const Query = formatQuery(query, "json_without_ids");
  const tempQuery = JSON.parse(Query);
  const [focusedField, setFocusedField] = useState(null);
  const hasInvalidRules = (rules) => {
    return rules.some((rule) => {
      // If there are nested rules, recursively check them
      if (rule.rules && Array.isArray(rule.rules)) {
        return hasInvalidRules(rule.rules);
      }

      // Check if the value is invalid for top-level rules
      return (
        !rule.value || (Array.isArray(rule.value) && rule.value.length === 0)
      );
    });
  };
  const onSubmitButtonClick = () => {
    const cleanedQuery = query;

    const formattedRuleCondition = formatQuery(
      cleanedQuery,
      "json_without_ids"
    );
    const temp = JSON.parse(formattedRuleCondition);

    if (temp?.rules?.length === 0) {
      toast("Rule Condition Required", "error");
      return;
    }

    // const hasInvalidRules = temp.rules.some(rule =>
    //   !rule.value || (Array.isArray(rule.value) && rule.value.length === 0)
    // );

    if (hasInvalidRules(temp.rules)) {
      toast("All selected fields must have a value", "error");
      return;
    }

    try {
      const parsedRuleCondition = JSON.parse(formattedRuleCondition);

      setRuleConditon(parsedRuleCondition);
      setFieldValue("ruleCondition", parsedRuleCondition); // Store as JSON object
    } catch (error) {
      console.error("Error parsing ruleCondition JSON:", error);
    }

    handleSubmit();
  };

  const hasChanges = () => {
    return (
      _.isEqual(
        transformToOperatorConditions(tempQuery),
        tempdata?.ruleCondition
      ) &&
      values.ruleName === tempdata?.ruleName &&
      values.isActive === tempdata?.isActive &&
      values.isSubscriberOnly === tempdata?.isSubscriberOnly &&
      Number(values.completionTime) === Number(tempdata?.completionTime)
    );
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <BForm.Label>
            Rule Title
            <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Control
            type="text"
            name="ruleName"
            placeholder="Enter Rule Title"
            disabled={tempdata ? true : false}
            value={ruleName}
            onBlur={handleBlur}
            onChange={(e) => {
              const { value } = e.target;
              setRuleName(value); // Update local state
              handleChange(e); // Pass event to Formik
              // Clear error if any
            }}
          />
          <ErrorMessage
            component="div"
            name="ruleName"
            className="text-danger"
          />
        </Col>
        <Col>
          <BForm.Label>
            Completion Time
            <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Control
            type="number"
            min="1"
            onKeyDown={(evt) =>
              ["e", "E", "+", "-", "."].includes(evt.key) &&
              evt.preventDefault()
            }
            name="completionTime"
            placeholder="Enter Completion Time in Hours"
            value={completionTime}
            onBlur={handleBlur}
            onChange={(e) => {
              const { value } = e.target;
              setCompletionTime(value);
              handleChange(e);
            }}
          />
          <ErrorMessage
            component="div"
            name="completionTime"
            className="text-danger"
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} className="mb-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-active">Active</Tooltip>}
          >
            <div
              className="redeem-rule-toggle d-flex align-items-center rounded p-2 justify-content-between"
            >
              <p className="mb-0">Active</p>

              <BForm.Check
                name="isActive"
                checked={isActive}
                onChange={(e) => {
                  const { checked } = e.target;
                  setIsActive(checked);
                  handleChange(e);
                }}
              />
            </div>
          </OverlayTrigger>
          <ErrorMessage
            component="div"
            name="isActive"
            className="text-danger"
          />
        </Col>

        <Col xs={12} md={6} className="mb-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-subscribe">Subscribe</Tooltip>}
          >
            <div
              className="redeem-rule-toggle d-flex align-items-center rounded p-2 justify-content-between"
            >
              <p className="mb-0">Subscriber Only</p>

              <BForm.Check
                name="isSubscriberOnly"
                checked={isSubscriberOnly}
                onChange={(e) => {
                  const { checked } = e.target;
                  setIsSubscriberOnly(checked);
                  handleChange(e);
                }}
              />
            </div>
          </OverlayTrigger>
          <ErrorMessage
            component="div"
            name="isSubscriberOnly"
            className="text-danger"
          />
        </Col>
      </Row>

      <Row className="mt-4 d-flex justify-content-start">
        <Col>
          <h5>
            Select Redeem Rules
            {tempdata && (
              <small>
                {" "}
                <strong> (Note:</strong> Double-click numerical value to edit)
              </small>
            )}
          </h5>
        </Col>
      </Row>
      <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
        <QueryBuilderBootstrap>
          <QueryBuilder
            fields={fields}
            query={query}
            showCloneButtons
            // operators={customOperators}
            getOperators={(field) =>
              [
                "kycStatus",
                "tierLevel",
                "notAllowedStates",
                "userId",
                "paymentProvider",
              ].includes(field)
                ? [{ name: "=", label: "=" }]
                : customOperators
            }
            onQueryChange={setQuery}
            controlClassnames={{
              queryBuilder: "queryBuilder-branches justifiedLayout redeem-rule-builder",
            }}
            controlElements={{
              valueEditor: (props) => (
                <CustomValueEditor
                  {...props}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              ),
            }}
          />
        </QueryBuilderBootstrap>
      </QueryBuilderDnD>
      <ErrorMessage component="div" name="content" className="text-danger" />
      <h6 className=" mt-2">
        * Note: To apply this rule to a specific user, include userid: true in
        the rule and add users from the Select User tab in the Action button.
      </h6>
      <Row className="mt-4 d-flex justify-content-start">
        <Col>
          <h5>Rules Preview:</h5>
        </Col>
      </Row>
      <pre className="redeem-rule-preview">
        <code>{formatQuery(query, "sql")}</code>
      </pre>

      {/* <pre>
        <code>{JSON.stringify(cleanQuery(query), null, 2)}</code>
      </pre> */}

      <div className="mt-4 redeem-rule-actions">
        <Button
          variant="warning"
          onClick={() => navigate(AdminRoutes.RedeemRulelisting)}
        >
          Cancel
        </Button>

        <Button
          variant="success"
          onClick={onSubmitButtonClick}
          disabled={
            createLoading || (tempdata ? (hasChanges() ? true : false) : false)
          }
        >
          Submit
          {createLoading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </div>
    </div>
  );
};
