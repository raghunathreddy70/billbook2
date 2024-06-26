// import React, {useState, useEffect} from 'react';
// import { Link } from 'react-router-dom';
// import SettingSidebar from '../layouts/SettingsSidebar'
// import Select2 from 'react-select2-wrapper';
// import Header from '../layouts/Header'
// import Sidebar from '../layouts/Sidebar'
// import SettingDashboardSideBar from './SettingDashboardSideBar';

// const TaxTypes = () => {

//     const [menu, setMenu] = useState(false)

// 	const toggleMobileMenu = () => {
// 		setMenu(!menu)
// 	  }

// 	const [status, setstatus ] = useState( [
//         { id: 1, text: 'Active' },
//         { id: 2, text: 'Inactive' },
//     	]);


//     const formHandler = (e) => {
//         console.log(e);
//     }

//     useEffect(() => {
// 		let elements = Array.from(document.getElementsByClassName('select2-container'));
//         elements.map(element => element.classList.add("width-100"))
// 	},[]);

//         return (

//             <div className={`main-wrapper ${menu ? 'slide-nav': ''}`}> 

// 			    <Header onMenuClick = {(value) => setMenu(!menu)} />
// 			    <SettingDashboardSideBar /> 

//                 <div className="page-wrapper">
//                     <div className="content container-fluid">

// 				    <div className="page-header">
// 						<div className="content-page-header">						
// 							<h5>Settings</h5>
// 						</div>
// 					</div>

//                         <div className="row">
//                             <div className="col-xl-3 col-md-4">
//                                 <SettingSidebar />
//                             </div>

//                             <div className="col-xl-9 col-md-8">
//                                 <div className="card card-table">
//                                     <div className="card-header">
//                                         <div className="row">
//                                             <div className="col">
//                                                 <h5 className="card-title">Tax Types</h5>
//                                             </div>
//                                             <div className="col-auto">
//                                                 <Link to="#" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#add_tax">Add New Tax</Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <div className="table-responsive">
//                                             <table className="table table-hover mb-0">
//                                                 <thead className="thead-light">
//                                                     <tr>
//                                                         <th>Tax Name </th>
//                                                         <th>Tax Percentage (%) </th>
//                                                         <th>Status</th>
//                                                         <th className="text-end">Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     <tr>
//                                                         <td>VAT</td>
//                                                         <td>14%</td>
//                                                         <td>
//                                                             <span className="badge bg-success-light">Active</span>
//                                                         </td>
//                                                         <td className="text-end">
//                                                             <Link to="#" data-bs-toggle="modal" data-bs-target="#edit_tax" className="btn btn-sm btn-white text-success me-2"><i className="far fa-edit me-1"></i> Edit</Link> 
//                                                             <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_tax" className="btn btn-sm btn-white text-danger me-2"><i className="far fa-trash-alt me-1"></i>Delete</Link>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td>GST</td>
//                                                         <td>30%</td>
//                                                         <td>
//                                                             <span className="badge bg-danger-light">Inactive</span>
//                                                         </td>
//                                                         <td className="text-end">
//                                                             <Link to="#" data-bs-toggle="modal" data-bs-target="#edit_tax" className="btn btn-sm btn-white text-success me-2"><i className="far fa-edit me-1"></i> Edit</Link> 
//                                                             <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_tax" className="btn btn-sm btn-white text-danger me-2"><i className="far fa-trash-alt me-1"></i>Delete</Link>
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div id="add_tax" className="modal custom-modal fade" role="dialog">
//                             <div className="modal-dialog modal-dialog-centered" role="document">
//                                 <div className="modal-content">
//                                     <div className="modal-header">
//                                         <h5 className="modal-title">Add Tax</h5>
//                                         <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
//                                             <span aria-hidden="true">&times;</span>
//                                         </button>
//                                     </div>
//                                     <div className="modal-body">
//                                         <form>
//                                             <div className="form-group">
//                                                 <label>Tax Name <span className="text-danger">*</span></label>
//                                                 <input className="form-control" type="text"  onChange={formHandler}/>
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Tax Percentage (%) <span className="text-danger">*</span></label>
//                                                 <input className="form-control" type="text" onChange={formHandler} />
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Status <span className="text-danger">*</span></label>
//                                                 <Select2
//                                                     defaultValue={1}
//                                                     className="w-100"
//                                                     data={status}
//                                                     options={{
//                                                         placeholder: 'Select Status',
//                                                     }}
//                                                 />
//                                             </div>
//                                             <div className="submit-section">
//                                                 <button className="btn btn-primary submit-btn">Submit</button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div id="edit_tax" className="modal custom-modal fade" role="dialog">
//                             <div className="modal-dialog modal-dialog-centered" role="document">
//                                 <div className="modal-content">
//                                     <div className="modal-header">
//                                         <h5 className="modal-title">Edit Tax</h5>
//                                         <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
//                                             <span aria-hidden="true">&times;</span>
//                                         </button>
//                                     </div>
//                                     <div className="modal-body">
//                                         <form>
//                                             <div className="form-group">
//                                                 <label>Tax Name <span className="text-danger">*</span></label>
//                                                 <input className="form-control" value="VAT" type="text" onChange={formHandler} />
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Tax Percentage (%)  <span className="text-danger">*</span></label>
//                                                 <input className="form-control" value="14%" type="text" onChange={formHandler} />
//                                             </div>
//                                             <div className="form-group">
//                                                 <label>Status <span className="text-danger">*</span></label>
//                                                 <Select2
//                                                     defaultValue={1}
//                                                     className="w-100 select"
//                                                     data={status}
//                                                     options={{
//                                                         placeholder: 'Select Status',
//                                                     }}
//                                                 />
//                                             </div>
//                                             <div className="submit-section">
//                                                 <button className="btn btn-primary submit-btn">Save</button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="modal custom-modal fade" id="delete_tax" role="dialog">
//                             <div className="modal-dialog modal-dialog-centered">
//                                 <div className="modal-content">
//                                     <div className="modal-body">
//                                         <div className="modal-icon text-center mb-3">
//                                             <i className="fas fa-trash-alt text-danger"></i>
//                                         </div>
//                                         <div className="modal-text text-center">
//                                             <h2>Delete Tax</h2>
//                                             <p>Are you sure want to delete?</p>
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer text-center">
//                                         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//                                         <button type="button" className="btn btn-primary">Delete</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//              </div>   

//         );

// }
// export default TaxTypes;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SettingSidebar from '../layouts/SettingsSidebar';
import Select2 from 'react-select2-wrapper';
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import SettingDashboardSideBar from './SettingDashboardSideBar';
import { Modal, Table, Tag, Button, Form, Input, Select } from 'antd';
import EditProfile from './EditProfile'; // Import your EditProfile component
import EditPreferences from './EditPreferences'; // Import your EditPreferences component

const { Option } = Select;

const TaxTypes = () => {

  const [editSettingsVisible, setEditSettingsVisible] = useState(false);

  const handleOpenEditSettings = () => {
    setEditSettingsVisible(true);
  };

  const handleCloseEditSettings = () => {
    setEditSettingsVisible(false);
  };

  const [form] = Form.useForm();

  const statusOptions = [
    { id: 1, text: 'Active' },
    { id: 2, text: 'Inactive' },
  ];

  const columns = [
    { title: 'Tax Name', dataIndex: 'name', key: 'name' },
    { title: 'Tax Percentage (%)', dataIndex: 'percentage', key: 'percentage' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'Active' ? 'green' : 'red'}>{text}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span className='edit-delete-parent'>
          <button className='btn btn-info waves-effect waves-light me-2 edit-button' onClick={handleOpenEditSettings}>
            Edit
          </button>
          <button className='btn btn-secondary waves-effect me-2 cancel-button' >
            Delete
          </button>
        </span>
      ),
    },
  ];

  const data = [
    { key: '1', name: 'VAT', percentage: '14%', status: 'Active' },
    { key: '2', name: 'GST', percentage: '30%', status: 'Inactive' },
  ];

  const onFinish = (values) => {
    console.log('Received values:', values);
    handleCloseEditSettings();
  };

  return (
    <div className={`main-wrapper`}>
      <Header />
      <SettingDashboardSideBar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Settings</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-md-4">
              <SettingSidebar />
            </div>
            <div className="col-xl-9 col-md-8">
              <div className="card card-table">
                <div className="card-header">
                  <div className="row">
                    <div className="col">
                      <h5 className="card-title">Tax Types</h5>
                    </div>
                    <div className="col-auto">
                      <Button
                        type="primary" className="primary-button"
                        size="small"
                        onClick={handleOpenEditSettings}
                      >
                        Add New Tax
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table columns={columns} dataSource={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Edit Tax"
          visible={editSettingsVisible}
          onCancel={handleCloseEditSettings}
          footer={null}
        >
          <Form
            form={form}
            name="editTaxForm"
            onFinish={onFinish}
            initialValues={{ name: 'VAT', percentage: '14%', status: 1 }}
          >
            <Form.Item
              label="Tax Name"
              name="name"
              rules={[{ required: true, message: 'Please input Tax Name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tax Percentage (%)"
              name="percentage"
              rules={[
                { required: true, message: 'Please input Tax Percentage!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select Status!' }]}
            >
              <Select>
                {statusOptions.map((status) => (
                  <Option key={status.id} value={status.id}>
                    {status.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="submit-section">
              <Button type="primary" className="primary-button" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default TaxTypes;
