import React, { useRef } from "react";

import { Button, Row, Col } from "@themesberg/react-bootstrap";
import { useNavigate , useLocation } from "react-router-dom";


import Trigger from "../../../components/OverlayTrigger";
import { AdminRoutes } from "../../../routes";
import useRedeemRulelist from "../hooks/useRedeemRulelist";
import ImportCsvModal from "../../EmailCenter/components/importCsvModel";
import AddUserSelect from "../../AddUserSelect";
const RedeemUserSelect = () => {
  const location = useLocation();
  const RuleData = location.state?.RuleData;
  const isRedeemRule = location.state?.isRedeemRule || false;
//   const istestButton = location.state?.istestButton || false;
 
  const {
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    uploadCSV,
    importAction,
    setImportAction,editRedeemRule,editloading
  } = useRedeemRulelist();
 const navigate = useNavigate()
  const handleCSVSumbit = () => {
    const formData = new FormData();
    formData.append("file", importedFile);
    formData.append("ruleId", RuleData?.ruleId);
   

    uploadCSV(formData);
  };

  const fileInputRef = useRef(null);
  const handleImportChange = (e) => {
    const file = e.target.files[0];
    setImportedFile(e.target.files[0]);
    if (file) {
      setImportModalShow(true);
    }
    // Reset the input value to allow re-selection
    e.target.value = null;
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };
 
  return (
    <>
      <div className="d-flex justify-content-between">
        <div >
          <h3>
            Redeem Rule : {RuleData ? `${RuleData?.ruleName}` : ""}
          </h3>
        </div>
        
        <div >
          { (
            <Col>
              <div>
              <Trigger message='Required .csv file with one column title email and email ids as follows.' id={"csvFileInput"} />
                <Button
                  variant="primary"
                  style={{
                    height: "40px",
                    width: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  
                  size="sm"
                  onClick={handleImportClick}
                  type="button"
                  id={"csvFileInput"}
                >
                  Import CSV
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleImportChange}
                  style={{ display: "none" }} // Hide the file input
                />
              </div>
            </Col>
          )}
        </div>
      </div>

      {/* <AddUser
      isRedeemRule={isRedeemRule}
      editRedeemRule={editRedeemRule}
      RuleData={RuleData}
      uploadCSVLoading = {editloading}
      /> */}
      <AddUserSelect
      isRedeemRule={isRedeemRule}
      editRedeemRule={editRedeemRule}
      RuleData={RuleData}
      uploadCSVLoading = {editloading}
      />
      <Row className="mt-4 justify-content-between">
        <Col>
          <Button
            variant="warning"
            className="f-right"
            style={{ height: "40px", width: "100px" }}
            size="sm"
            onClick={() => navigate(AdminRoutes.RedeemRulelisting)}
            
          >
            Cancel
          </Button>
        </Col>
  
      </Row>
      {importModalShow && (
        <ImportCsvModal
          setShow={setImportModalShow}
          show={importModalShow}
          handleYes={handleCSVSumbit}
          loading={uploadCSVLoading}
          importedFile={importedFile}
          importAction={importAction}
          setImportAction={setImportAction}
        />
      )} 
    </>
  );
};

export default RedeemUserSelect;
