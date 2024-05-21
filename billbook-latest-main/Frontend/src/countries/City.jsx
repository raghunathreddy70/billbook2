// src/components/CityForm.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Form, Modal, Select, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import LocationSelector from './LocationSelector';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Flags from '../icons/flags';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { backendUrl } from '../backendUrl';

const { Option } = Select;

const CityForm = () => {

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCity, setSelectedCity] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  useEffect(() => {
    // Fetch cities and states when the component mounts
    fetchCities();
    fetchStates();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/cities`);
      setCities(response.data); // Make sure to update the cities state with the fetched data
    } catch (error) {
      console.error('Error fetching cities:', error.message);
    }
  };
  console.log("cities", cities)

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/states`);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error.message);
    }
  };

  const handleAddCity = async (values) => {
    try {
      await axios.post(`${backendUrl}/api/cities`, values);
      fetchCities();
      form.resetFields();
      setIsModalVisible(false);
      toast.success('City Added Successfully');
    } catch (error) {
      console.error('Error adding city:', error.message);
    }
  };

  const handleEditCity = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`${backendUrl}/api/cities/${selectedCity._id}`, values);
      fetchCities();
      setIsModalVisible(false);
      toast.success('City Edited Successfully');
      setSelectedCity(null);
    } catch (error) {
      console.error('Error editing city:', error.message);
    }
  };

  const handleDeleteCity = async (record) => {
    try {
      await axios.delete(`${backendUrl}/api/cities/${record._id}`);
      fetchCities();
      toast.success('City Deleted Successfully');
    } catch (error) {
      console.error('Error deleting city:', error.message);
    }
  };

  const columns = [
    {
      title: 'City Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        const state = states.find((state) => state._id === record.state._id);
        return state ? state.name : '';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
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
                      onClick={() => confirmDeleteCity(record)}
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
    setSelectedCity(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAddClick = () => {
    setSelectedCity(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  const confirmDeleteCity = (record) => {
    setDeleteModalVisible(true);
    setSelectedCity(record); // Assuming setSelectedCity is used to set the selected city to be deleted
  };
  return (
    <div>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>
        <Header onMenuClick={(value) => toggleMobileMenu()} />
        <Sidebar active={9} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Cities</h5>
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
                    Add City
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <Table dataSource={cities} columns={columns} rowKey="_id" />
            {/* <LocationSelector /> */}

            <Modal
              title={selectedCity ? 'Edit City' : 'Add City'}
              visible={isModalVisible}
              onCancel={() => {
                setSelectedCity(null);
                setIsModalVisible(false);
              }}
              onOk={() => form.submit()}
            >
              <Form form={form} onFinish={selectedCity ? handleEditCity : handleAddCity}>
                <Form.Item
                  label="City Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter the city name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[{ required: true, message: 'Please select a state' }]}
                >
                  <Select placeholder="Select a state">
                    {states.map((state) => (
                      <Option key={state._id} value={state._id}>
                        {state.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
            <div
              className={`modal custom-modal fade ${deleteModalVisible ? 'show' : ''}`}
              id="delete_modal"
              role="dialog"
              style={{ display: deleteModalVisible ? 'block' : 'none' }}
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-header">
                      <h3>Delete City</h3>
                      <p>Are you sure you want to delete?</p>
                    </div>
                    <div className="modal-btn delete-action">
                      <div className="row">
                        <div className="col-6">
                          <button
                            type="button"
                            className="w-100 btn btn-primary paid-continue-btn"
                            onClick={() => handleDeleteCity(selectedCity)}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            type="button"
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

export default CityForm;
