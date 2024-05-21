import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Pagination, Table, message } from "antd";
import Data from "../assets/jsons/rolesPermission";
import { Button, Modal } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import { Sort } from "../_components/imagepath";
import { backendUrl } from "../backendUrl";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { VerifyUser } from "../reducers/userReducer";

const RolesPermission = () => {
  const history = useHistory();
  const [addRole1, setAddRole1] = useState(false);
  const [editRole1, setEditRole1] = useState(false);
  const [editRoleText, setEditRoleText] = useState("");
  const [editRoleKey, setEditRoleKey] = useState(null);


  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
  });
  const [validation, setValidation] = useState({
    role: { isValid: "false", message: "" },
  });
  const onchangeRole = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const cityRegex = /^[a-zA-Z\s]*$/;
    if (fieldName === "role") {
      isValid = cityRegex.test(value);
      message = "invalid role";
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };

  const userData = useSelector((state) => state?.user?.userData);
  const dispatch = useDispatch();

  const validateFormData = (formData) => {
    const validationErrors = {};

    if (!formData.role) {
      validationErrors.role = {
        isValid: false,
        message: "please select a role",
      };
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }

    const { status, data } = await axios.post(
      `${backendUrl}/api/admin/create-user-role/${userData?.data?._id}`,
      formData
    );


  
    if (status === 201) {
      setAddRole1(false);
      setMenu(!menu);
      dispatch(VerifyUser());
      
      console.log("data?.msg",data?.msg)
      history.push("/permission",{roleId:data?.msg});
    }
  };

  const dataSource = userData?.data.roleAccess || {};

    const roleAccessData =
      Object.keys(dataSource).map((key, index) => ({
        key: index,
        roleName: dataSource && Object.keys(dataSource[index])[0],
        ...dataSource[key],
      })) || [];
  


  function handleEditRole(record) {
    setEditRoleText(record.roleName);
    setEditRoleKey(record.key);
    setEditRole1(true);
  }

  const handleUpdateRoleName = async () => {
    const response = await axios.post(
      `${backendUrl}/api/admin/update-user-role/${userData?.data?._id}`,
      { editRoleKey, editRoleText }
    );

    if (response.status === 201) {
      setEditRole1(false);
      dispatch(VerifyUser());
      history.push("/roles-permission");
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      render: (text, record) => <div>{text + 1}</div>,
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      render: (text, record) => (
        <>
          <div>{text}</div>
        </>
      ),
    },

    {
      title: "Action",
      dataIndex: "Actions",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn btn-greys me-2"
              onClick={() => handleEditRole(record)}
            >
              <i className="fa fa-edit me-1" /> Edit Role
            </Link>
            <div onClick={()=>history.push("/permission",{roleId:record.key})} className="btn btn-greys me-2">
              
              <i className="fa fa-shield me-1" /> Permissions
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header ">
                <h5>Roles &amp; Permission</h5>
                <div className="list-btn">
                  <ul className="filter-list">
                    {/* <li>
                      <div className="short-filter">
                        <img className="me-2" src={Sort} alt="Sort by select" />
                        <div className="sort-by">
                          <select className="sort">
                            <option>Sort by: Date</option>
                            <option>Sort by: Date 1</option>
                            <option>Sort by: Date 2</option>
                          </select>
                        </div>
                      </div>
                    </li> */}
                    <li>
                      <Link
                        className="btn btn-primary"
                        to="#"
                        onClick={() => setAddRole1(true)}
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Roles
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body rolesPermission">
                    <div className="table-responsive table-hover">
                      <Table
                        key={editRole1}
                        pagination={{
                          total: roleAccessData.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={roleAccessData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddVendor setShow={setShow} show={show} />

        {/* <div className="modal custom-modal fade" id="add_role" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Role</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>
                        Role Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Role Name"
                        value={formdata.role}
                        onChange={(e)=>handlechangeForm("role",e.target.value)}
                      />
                      {!role && <div>Please select a role</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Close
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  onClick={handleSubmit}
                  className="btn btn-primary paid-continue-btn modal-footer-submit-button"
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="modal custom-modal fade" id="edit_role" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Role</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>
                        Role Name <span className="text-danger">*</span>
                      </label>

                      <select name="" id="" className="w-100 adduser-popup-modal">
                        <option value="Enter Role Name">Enter Role Name</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                      </select>

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Close
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn modal-footer-submit-button"
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
        </div> */}
        <Modal
          className="add-bank-account-header-line add-godown-styles"
          title="Add Role"
          onCancel={() => setAddRole1(false)}
          open={addRole1}
          footer={[
            <Button
              key="cancel"
              onClick={() => setAddRole1(false)}
              className="btn btn-secondary waves-effect me-2"
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={handleSubmit}
            >
              Submit
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="form-group mb-0">
                <label>
                  Role Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    !validation.role.isValid ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Role Name"
                  onChange={(e) => onchangeRole("role", e.target.value)}
                  value={formData.role}
                />
                {!validation.role.isValid && (
                  <div className="error-message text-danger">
                    {validation.role.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          className="add-bank-account-header-line add-godown-styles"
          title="Edit Role"
          onCancel={() => setEditRole1(false)}
          open={editRole1}
          footer={[
            <Button
              key="cancel"
              onClick={() => setEditRole1(false)}
              className="btn btn-secondary waves-effect me-2"
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={handleUpdateRoleName}
            >
              Update
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="form-group mb-0">
                <label>
                  Role Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Role Name"
                  value={editRoleText}
                  onChange={(e) => setEditRoleText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RolesPermission;
