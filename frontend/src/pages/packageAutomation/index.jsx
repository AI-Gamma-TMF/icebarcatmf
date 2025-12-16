import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Col, Row, Form as BForm, Button, Container } from '@themesberg/react-bootstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import { getAutomationPackageDetails } from '../../utils/apiCalls';
import { usePackageAutomationMutation } from '../../reactQuery/hooks/customMutationHook';
import { add, divide, multiply, subtract } from 'lodash';
import { toast } from '../../components/Toast';
import { AdminRoutes } from '../../routes';
import { validationSchema } from './schema';
import { InlineLoader } from '../../components/Preloader';

const PackageAutomation = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const {
    data: packageData = [],
    isLoading,
  } = useQuery({
    queryKey: ['packageDetailAutomation', packageId],
    queryFn: async ({ queryKey }) => {
      const params = {
        packageId: queryKey[1],
      };
      return getAutomationPackageDetails(params);
    },
    select: (res) => res?.data?.packageList?.rows[0] || [],
    refetchOnWindowFocus: false,
  });

  const initialValues = {
    NonPurchasePackages:
      packageData?.NonPurchasePackages?.length > 0
        ? packageData?.NonPurchasePackages?.map((pkg) => ({
            nonPurchasePackageId: pkg.id,
            intervalDay: pkg.intervalDay,
            isActive: pkg.isActive || false,
            discountedAmount: pkg.discountedAmount || '',
            bonusPercentage: pkg.bonusPercentage || 0,
            scCoin: pkg?.scCoin || 0,
            gcCoin: pkg?.gcCoin || 0,
            gcBonus: pkg?.gcBonus || 0,
            scBonus: pkg?.scBonus || 0,
          }))
        : [
            {
              intervalDay: 10,
              discountedAmount: '',
              bonusPercentage: 0,
              isActive: false,
              scCoin: 0,
              gcCoin: 0,
              scBonus: 0,
              gcBonus: 0,
            },
            {
              intervalDay: 20,
              discountedAmount: '',
              bonusPercentage: 0,
              isActive: false,
              scCoin: 0,
              gcCoin: 0,
              scBonus: 0,
              gcBonus: 0,
            },
            {
              intervalDay: 30,
              discountedAmount: '',
              bonusPercentage: 0,
              isActive: false,
              scCoin: 0,
              gcCoin: 0,
              scBonus: 0,
              gcBonus: 0,
            },
            {
              intervalDay: 40,
              discountedAmount: '',
              bonusPercentage: 0,
              isActive: false,
              scCoin: 0,
              gcCoin: 0,
              scBonus: 0,
              gcBonus: 0,
            },
          ],
  };

  const onSuccess = (res) => {
    if (res?.data?.success) {
      toast(res?.data?.message, 'success', 'packageCreate');
      navigate(AdminRoutes.Packages);
    } else {
      toast(res?.data?.message, 'error', 'packageCreate');
    }
  };
  const onError = (error) => {
    toast(error.response.data.errors[0].description, 'error', 'packageCreate');
  };
  const { mutate: createPackageAutomation } = usePackageAutomationMutation({
    onSuccess,
    onError,
  });

  const validateDiscountAmounts = (values) => {
    const errors = { NonPurchasePackages: [] };
    let lastActiveDiscount = null;

    values.NonPurchasePackages.forEach((pkg, index) => {
      if (pkg?.isActive) {
        if (lastActiveDiscount !== null && Number(pkg.discountedAmount) >= Number(lastActiveDiscount)) {          
          errors.NonPurchasePackages[index] = {
            discountedAmount: `Amount must be less than the previous active interval`,
          };
        }
        lastActiveDiscount = pkg.discountedAmount;
      }
    });

    return errors.NonPurchasePackages.length ? errors : {};
  };

  const handleChangeDiscountAmount = (e, setFieldValue, index, values, validateForm) => {
    const { value } = e.target;
    if (value.match(/^(\d+(\.\d{0,2})?)?$/)) {
      const discountAmount = value;
      const bonusPercentage =
        discountAmount === ''
          ? 0
          : Math.floor(
              +multiply(
                +divide(+subtract(+add(packageData?.scCoin, packageData?.bonusSc), +discountAmount), +discountAmount),
                100,
              ),
            );

      const roundedScCoin = Math.ceil(discountAmount);
      const roundedGcCoin = Math.ceil(discountAmount) * 1000;
      const roundedBonusScCoin = Math.ceil(packageData?.scCoin + packageData?.bonusSc - roundedScCoin);
      const roundedBonusGcCoin = Math.ceil(packageData?.gcCoin + packageData?.bonusGc - roundedGcCoin);

      const updatedPackages = [...values.NonPurchasePackages];
      updatedPackages[index] = {
        ...updatedPackages[index],
        discountedAmount: discountAmount,
        bonusPercentage: bonusPercentage,
        scCoin: roundedScCoin,
        gcCoin: roundedGcCoin,
        scBonus: roundedBonusScCoin,
        gcBonus: roundedBonusGcCoin,
      };
      setFieldValue('NonPurchasePackages', updatedPackages);
    }
    validateForm();
  };

  const handleCancel = () => {
    navigate(AdminRoutes.Packages);
  };

  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>Package Automation</h3>
        </Col>
      </Row>

      {isLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row>
            <Col xs={12} md={6} lg={3}>
              <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                <h6 className='mb-0 me-2'>Package Name</h6>
                <span>{packageData?.packageName}</span>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                <h6 className='mb-0 me-2'>Package Base Amount</h6>
                <span>{packageData?.amount}</span>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                <h6 className='mb-0 me-2'>SC </h6>
                <span>{packageData?.scCoin}</span>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                <h6 className='mb-0 me-2'>GC</h6>
                <span>{packageData?.gcCoin}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={3}>
              <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                <h6 className='mb-0 me-2'>SC Bouns</h6>

                <span>{packageData?.bonusSc}</span>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                <h6 className='mb-0 me-2'>GC Bonus</h6>

                <span>{packageData?.bonusGc}</span>
              </div>
            </Col>
          </Row>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={validationSchema(packageData?.amount)}
            validate={validateDiscountAmounts}
            onSubmit={(formValues) => {
              const data = {
                packageId: parseInt(packageId),
                config: [
                  ...(formValues?.NonPurchasePackages ?? []).map((pkg, _idx) =>
                    pkg?.isActive
                      ? pkg
                      : {
                          ...pkg,
                          discountedAmount: 0,
                          bonusPercentage: 0,
                          scCoin: 0,
                          gcCoin: 0,
                          scBonus: 0,
                          gcBonus: 0,
                        },
                  ),
                ],
              };
              createPackageAutomation(data);
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              handleSubmit,
              validateForm,
            }) => (
              <Form className='mt-5'>
                {values?.NonPurchasePackages?.map((pkg, index) => (
                  <Container key={pkg?.intervalDay} fluid className='p-4 mt-4 border rounded'>
                    <Row>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>{`Enable ${pkg?.intervalDay} days`}</BForm.Label>
                        <BForm.Check
                          type='switch'
                          checked={pkg.isActive}
                          name={`NonPurchasePackages.${index}.isActive`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.isActive`}
                          className='text-danger'
                        />
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>Discounted Amount</BForm.Label>
                        <BForm.Control
                          type='number'
                          name={`NonPurchasePackages.${index}.discountedAmount`}
                          value={pkg?.isActive ? pkg?.discountedAmount : 0}
                          placeholder={'Enter the Discounted Amount'}
                          onChange={(e) => handleChangeDiscountAmount(e, setFieldValue, index, values, validateForm)}
                          onBlur={handleBlur}
                          disabled={!pkg?.isActive}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.discountedAmount`}
                          className='text-danger'
                        />
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>Calculated Bonus Percentage</BForm.Label>
                        <BForm.Control
                          type='number'
                          disabled
                          name={`NonPurchasePackages.${index}.bonusPercentage`}
                          value={pkg?.isActive ? pkg?.bonusPercentage : 0}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.bonusPercentage`}
                          className='text-danger'
                        />
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>SC Coin</BForm.Label>
                        <BForm.Control
                          type='number'
                          disabled
                          value={pkg?.isActive ? pkg?.scCoin : 0}
                          name={`NonPurchasePackages.${index}.scCoin`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.scCoin`}
                          className='text-danger'
                        />
                      </Col>
                    </Row>

                    <Row className='mt-2'>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>GC Coin</BForm.Label>
                        <BForm.Control
                          type='number'
                          disabled
                          value={pkg?.isActive ? pkg?.gcCoin : 0}
                          name={`NonPurchasePackages.${index}.gcCoin`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.gcCoin`}
                          className='text-danger'
                        />
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>SC Bonus Coin</BForm.Label>
                        <BForm.Control
                          type='number'
                          disabled
                          value={pkg?.isActive ? pkg?.scBonus : 0}
                          name={`NonPurchasePackages.${index}.scBonus`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.scBonus`}
                          className='text-danger'
                        />
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <BForm.Label>GC Bonus Coin</BForm.Label>
                        <BForm.Control
                          type='number'
                          disabled
                          value={pkg?.isActive ? pkg?.gcBonus : 0}
                          name={`NonPurchasePackages.${index}.gcBonus`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name={`NonPurchasePackages.${index}.gcBonus`}
                          className='text-danger'
                        />
                      </Col>
                    </Row>
                  </Container>
                ))}

                <Row className='mt-3 d-flex justify-content-end'>
                  <Button variant='warning' style={{ width: '7rem', marginRight: '1rem' }} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant='success'
                    style={{ width: '7rem' }}
                    onClick={(event) => {
                      handleSubmit(event);
                    }}
                  >
                    Submit
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};

export default PackageAutomation;
