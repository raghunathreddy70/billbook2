import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import SettingDashboardSideBar from "../settings/SettingDashboardSideBar";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Data from "../assets/jsons/rolesPermission";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../backendUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { VerifyUser } from "../reducers/userReducer";

const Permission = () => {
  const [menu, setMenu] = useState(false);
  const [Role, setRole] = useState("");
  const [tableData, setTableData] = useState(null);
  const dispatch = useDispatch();
  console.log("tableData", tableData);



  const param = useParams();
  const history = useHistory();
  const location = useLocation();

  const userData = useSelector((state) => state?.user?.userData);

  console.log("userData",userData)
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    const Role = location?.state?.roleId;

    console.log("USER DATA", userData?.data?.roleAccess, Role);

    const roleAccess = userData?.data?.roleAccess;
    console.log("Role Access:", roleAccess);

    const roleObject = roleAccess && roleAccess[Role];
    console.log("Role Object:", roleObject);

    const roleAccessData = roleObject && Object.keys(roleObject);

    setTableData(roleAccessData && roleObject[roleAccessData[0]]);

    setRole(roleAccessData);
  }, [location?.state?.roleId, userData]);

  const Modules = [
    {
      heading: "Customers",
      value: "customers",
    },
    {
      heading: "Vendors",
      value: "vendors",
    },
    {
      heading: "Inventory",
      value: "inventory",
    },
    {
      heading: "Sales",
      value: "sales",
    },
    {
      heading: "Purchases",
      value: "purchases",
    },
    {
      heading: "Godown",
      value: "godown",
    },
    {
      heading: "Reports",
      value: "reports",
    },
    {
      heading: "Recovery Invoice",
      value: "recovery",
    },
    {
      heading: "Finance & Accounts",
      value: "finance",
    },
    {
      heading: "Expenses",
      value: "expenses",
    },
  ];

  console.log("location?.state?.roleId && Role && tableData",location?.state?.roleId ,Role ,tableData)

  const handleUpdateData = async () => {

    if((location?.state?.roleId || location?.state?.roleId === 0) && Role && tableData){

      const response = await axios.post(`${backendUrl}/api/admin/update-role-permission/${userData?.data?._id}`,{RoleId: location?.state?.roleId, Role, tableData })
      
      if(response.status === 200){
        toast.success("Role Permissions Updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        dispatch(VerifyUser());
        history.push('/roles-permission')
      }
      
    }else{
        toast.error("There was error in values", {
          position: toast.POSITION.TOP_RIGHT,
        });
      history.push('/roles-permission')

    }
  }


  const allPermissionsTrue = tableData?.every((rowData) =>
    Object.values(rowData).every((permission) => permission)
  );

  const handleCheckAllChange = () => {
    const allPermissionsTrue = tableData.every((rowData) =>
      Object.values(rowData).every((permission) => permission)
    );

    const updatedTableData = tableData.map((item) => {
      const updatedItem = {};
      Object.keys(item).forEach((key) => {
        updatedItem[key] = !allPermissionsTrue;
      });
      return updatedItem;
    });

    setTableData(updatedTableData);
  };

  const allPermissionsCustomers =
    tableData && Object.keys(tableData[0]).every((key) => tableData[0][key]);

  console.log("allPermissionsCustomers", allPermissionsCustomers);

  const handleModuleChange = (i, index) => {
    console.log("i", i);

    const allPermissionsTrue = Object.keys(tableData[index]).every(
      (key) => tableData[index][key]
    );

    setTableData((prevTableData) => {
      const updatedTableData = prevTableData.map((item, idx) => {
        if (idx === index) {
          const newPermissionsValue = !allPermissionsTrue;
          return {
            ...item,
            [`${i.value}-create`]: newPermissionsValue,
            [`${i.value}-update`]: newPermissionsValue,
            [`${i.value}-delete`]: newPermissionsValue,
            [`${i.value}-read`]: newPermissionsValue,
          };
        }
        return item;
      });
      return updatedTableData;
    });
  };

  const handleCheck = (i, index, type) => {
    console.log("Previous tableData:", i, index, type, tableData);
    setTableData((prevTableData) => {
      const updatedTableData = prevTableData.map((item, idx) => {
        if (idx === index) {
          const permissionKey = `${i.value}-${type}`;
          return {
            ...item,
            [permissionKey]: !item[permissionKey], 
          };
        }
        return item;
      });
      return updatedTableData;
    });
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <SettingDashboardSideBar active={17} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Permission</h5>
              </div>
              <div className="role-testing d-flex align-items-center justify-content-between">
                <h6>
                  Role Name:<span className="ms-1">{Role}</span>
                </h6>
                <p>
                  <label
                    className="custom_check"
                    onChange={handleCheckAllChange}
                  >
                    <input
                      type="checkbox"
                      name="invoice"
                      checked={allPermissionsTrue && allPermissionsTrue}
                    />
                    <span className="checkmark" />
                  </label>
                  Allow All Modules
                </p>
              </div>
            </div>
            {/* /Page Header */}
            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-stripped table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th>Modules</th>
                            <th>Create</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>View</th>
                            <th>Allow all</th>
                          </tr>
                        </thead>
                        <tbody className="table-body-checked-change">
                          {Modules.map((i, index) => (
                            <tr key={index}>
                              <td className="role-data">{i.heading}</td>
                              <td>
                                <label
                                  className="custom_check"
                                  onChange={() =>
                                    handleCheck(i, index, "create")
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    name="invoice"
                                    checked={
                                      tableData &&
                                      tableData[index][`${i.value}-create`]
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </td>
                              <td>
                                <label
                                  className="custom_check"
                                  onChange={() =>
                                    handleCheck(i, index, "update")
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    name="invoice"
                                    checked={
                                      tableData &&
                                      tableData[index][`${i.value}-update`]
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </td>
                              <td>
                                <label
                                  className="custom_check"
                                  onChange={() =>
                                    handleCheck(i, index, "delete")
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    name="invoice"
                                    checked={
                                      tableData &&
                                      tableData[index][`${i.value}-delete`]
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </td>
                              <td>
                                <label
                                  className="custom_check"
                                  onChange={() => handleCheck(i, index, "read")}
                                >
                                  <input
                                    type="checkbox"
                                    name="invoice"
                                    checked={
                                      tableData &&
                                      tableData[index][`${i.value}-read`]
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </td>
                              <td>
                                <label
                                  className="custom_check"
                                  onChange={() => handleModuleChange(i, index)}
                                >
                                  <input
                                    type="checkbox"
                                    name="invoice"
                                    checked={
                                      tableData &&
                                      Object.values(tableData[index]).every(
                                        (value) => value
                                      )
                                    }
                                  />

                                  <span className="checkmark" />
                                </label>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}
            <div className="text-center flex">
              <button onClick={()=> history.push('/roles-permission')} type="submit" className="btn btn-primary cancel me-2">
                Back
              </button>
              <button type="submit" onClick={handleUpdateData} className="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Permission;
