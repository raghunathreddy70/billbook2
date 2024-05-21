import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Input, Pagination, Space, Table, Tooltip } from "antd";
import Data from "../assets/jsons/user";
import FeatherIcon from "feather-icons-react";
import Select2 from "react-select2-wrapper";
import { Button, Modal } from "antd";
import { img10 } from "../_components/imagepath";
import Swal from "sweetalert2";
import axios from "axios";
import AddUser from ".";
import { useSelector } from "react-redux";
import { backendUrl } from "../backendUrl";
import { IoIosSearch } from "react-icons/io";

const Users = () => {
  const [datasource, setDatasource] = useState([]);

  const [passwordType, setPasswordType] = useState("password");

  const [show, setShow] = useState([]);
  const [editUsers1, setEditUsers1] = useState(false);
  const [menu, setMenu] = useState({});
  const [userData, setUserData] = useState(null);

  const userDataMain = useSelector((state) => state?.user?.userData);

  const [validation, setValidation] = useState({
    // profile: { isValid: true, message: '' },
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phone: { isValid: true, message: "" },
    role: { isValid: true, message: "" },
    status: { isValid: true, message: "" },
  });
  const handleFormChange = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const userRegex = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (fieldName === "profile") {
      isValid = value;
      message = "Invalid profile";
    } else if (fieldName === "userName") {
      isValid = userRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "phoneNumber") {
      isValid = phoneRegex.test(value);
      message = "Invalid phone number";
    } else if (fieldName === "role") {
      // isValid = value;
      // message = 'Invalid role'
    }
    setEditingData({
      ...editingData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Img = reader.result;
        setEditingData({
          ...editingData,
          image: base64Img,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const validateFormData = (editingData) => {
    const validationErrors = {};
    // if (!formData.profile) {
    //   validationErrors.profile = { isValid: false, message: 'please' };
    // }
    if (!editingData.userName) {
      validationErrors.userName = {
        isValid: false,
        message: "please enter a user name",
      };
    }
    if (!editingData.email) {
      validationErrors.email = {
        isValid: false,
        message: "please enter a email",
      };
    }
    if (!editingData.phoneNumber) {
      validationErrors.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!editingData.role) {
      validationErrors.role = {
        isValid: false,
        message: "please select a role",
      };
    }
    return validationErrors;
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // const handlePasswordChange1 = (fieldName, value) => {
  //   setPasswordInput1(value);
  //   setFormData({
  //     ...formData,
  //     [fieldName]: value,
  //   });
  // };

  const [addUsers1, setAddUsers1] = useState(false);
  const [role, setRole] = useState([
    { id: "User", text: "User" },
    { id: "Admin", text: "Admin" },
  ]);

  const [status, setStatus] = useState([
    { id: "Active", text: "Active" },
    { id: "Inactive", text: "Inactive" },
    { id: "Restricted", text: "Restricted" },
  ]);

  const togglePassword1 = () => {
    if (passwordType === "password") {
      setPasswordType1("text");
      return;
    }
    setPasswordType1("password");
  };

  const fetchuserData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/fetch-business-users/${userDataMain?.data?.userId}`
      );
      setUserData(response?.data?.Users || [{ 0: "1" }]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchuserData();
  }, [userDataMain]);

  console.log("userDatadfgdfgs", userData)

  console.log("userDataMain", userDataMain);

  const handleUpdate = async (e) => {
    // // e.preventDefault();
    // console.log("first1")
    // const validationErrors = validateFormData(editingData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setValidation((prevValidation) => ({
    //     ...prevValidation,
    //     ...validationErrors,
    //   }));
    //   return;
    // }
    console.log("first1")
    try {
      // Preventing default behavior not applicable here, as it's not an event handler
      // const id = editingData._id;
      // if (!editingData) {
      //   console.error("No data to update.");
      //   return;
      // }
      const response = await axios.put(
        `http://localhost:8000/edit-business-user/${editingData._id}`,
        {editingData}
      );

      console.log("first2")

      if (response.status === 200) {
        toast.success("User Edit Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Optionally, you may handle other UI updates here if needed
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to update User. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };




  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
    status: "",
  });

  const handleEdit = (record) => {
    setEditingData(record);
    setEditingId(record.id);
  };

  const columns = [
    {
      title: "NO.",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-[50%]">
            <img
              className="rounded-[50%] h-10 w-10"
              src={record.userImage.url}
              alt="img"
            />
          </div>
         <p className="customer-name-scroll"> {text}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile Number",
      dataIndex: "phone",
    },
    {
      title: "Role Type",
      dataIndex: "role",
      render: (text, record) => (
        <div>{Object.keys(userDataMain?.data?.roleAccess[text])}</div>
      ),
      sorter: (a, b) => parseInt(a.role) - parseInt(b.role),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <div className="">
              <div className="btn-action-icon d-flex">
                <div className="bg-[#e1ffed] p-2 rounded me-2">
                  <Tooltip title="Edit" placement="top">
                    <Link
                      className="btn-action-icon action-delete-icon"
                      to="#"
                      onClick={() => {
                        handleEdit(record);
                        setEditUsers1(true);
                      }}
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
                      // onClick={() => confirmDeleteCity(record)}
                    >
                      <div className=" bg-[#ffeded] p-1 rounded">
                        <FeatherIcon
                          icon="trash-2"
                          className="text-[#ed2020]"
                        />
                      </div>
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];
  const handleReset = () => {
    setSearchText("");
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper ">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header py-4">
                <h5>Users</h5>
                <div className="searchbar-filter">
                  <Input
                    prefix={<IoIosSearch />}
                    className="search-input"
                    placeholder="Search by name or phone number"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      width: 300,
                      marginBottom: 0,
                      padding: "6px 12px",
                      border: "none",
                      boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px",
                      height: "36px",
                    }}
                  />
                </div>
                <div className="list-btn">
                  <div>
                    <Link
                      className="btn btn-primary"
                      type="primary"
                      to="#"
                      onClick={() => setAddUsers1(true)}
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      />
                      Add User
                    </Link>
                    <AddUser
                      visible={addUsers1}
                      onCancel={() => setAddUsers1(false)}
                      datasource={datasource}
                      setDatasource={setDatasource}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body">
                    <div className="table-responsive table-hover">
                      <Table
                        // pagination={{
                        //   total: userData ? userData.length : 0,

                        //   showTotal: (total, range) =>
                        //     `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        //   showSizeChanger: true,
                        //   onShowSizeChange: onShowSizeChange,
                        //   itemRender: itemRender,
                        // }}
                        columns={columns}
                        dataSource={userData}
                        // dataSource={datasource.filter((record) =>
                        //   record?.Name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        //   record?.Phone?.includes(searchText)
                        // )}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Purchases</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
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

        <Modal
          className="add-bank-account-header-line add-godown-styles"
          title="Edit Users"
          onCancel={() => setEditUsers1(false)}
          open={editUsers1}
          footer={[
            <Button
              key="cancel"
              onClick={() => setEditUsers1(false)}
              className="btn btn-secondary waves-effect me-2"
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="btn btn-info "
              onClick={() => handleUpdate(editingData)}
            >
              Update
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <h5 className="form-title">Profile Picture</h5>
                <div className="profile-picture">
                  <div className="upload-profile">
                    <div className="profile-img">
                      <img id="blah" className="avatar" src={img10} alt="" />
                    </div>
                    <div className="add-profile">
                      <h5
                        value={editingData.profile}
                        onChange={(e) =>
                          handleInputForm("profile", e.target.value)
                        }
                      >
                        Upload a New Photo<span className="text-danger">*</span>
                      </h5>
                    </div>
                  </div>
                  <div className="img-upload d-flex justify-content-center">
                    <label className="btn btn-primary">
                      Upload
                      <input
                        type="file"
                        className="d-none"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                    <Link className="btn btn-remove">Remove</Link>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      !validation.name.isValid ? "is-invalid" : ""
                    }`}
                    placeholder="Enter User Name"
                    value={editingData.name}
                    onChange={(e) =>
                      handleFormChange("name", e.target.value)
                    }
                  />
                  {!validation.name.isValid && (
                    <div className="error-message text-danger">
                      {validation.name.message}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      !validation.email.isValid ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Email Address"
                    value={editingData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                  />
                  {!validation.email.isValid && (
                    <div className="error-message text-danger">
                      {validation.email.message}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Phone Number<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      !validation.phone.isValid ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Phone Number"
                    value={editingData.phone}
                    onChange={(e) =>
                      handleFormChange("phone", e.target.value)
                    }
                  />
                  {!validation.phone.isValid && (
                    <div className="error-message text-danger">
                      {validation.phone.message}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Role<span className="text-danger">*</span>
                  </label>
                  <Select2
                    className={`form-select is-invalid`}
                    data={role}
                    options={{
                      placeholder: "Select Role",
                    }}
                    value={editingData?.role}
                    onChange={(e) => handleFormChange("role", e.target.value)}
                  />
                  {!validation.role.isValid && (
                    <div className="error-message text-danger">
                      {validation.role.message}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Status<span className="text-danger">*</span>
                  </label>
                  <Select2
                    className={`form-select is-invalid`}
                    data={status}
                    options={{
                      placeholder: "Select Role",
                    }}
                    value={editingData.status}
                    onChange={(e) => handleFormChange("role", e.target.value)}
                  />
                  {!validation.status.isValid && (
                    <div className="error-message text-danger">
                      {validation.status.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <div
          className="modal custom-modal fade"
          id="edit_update_modal"
          role="dialog"
        >
          {/* <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Update Vendor</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Update
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        // type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Users;
