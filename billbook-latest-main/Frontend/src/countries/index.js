import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Form, Modal, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { backendUrl } from '../backendUrl';
// import 'antd/dist/antd.css';
// import './Country.css';

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCountry, setEditingCountry] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null)
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error.message);
    }
  };
  console.log("data", countries)
  const handleAddCountry = async (values) => {
    try {
      await axios.post(`${backendUrl}/api/countries`, values);
      fetchCountries();
      form.resetFields();
      setIsModalVisible(false);
      toast.success("Country Added Succesfully")
    } catch (error) {
      console.error('Error adding country:', error.message);
    }
  };

  const handleEditCountry = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`${backendUrl}/api/countries/${editingCountry._id}`, values);
      fetchCountries();
      setIsModalVisible(false);
      setEditingCountry(null);
      toast.success("Country Edited Succesfully")
    } catch (error) {
      console.error('Error editing country:', error.message);
    }
  };

  //   const handleDeleteCountry = async (record) => {
  //     try {
  //       await axios.delete(`http://localhost:8000/api/countries/${record._id}`);
  //       fetchCountries();
  //     } catch (error) {
  //       console.error('Error deleting country:', error.message);
  //     }
  //   };
  const handleDeleteCountry = async (record) => {
    try {
      const deleteUrl = `${backendUrl}/api/countries/${record._id}`;
      console.log('Delete URL:', deleteUrl);

      const response = await axios.delete(deleteUrl);
      console.log('Delete response:', response);
      toast.success("Country Deleted Succesfully")

      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error.message);
    } finally{
      setDeleteModalVisible(false);
    }
  };
  const confirmDeleteCountry = (record) => {
    setDeleteModalVisible(true);
    setSelectedCountry(record);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Population',
      dataIndex: 'population',
      key: 'population',
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
                      onClick={() => confirmDeleteCountry(record)}
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
    setEditingCountry(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAddClick = () => {
    setEditingCountry(null);
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
                <h5>Country</h5>
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
                    Add Country
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="app-container">

              <Table dataSource={countries} columns={columns} rowKey="_id" />
              <Modal
                title={editingCountry ? 'Edit Country' : 'Add Country'}
                visible={isModalVisible}
                onCancel={() => {
                  setEditingCountry(null);
                  setIsModalVisible(false);
                }}
                onOk={() => form.submit()}
              >
                <Form form={form} onFinish={editingCountry ? handleEditCountry : handleAddCountry} onFinishFailed={(error) => console.error(error)}>
                  <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Population"
                    name="population"
                    rules={[
                      { required: true, message: 'Please enter the population' },
                    ]}
                  >
                    <Input type="number" />
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
                        <h3>Delete Country</h3>
                        <p>Are you sure you want to delete?</p>
                      </div>
                      <div className="modal-btn delete-action">
                        <div className="row">
                          <div className="col-6">
                            <button
                              type="button"
                              className="w-100 btn btn-primary paid-continue-btn"
                              onClick={() => handleDeleteCountry(selectedCountry)}
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
    </div>
  );
};

export default Country;
