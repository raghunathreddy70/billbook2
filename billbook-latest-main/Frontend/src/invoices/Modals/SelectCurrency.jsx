import React from "react";
import { Input, Modal, Select } from "antd";

const SelectCurrency = ({
  isModalVisible,
  handleOk,
  handleCancel,
  currencyData,
  selectedCitys,
  handleCitysChange,
  selectedCurrency,
  currencyValue,
  handleEditableCurrencyChange,
}) => {
  return (
    <Modal
      className="select-currency"
      title="Select Currency"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="row">
        <div className="col-lg-12 col-md-12 mt-4">
          <div className="form-group add-invoice-select-div">
            <label>Select Country:</label>
            <Select
              className="add-invoice-select"
              style={{ width: "100%" }}
              value={selectedCitys}
              onChange={handleCitysChange}
            >
              {currencyData.map((city) => (
                <Option key={city._id} value={city.cityName}>
                  {city.cityName}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="form-group">
            <label>Currency:</label>
            <Input className="form-control" value={selectedCurrency} readOnly />
          </div>
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="form-group">
            <label>Currency Value:</label>
            <Input.TextArea
              className="form-control"
              value={currencyValue}
              onChange={handleEditableCurrencyChange}
              autoSize={{
                minRows: 2,
                maxRows: 6,
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectCurrency;
