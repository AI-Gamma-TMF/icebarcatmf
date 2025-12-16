import React, { useState } from "react";
import {
  Button,        
  Row,
  Col,
  Table,
} from "@themesberg/react-bootstrap";

import { getSpinWheel } from "../../utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { tableHeaders } from "./constants";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { errorHandler, useUpdateSpinWheelMutation } from "../../reactQuery/hooks/customMutationHook";
import { toast } from '../../components/Toast'
import EditSpinWheel from "./EditSpinWheel";

const SpinWheel = () => {
    const [show, setShow] = useState(false)
    const [detail, setDetail] = useState({})
    const { data, refetch } = useQuery({
        queryFn: () => {
            return getSpinWheel();
        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
    });
    const handleShow = ( detail) => {
        setDetail(detail)
        setShow(true)
      }
  const { mutate: updateSpinWheel, isLoading: createLoading } =
    useUpdateSpinWheelMutation({
      onSuccess: () => {
        toast("Spin Wheel Updated Successfully", 'success');
        setShow(false)
        refetch();
      },
      onError: (error) => {
        toast(error.response.data.errors[0].description, "error");
        errorHandler(error);
      },
    });

    const handleEditSpinWheel = (formValues) => {
      const body = {
        ...formValues,
        wheelDivisionId: formValues?.wheelDivisionId,
          sc: +formValues?.sc,
          gc: +formValues?.gc,
          isAllow: formValues?.isAllow,
          playerLimit: formValues?.playerLimit? formValues?.playerLimit: null,
          priority: +formValues?.priority,
      
      };
      updateSpinWheel(body);
    };
  return (
    <>
      <>
        <Row className="mb-2">
          <Col>
            <h3>Spin Wheel Configuration</h3>
          </Col>

        </Row>

        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
            <tr>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {h.labelKey}{" "}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data?.wheelConfiguration?.length > 0 &&
              data?.wheelConfiguration?.map(
                ({
                    wheelDivisionId,priority,
                    sc,gc,isAllow,playerLimit,
                }) => {
                  return (
                    <tr key={wheelDivisionId}>
                      <td>{wheelDivisionId}</td>
                      <td>{gc}</td>
                      <td>{sc}</td>
                      <td>{playerLimit != null ? playerLimit : '-'}</td>
                      <td>{priority === 1 ? 'Rarely' : priority === 2 ? 'Sometimes' : priority === 3 ? 'Usually' : priority === 4 ? 'Frequently' : 'Most of the time'}</td>
                      <td>{isAllow === true ? 'True' : 'False'}</td>
                      <td>
                       
                            <Trigger message="Edit" id={wheelDivisionId + "edit"} />
                            <Button
                              id={wheelDivisionId + "edit"}
                              //hidden={isHidden({ module: { key: 'Raffles', value: 'U' } })}
                              className="m-1"
                              size="sm"
                              variant="warning"
                              onClick={() => handleShow({ wheelDivisionId,priority,
                                sc,gc,isAllow,playerLimit,}) }
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                      </td>
                    </tr>
                  );
                }
              )}

            {data?.wheelConfiguration.length === 0 && (
              <tr>
                <td colSpan={7} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {show && (
        <EditSpinWheel
          setShow={setShow}
          show={show}
          handleEditSpinWheel={handleEditSpinWheel}
          detail={detail}
          isLoading={createLoading}
        />
      )}
      </>
    
    </>
  );
};

export default SpinWheel;
