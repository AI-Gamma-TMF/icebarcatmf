import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Col, Row } from '@themesberg/react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  errorHandler,
  useRedeemRuleMutation,
  useUpdateRedeemRuleMutation,
} from '../../../reactQuery/hooks/customMutationHook/index.js';
import { toast } from '../../../components/Toast/index.jsx';

import { AdminRoutes } from '../../../routes.js';
import { validationSchema } from '../schemas.js';



import { Queries } from './Queries.jsx';

const transformToOperatorConditions = (data) => {
  if (!data) return null;

  const transformed = {};

  if (data.combinator) {
    transformed.operator = data.combinator;
  }

  if (data.rules) {
    transformed.conditions = data.rules.map((rule) => transformToOperatorConditions(rule));
  } else {
    transformed.field = data.field;
    transformed.value = data.value;
    transformed.operator = data.operator;
  }

  return transformed;
};

const transformToCombinatorRules = (data) => {
  if (!data) return null;

  const transformed = {};

  if (data.operator && (data.operator === 'and' || data.operator === 'or')) {
    transformed.combinator = data.operator;
  }

  if (data.conditions) {
    transformed.rules = data.conditions.map((condition) => transformToCombinatorRules(condition));
  } else {
    transformed.field = data.field;
    transformed.value = data.value;
    transformed.operator = data.operator;
  }

  return transformed;
};
const CreateRedeemRule = (editdata) => {
  const navigate = useNavigate();
  const [ruleName, setRuleName] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false)
  const [ruleConditon, setRuleConditon] = useState({});

  const { mutate: createRedeemRule, isLoading: createLoading } = useRedeemRuleMutation({
    onSuccess: () => {
      toast('Rules Created Successfully', 'success');
      navigate(AdminRoutes.RedeemRulelisting);
    },
    onError: (error) => {
      errorHandler(error);
    },
  });
  const { mutate: editRedeemRule } = useUpdateRedeemRuleMutation({
    onSuccess: () => {
      toast('Rule updated Successfully', 'success');

      navigate(AdminRoutes.RedeemRulelisting);
    },
    onError: (errors) => {
      toast(errors.description, 'error');
      errorHandler(errors);
    },
  });

  const tempdata = editdata?.tempdata;

  useEffect(() => {
    if (tempdata) {
      setRuleName(tempdata?.ruleName);
      setCompletionTime(tempdata?.completionTime);
      setRuleConditon(transformToCombinatorRules(tempdata?.ruleCondition));
      setIsActive(tempdata?.isActive);
      setIsSubscriberOnly(tempdata?.isSubscriberOnly)
    }
  }, [tempdata]);
  const handleCreateRedeemRulesSubmit = (formValues) => {
    if (formValues.ruleCondition.rules.length === 0) {
      toast('Please add atleast one conditon', 'warning');

      return;
    }

    const body = {
      ruleCondition: transformToOperatorConditions(ruleConditon),
      ruleName: ruleName,
      completionTime: completionTime,
      isActive: isActive,
      isSubscriberOnly: isSubscriberOnly

    };
    if (tempdata) {
      editRedeemRule({
        ruleId: tempdata.ruleId,
        ruleCondition: transformToOperatorConditions(ruleConditon),
        ruleName: ruleName,
        completionTime: completionTime,
        isActive: isActive,
        isSubscriberOnly: isSubscriberOnly
      });
    } else {
      createRedeemRule(body);
    }
  };

  return (
    <div>
      <Row>

        <Col sm={8}>
          <h3>{tempdata ? "Edit Redeem Rule" : "Create Redeem Rule"} </h3>
        </Col>
      </Row>

      <Formik
        enableReinitialize
        initialValues={{
          ruleName: tempdata ? tempdata?.ruleName : '',
          isActive: tempdata ? tempdata?.isActive : false,
          isSubscriberOnly: tempdata ? tempdata?.isSubscriberOnly : false,
          ruleCondition: tempdata ? transformToCombinatorRules(tempdata?.ruleCondition) : {},
          completionTime: tempdata ? tempdata?.completionTime : '',
        }}
        validationSchema={validationSchema}
        onSubmit={(formData, { resetForm }) => {
          handleCreateRedeemRulesSubmit(formData);
          resetForm();
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <Form>
            <div className='mt-5'>
              <Queries
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={values}
                handleSubmit={handleSubmit}
                createLoading={createLoading}
                tempdata={tempdata}
                ruleName={ruleName}
                setRuleName={setRuleName}
                completionTime={completionTime}
                setCompletionTime={setCompletionTime}
                isActive={isActive}
                setIsActive={setIsActive}
                isSubscriberOnly={isSubscriberOnly}
                setIsSubscriberOnly={setIsSubscriberOnly}
                ruleConditon={ruleConditon}
                setRuleConditon={setRuleConditon}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateRedeemRule;
