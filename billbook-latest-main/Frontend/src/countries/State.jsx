import React, { useState, useEffect } from "react";
import { Button, Input, Table, Form, Modal, Select, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { backendUrl } from "../backendUrl";

const { Option } = Select;

const StateForm = () => {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedState, setSelectedState] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/states`);
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error.message);
    }
  };
  console.log("states", states);
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };
  console.log("countries", countries)

  const handleAddState = async (values) => {
    try {
      await axios.post(`${backendUrl}/api/states`, values);
      fetchStates();
      form.resetFields();
      setIsModalVisible(false);
      toast.success("State Added Succesfully");
    } catch (error) {
      console.error("Error adding state:", error.message);
    }
  };

  const handleEditState = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `${backendUrl}/api/states/${selectedState._id}`,
        values
      );
      fetchStates();
      setIsModalVisible(false);
      toast.success("State Edited Succesfully");
      setSelectedState(null);
    } catch (error) {
      console.error("Error editing state:", error.message);
    }
  };

  const handleDeleteState = async (record) => {
    try {
      await axios.delete(`${backendUrl}/api/states/${record._id}`);
      fetchStates();
      toast.success("State Deleted Succesfully");
    } catch (error) {
      console.error("Error deleting state:", error.message);
    }
  };

  const confirmDeleteState = (record) => {
    setDeleteModalVisible(true);
    setSelectedState(record);
  };

  const columns = [
    {
      title: "State Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => {
        const country = countries.find((country) => country._id === record.country._id);
        return country ? country.name : '';
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <>
          <div className="d-flex align-items-center">
            <div className="">
              <div className="btn-action-icon d-flex">
                <div className="bg-[#e1ffed] p-2 rounded me-2">
                  <Tooltip title="Edit" placement="top">
                    <Link
                      className="btn-action-icon action-delete-icon"
                      to="#"
                      onClick={() => handleEditClick(record)}
                    >
                      <div className="bg-[#e1ffed] p-1 rounded">
                        <FeatherIcon icon="edit" className="text-[#1edd6a] " />
                      </div>
                    </Link>
                  </Tooltip>
                </div>
                <div className="bg-[#ffeded] p-2 rounded">
                  <Tooltip title="Delete" placement="top">
                    <Link
                      className="btn-action-icon action-delete-icon"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                      onClick={() => confirmDeleteState(record)}
                    >
                      <div className=" bg-[#ffeded] p-1 rounded">
                        <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
                      </div>
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  const handleEditClick = (record) => {
    setSelectedState(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAddClick = () => {
    setSelectedState(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  return (
    <div>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => toggleMobileMenu()} />
        <Sidebar active={9} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>States</h5>
                <div className="list-btn">
                  <Link
                    className="btn btn-primary"
                    type="primary" to="#"
                    onClick={handleAddClick}
                  >
                    <i
                      className="fa fa-plus-circle me-2"
                      aria-hidden="true"
                    />
                     Add State
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}

            <Table dataSource={states} columns={columns} rowKey="_id" />

            <Modal
              title={selectedState ? "Edit State" : "Add State"}
              visible={isModalVisible}
              onCancel={() => {
                setSelectedState(null);
                setIsModalVisible(false);
              }}
              onOk={() => form.submit()}
            >
              <Form
                form={form}
                onFinish={selectedState ? handleEditState : handleAddState}
              >
                <Form.Item
                  label="State Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter the state name" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[
                    { required: true, message: "Please select a country" },
                  ]}
                >
                  <Select placeholder="Select a country">
                    {countries.map((country) => (
                      <Option key={country._id} value={country._id}>
                        {country.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>

            <div
              className={`modal custom-modal fade ${deleteModalVisible ? "show" : ""
                }`}
              id="delete_modal"
              role="dialog"
              style={{ display: deleteModalVisible ? "block" : "none" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-header">
                      <h3>Delete State</h3>
                      <p>Are you sure want to delete?</p>
                    </div>
                    <div className="modal-btn delete-action">
                      <div className="row">
                        <div className="col-6">
                          <button
                            type="reset"
                            data-bs-dismiss="modal"
                            className="w-100 btn btn-primary paid-continue-btn"
                            onClick={() => handleDeleteState(selectedState)}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            // type="submit"
                            data-bs-dismiss="modal"
                            className="w-100 btn btn-primary paid-cancel-btn"
                            onClick={() => setDeleteModalVisible(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateForm;
