import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import "../_components/antd.css";
import CoutryCodes from "../Data/Country.json";
import { img10 } from "../_components/imagepath";
import Select2 from "react-select2-wrapper";
import { Input, Pagination, Space, Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import axios from "axios";
import DatePicker from "react-datepicker";
import { DropIcon } from "../_components/imagepath";
import EditCustomer from "./EditCustomer";
import { useSelector } from "react-redux";
// import Sample from "./Sample";

const Customers = () => {
  const [websiteError, setWebsiteError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleOpenEditModal = (customerid) => {
    setEditModalVisible(true);
    setCustomerId(customerid)
  };
  // const handleEdit = (record) => {
  //   setEditingData(record);
  //   setEditingId(record.id);
  // };
  // console.log("id", editingId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImageURL(base64Image);
        setFormData({
          ...formData,
          image: base64Image,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [currencyOptions, setcurrencyOptions] = useState([
    { id: 1, text: "0" },
    { id: 2, text: "1" },
    { id: 3, text: "2" },
    { id: 4, text: "3" },
  ]);

  const handleReset = () => {
    setSearchText("");
  };

  const fetchImageData = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
      const blob = response.data;
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image data:", error);
      return null;
    }
  };
  const userData = useSelector((state) => state?.user?.userData)
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/addCustomer/customers/${userData?.data?._id}`
      );
      const dataWithIdsAndTotalInvoices = await Promise.all(
        response.data.map(async (item, index) => {
          const imageUrl = item.image?.url;
          const imageData = imageUrl ? await fetchImageData(imageUrl) : null;
          return {
            ...item,
            id: index + 1,
            image: imageData,
          };
        })
      );
      setDatasource(dataWithIdsAndTotalInvoices.reverse());

      console.log("tabledata", dataWithIdsAndTotalInvoices);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);
  console.log("customers", datasource)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let isFormValid = true;

    Object.keys(formData).forEach((fieldName) => {
      if (formData[fieldName] === "") {
        isFormValid = false;
        setValidation((prevValidation) => ({
          ...prevValidation,
          [fieldName]: { isValid: false, message: "Field cannot be empty" },
        }));
      }
    });
    //billing
    let isBillingValid = true;
    Object.keys(formData.billingAddress).forEach((fieldPath) => {
      if (formData.billingAddress[fieldPath] === "") {
        isBillingValid = false;
        setValidation((prevValidation) => ({
          ...prevValidation,
          billingAddress: {
            ...prevValidation.billingAddress,
            [fieldPath]: { isValid: false, message: "Field cannot be empty" },
          },
          // Swa,
        }));
      }
    });
    //countrydcf
    if (!formData.billingAddress.country) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        billingAddress: {
          ...prevValidation.billingAddress,
          country: false,
        },
      }));
      console.error("Please select a country");
      return;
    }
    //state
    if (!formData.billingAddress.state) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        billingAddress: {
          ...prevValidation.billingAddress,
          state: false,
        },
      }));
      console.error("Please select a state");
      return;
    }
    //city
    if (!formData.billingAddress.city) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        billingAddress: {
          ...prevValidation.billingAddress,
          city: false,
        },
      }));
      console.error("Please select a city");
      return;
    }
    //shipping address
    let isShippingValid = true;
    Object.keys(formData.shippingAddress).forEach((fieldPath) => {
      console.log(formData.shippingAddress.addressLine1);
      if (formData.shippingAddress[fieldPath] === "") {
        isShippingValid = false;

        setValidation((prevValidation) => ({
          ...prevValidation,
          shippingAddress: {
            ...prevValidation.shippingAddress,
            [fieldPath]: { isValid: false, message: "Field cannot be empty" },
          },
        }));
      }
    });
    //countrydcf shipping
    if (!formData.shippingAddress.country) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        shippingAddress: {
          ...prevValidation.shippingAddress,
          country: false,
        },
      }));
      console.error("Please select a country");
      return;
    }
    //state shipping
    if (!formData.shippingAddress.state) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        shippingAddress: {
          ...prevValidation.shippingAddress,
          state: false,
        },
      }));
      console.error("Please select a state");
      return;
    }
    //city shipping
    if (!formData.shippingAddress.city) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        shippingAddress: {
          ...prevValidation.shippingAddress,
          city: false,
        },
      }));
      console.error("Please select a city");
      return;
    }

    if (!isFormValid || !isBillingValid || !isShippingValid) {
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/addCustomer/update-customer/${id}`,
        formData
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Customer added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        fetchData();
        $("edit-customer-page-1").modal("hide");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add customer. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred while adding the customer.",
      });

      console.error("Error:", error);
    }
  };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/addCustomer/customers",
//         cusformData
//       );

//       if (response.status === 201) {
//         Swal.fire({
//           icon: "success",
//           title: "Customer added successfully!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Failed to add customer. Please try again.",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "An error occurred while adding the customer.",
//       });

//       console.error("Error:", error);
//     }
//   };
  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `${backendUrl}/api/addCustomer/deletecustomers/${id}`
      );
      if (response.status === 200) {
        fetchcurrencyData();
      } else {
        console.error("Failed to delete customer record. Please try again.");
      }
    } catch (error) {
      console.error(
        "An error occurred while deleting the customer record:",
        error
      );
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Company Name",
      dataIndex: "name",
      render: (text, record) => (
        <>
          <h2 className="table-avatar">
            <Link to="/profile">{record.name}</Link>
          </h2>
        </>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => a.balance.length - b.balance.length,
    },
    {
      title: "  Total Invoice",
      dataIndex: "totalInvoice",
      sorter: (a, b) => a.totalInvoice.length - b.totalInvoice.length,
    },
    {
      title: "Created",
      dataIndex: "created",
      sorter: (a, b) => a.created.length - b.created.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div>
          {text === "active" && (
            <span className="badge badge-pill bg-success-light">{text}</span>
          )}
          {text === "deactive" && (
            <span className="badge badge-pill bg-danger-light">{text}</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="table-invoice d-flex align-items-center">
            <Link to="/add-invoice" className="btn btn-greys me-2">
              <i className="fa fa-plus-circle me-1" /> Invoice
            </Link>
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className=" btn-action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <ul>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => {
                        // handleEdit(record._id);
                        handleOpenEditModal(record._id); // Open the modal
                      }}
                    // to={`/edit-customer/${record._id}`}
                    >
                      <i className="far fa-edit me-2" />
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                      onClick={() => handleDelete(record._id)}
                    >
                      <i className="far fa-trash-alt me-2" />
                      Delete
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/customer-details/${record._id}`}
                    >
                      <i className="far fa-eye me-2" />
                      View
                    </Link>
                  </li>
                  {/* <li>
                    <Link className="dropdown-item" to="/active-customers">
                      <i className="far fa-bell me-2" />
                      Active
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link className="dropdown-item" to="/deactive-customers">
                      <i className="far fa-bell-slash me-2" />
                      Deactivate
                    </Link>
                  </li> */}
                  <li>
                    {/* <Link className="dropdown-item" to="/active-customers">
                      <i className="far fa-bell me-2" />
                      Active
                    </Link> */}
                  </li>
                  <li>
                    {/* <Link className="dropdown-item" to="/deactive-customers">
                      <i className="far fa-bell-slash me-2" />
                      Deactivate
                    </Link> */}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];

  const [formData, setFormData] = useState({
    image: "",
    name: "",
    email: "",
    phone: "",
    currency: "",
    website: "",
    notes: "",
    companyName: "",
    GSTNo: "",
    PANNumber: "",
    billingAddress: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    },
    shippingAddress: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    },
    image: null,
  });
  console.log("formdata", formData);

  const handleInputChange = (fieldName, value) => {
    let isValid = true;
    let message = "";

    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (fieldName === "name") {
      isValid = nameRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "phone") {
      isValid = phoneRegex.test(value);
      message = "Invalid number";
    } else if (fieldName === "website") {
      isValid = value;
      message = "Invalid website";
    } else if (fieldName === "currency") {
      isValid = value;
      message = "Invalid";
    }

    if (value === "") {
      isValid = false;
      message = "Field cannot be empty";
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

  const handleFieldChange = (e, fieldPath, value) => {
    console.log(value);

    const pathArray = fieldPath.split(".");

    const updatedFormData = { ...formData };

    let nestedObject = updatedFormData;
    for (let i = 0; i < pathArray.length - 1; i++) {
      nestedObject = nestedObject[pathArray[i]];
    }

    nestedObject[pathArray[pathArray.length - 1]] = e.target.value;

    let isValid = true;
    let message = "";

    const billingnameRegex = /^[a-zA-Z\s]+$/;
    const pincodeRegex = /^\d{6}$/;
    const billAddress1Regex = /^[a-zA-Z\d\s\.,#\-]+$/;

    if (fieldPath === "billingAddress.name") {
      isValid = billingnameRegex.test(value);
    } else if (fieldPath === "billingAddress.addressLine1") {
      isValid = billAddress1Regex.test(value);
    } else if (fieldPath === "billingAddress.addressLine2") {
      isValid = billAddress1Regex.test(value);
    } else if (fieldPath === "billingAddress.pincode") {
      isValid = pincodeRegex.test(value);
    } else if (fieldPath === "shippingAddress.name") {
      isValid = billingnameRegex.test(value);
    } else if (fieldPath === "shippingAddress.addressLine1") {
      isValid = billAddress1Regex.test(value);
    } else if (fieldPath === "shippingAddress.addressLine2") {
      isValid = billAddress1Regex.test(value);
    } else if (fieldPath === "shippingAddress.pincode") {
      isValid = pincodeRegex.test(value);
    }

    if (!isValid) {
      message = "Invalid";
    }
    if (value === "") {
      isValid = false;
      message = "Field cannot be empty";
    }
    setFormData({
      ...formData,
      [fieldPath]: value,
    });

    let updatedState = { ...validation };
    if (pathArray?.length > 1) {
      updatedState[pathArray[0]][pathArray[1]] = { isValid, message };
    } else {
      updatedState[fieldPath] = { isValid, message };
    }
    setValidation(updatedState);
  };

  const [validation, setValidation] = useState({
    image: true,
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phone: { isValid: true, message: "" },
    currency: { isValid: true, message: "" },
    website: { isValid: true, message: "" },
    billingAddress: {
      name: { isValid: true, message: "" },
      addressLine1: { isValid: true, message: "" },
      addressLine2: { isValid: true, message: "" },
      pincode: { isValid: true, message: "" },
      country: true,
      state: true,
      city: true,
    },
    shippingAddress: {
      name: { isValid: true, message: "" },
      addressLine1: { isValid: true, message: "" },
      addressLine2: { isValid: true, message: "" },
      pincode: { isValid: true, message: "" },
      country: true,
      state: true,
      city: true,
    },
  });
  useEffect(() => {
    console.log(validation);
  }, [validation]);

  const data = CoutryCodes;

  const [countries, setCountries] = useState([]);
  console.log("countries", countries);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Shipping country data
  const [billingCountries, setBillingCountries] = useState([]);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState("");
  const [billingstates, setBillingStates] = useState([]);
  const [selectedBillingState, setSelectedBillingState] = useState("");
  const [billingcities, setBillingCities] = useState([]);
  const [selectedBillingCity, setSelectedBillingCity] = useState("");

  const [sameAdressischecked, setSameAdressischecked] = useState(false);

  // useEffect(() => {

  //   fetch(
  //     "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCountries(data.geonames);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching countries:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (selectedCountry) {
  //     // Fetch a list of states for the selected country from Geonames.org
  //     fetch(
  //       `http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setStates(data.geonames);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching states:", error);
  //       });
  //   } else {
  //     setStates([]);
  //     setSelectedState("");
  //   }
  // }, [selectedCountry]);
  // useEffect(() => {
  //   if (selectedCountry) {
  //     // Fetch a list of states for the selected country from Geonames.org
  //     fetch(
  //       `http://api.geonames.org/childrenJSON?geonameId=${selectedCountry}&formatted=true&lang=en&username=srikanthhirola`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Filter out only states from the response
  //         const states = data.geonames.filter((item) => item.fcode === 'ADM1');
  //         setStates(states);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching states:", error);
  //       });
  //   } else {
  //     setStates([]);
  //     setSelectedState("");
  //   }
  // }, [selectedCountry]);

  // useEffect(() => {
  //   if (selectedState) {

  //     fetch(
  //       `http://api.geonames.org/childrenJSON?geonameId=${selectedState}&username=srikanthhirola`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setCities(data.geonames);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching cities:", error);
  //       });
  //   } else {
  //     setCities([]);
  //     setSelectedCity("");
  //   }
  // }, [selectedState]);

  // useEffect(() => {

  //   fetch(
  //     "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setBillingCountries(data.geonames);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching countries:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (selectedBillingCountry) {

  //     fetch(
  //       `http://api.geonames.org/childrenJSON?geonameId=${selectedBillingCountry}&username=srikanthhirola`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setBillingStates(data.geonames);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching states:", error);
  //       });
  //   } else {
  //     setBillingStates([]);
  //     setSelectedBillingState("");
  //   }
  // }, [selectedBillingCountry]);

  // useEffect(() => {
  //   if (selectedBillingState) {

  //     fetch(
  //       `http://api.geonames.org/childrenJSON?geonameId=${selectedBillingState}&username=srikanthhirola`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setBillingCities(data.geonames);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching cities:", error);
  //       });
  //   } else {
  //     setBillingCities([]);
  //     setSelectedBillingCity("");
  //   }
  // }, [selectedBillingState]);

  const handleCountryChange = (e) => {
    console.log(e.target.value);
    const newSelectedCountry = e.target.value;
    setSelectedCountry(newSelectedCountry);

    if (newSelectedCountry) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        billingAddress: {
          ...prevValidation.billingAddress,
          country: true,
        },
      }));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      billingAddress: {
        ...prevFormData.billingAddress,
        country: newSelectedCountry,
      },
    }));

    setSelectedState("");
    setSelectedCity("");
  };

  const handleStateChange = (e) => {
    console.log(e.target.value);
    const newSelectedState = e.target.value;
    setSelectedState(newSelectedState);

    if (newSelectedState) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        billingAddress: {
          ...prevValidation.billingAddress,
          state: true,
        },
      }));
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      billingAddress: {
        ...prevFormData.billingAddress,
        state: newSelectedState,
      },
    }));
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    const newSelectedCity = e.target.value;
    if (newSelectedCity) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        billingAddress: {
          ...prevValidation.billingAddress,
          city: true,
        },
      }));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      billingAddress: {
        ...prevFormData.billingAddress,
        city: newSelectedCity,
      },
    }));
  };

  const handleCountryChangeTwo = (e) => {
    const newSelectedCountry = e.target.value;
    setSelectedBillingCountry(newSelectedCountry);

    if (newSelectedCountry) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        shippingAddress: {
          ...prevValidation.shippingAddress,
          country: true,
        },
      }));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      shippingAddress: {
        ...prevFormData.shippingAddress,
        country: newSelectedCountry,
      },
    }));
    setSelectedBillingState("");
    setSelectedBillingCity("");
  };

  const handleStateChangeTwo = (e) => {
    const newSelectedState = e.target.value;
    setSelectedBillingState(newSelectedState);

    if (newSelectedState) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        shippingAddress: {
          ...prevValidation.shippingAddress,
          state: true,
        },
      }));
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      shippingAddress: {
        ...prevFormData.shippingAddress,
        state: newSelectedState,
      },
    }));
    setSelectedCity("");
  };

  const handleCityChangeTwo = (e) => {
    const newSelectedCity = e.target.value;
    setSelectedBillingCity(newSelectedCity);

    if (newSelectedCity) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        shippingAddress: {
          ...prevValidation.shippingAddress,
          city: true,
        },
      }));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      shippingAddress: {
        ...prevFormData.shippingAddress,
        city: newSelectedCity,
      },
    }));
  };

  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Img = reader.result;
        setFormData({
          ...formData,
          image: base64Img,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSameAsBillingChange = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData({
        ...formData,
        shippingAddress: { ...formData.billingAddress },
        sameAsBilling: isChecked,
      });
    } else {
      setFormData({
        ...formData,
        shippingAddress: {
          name: "",
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          country: "",
          state: "",
          city: "",
        },
        sameAsBilling: isChecked,
      });
    }
  };

  console.log("formdata", formData);

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />

        <Sidebar active={2} />

        <div className="page-wrapper customers">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <h5>Customers</h5>
                <div className="searchbar-filter">
                  <Input
                    className="searh-input"
                    placeholder="Search by name or phone number"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      width: 300,
                      marginBottom: 0,
                      padding: "6px 12px",
                      border: "none",
                      boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px",
                    }}
                  />
                  <Space>
                    <button
                      onClick={handleReset}
                      size="small"
                      style={{
                        width: 90,
                        padding: 7,
                        background: "#ed2020",
                        border: "none",
                        boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
                        borderRadius: 7,
                        color: "#fff",
                      }}
                    >
                      Reset
                    </button>
                  </Space>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    {/* <li>
                      <Link className="btn btn-import" to="#">
                        <span>
                          <FeatherIcon icon="check-square" className="me-2" />
                          Import Customer
                        </span>
                      </Link>
                    </li> */}
                    {/* <li>
                      <Link className="btn btn-primary" to="/add-customer">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Customer
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#bs-example-modal-lg"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Customer
                      </Link>
                    </li>
                    <div
                      className="modal fade"
                      id="bs-example-modal-lg"
                      tabIndex={-1}
                      role="dialog"
                      aria-labelledby="myLargeModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header border-0 pb-0">
                            <h4 className="modal-title" id="myLargeModalLabel">
                              Add New Customer
                            </h4>
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
                              <div className="col-xl-12">
                                <div className="card">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="card-body pb-0">
                                        <div className="form-group-item border-bottom-0 m-0">
                                          {/* <h5 className="form-title">Profile Picture</h5> */}
                                          <div className="profile-picture m-0">
                                            <div className="upload-profile">
                                              <div className="profile-img">
                                                {formData.image ? (
                                                  <img
                                                    id="blah"
                                                    className="avatar"
                                                    src={formData.image}
                                                    alt="Profile"
                                                  />
                                                ) : (
                                                  <img
                                                    id="blah"
                                                    className="avatar"
                                                    src={img10}
                                                    alt=""
                                                  />
                                                )}
                                              </div>

                                              <div className="add-profile">
                                                <h5>
                                                  Upload a profile picture{" "}
                                                </h5>
                                                <span>
                                                  {formData.image
                                                    ? "Profile-pic.jpg"
                                                    : ""}
                                                </span>
                                                {validation.billingAddress
                                                  .state === false && (
                                                    <div className="error-message text-danger">
                                                      Please select a state
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="img-upload">
                                              <label className="btn btn-primary me-2">
                                                Upload
                                                <input
                                                  type="file"
                                                  className="d-none"
                                                  onChange={handleImageChange}
                                                  required
                                                />
                                              </label>
                                              <button
                                                className="btn btn-remove"
                                                onClick={() =>
                                                  setFormData({ image: null })
                                                }
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          </div>
                                          {/* {validation.image === false && (
                          <div className="error-message text-danger">Please select a image</div>
                        )} */}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="card-body">
                                        <form
                                          className="row g-3 form-group"
                                          onSubmit={handleFormSubmit}
                                        >
                                          <div className="col-md-4">
                                            <label
                                              htmlFor="inputName4"
                                              className="form-label"
                                            >
                                              Company Name
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              className={`form-control ${!validation.name.isValid
                                                  ? "is-invalid"
                                                  : ""
                                                }`}
                                              id="inputName4"
                                              placeholder="Enter Company Name"
                                              value={formData.name}
                                              onChange={(e) => {
                                                handleInputChange(
                                                  "name",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            {!validation.name.isValid && (
                                              <div className="error-message text-danger">
                                                {validation.name.message}
                                              </div>
                                            )}
                                          </div>

                                          <div className="col-md-4">
                                            <label
                                              htmlFor="inputPhone"
                                              className="form-label"
                                            >
                                              Phone{" "}
                                              <span className="text-danger ">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="number"
                                              className={`form-control ${!validation.phone.isValid
                                                  ? "is-invalid"
                                                  : ""
                                                }`}
                                              id="inputPhone"
                                              pattern="[0-9]*"
                                              value={formData.phone}
                                              onChange={(e) => {
                                                handleInputChange(
                                                  "phone",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            {!validation.phone.isValid && (
                                              <div className="error-message text-danger">
                                                {validation.phone.message}
                                              </div>
                                            )}
                                          </div>
                                          {/* <div class="col-md-4">
                                            <label for="inputCurrency" class="form-label">
                                              Currency <span className="text-danger">*</span>
                                            </label>
                                            <select
                                              id="inputCurrency"
                                              class={`form-select ${!validation.currency.isValid ? "is-invalid" : ""
                                                }`}
                                              value={formData.currency}
                                              onChange={(e) => {
                                                handleInputChange("currency", e.target.value);
                                              }}
                                            >
                                              {data.map((cData) => (
                                                <option value={cData.code}>{cData.code}</option>
                                              ))}
                                            </select>
                                            {!validation.currency.isValid && (
                                              <div className="error-message text-danger">
                                                {validation.currency.message}
                                              </div>
                                            )}
                                          </div> */}

                                          <div className="col-md-4">
                                            <label>GST No</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.GSTNo}
                                              onChange={(e) => {
                                                setFormData({
                                                  ...formData,
                                                  GSTNo: e.target.value,
                                                });
                                              }}
                                            />
                                          </div>
                                          <div className="col-md-4">
                                            <label>PAN Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={formData.PANNumber}
                                              onChange={(e) => {
                                                setFormData({
                                                  ...formData,
                                                  PANNumber: e.target.value,
                                                });
                                              }}
                                            />
                                          </div>

                                          <div className="row mt-5">
                                            <div className="col-md-12">
                                              <h2 className="mt-3 mb-3 fs-4">
                                                Billing Address
                                              </h2>
                                              <div className="row">
                                                <div class="col-lg-6 col-md-12 mb-3">
                                                  <label
                                                    for="inputAddress"
                                                    class="form-label"
                                                  >
                                                    Address
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    class={`form-control ${!validation.billingAddress
                                                        .addressLine1.isValid
                                                        ? "is-invalid"
                                                        : ""
                                                      }`}
                                                    id="inputAddress"
                                                    placeholder="1234 Main St"
                                                    value={
                                                      formData.billingAddress
                                                        .addressLine1
                                                    }
                                                    name="billingAddress.addressLine1"
                                                    onChange={(e) =>
                                                      handleFieldChange(
                                                        e,
                                                        "billingAddress.addressLine1",
                                                        "addressLine1"
                                                      )
                                                    }
                                                  />
                                                  {!validation.billingAddress
                                                    .addressLine1.isValid && (
                                                      <div className="error-message text-danger">
                                                        {
                                                          validation
                                                            .billingAddress
                                                            .addressLine1.message
                                                        }
                                                      </div>
                                                    )}
                                                </div>

                                                <div class="col-lg-6 col-md-12 mb-3">
                                                  <label
                                                    for="inputAddress2"
                                                    class="form-label"
                                                  >
                                                    Pincode
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </label>
                                                  <input
                                                    type="number"
                                                    class={`form-control ${!validation.billingAddress
                                                        .pincode.isValid
                                                        ? "is-invalid"
                                                        : ""
                                                      }`}
                                                    id="Pincode"
                                                    placeholder="Enter Pincode"
                                                    value={
                                                      formData.billingAddress
                                                        .pincode
                                                    }
                                                    onChange={(e) =>
                                                      handleFieldChange(
                                                        e,
                                                        "billingAddress.pincode",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  {!validation.billingAddress
                                                    .pincode.isValid && (
                                                      <div className="error-message text-danger">
                                                        {
                                                          validation
                                                            .billingAddress
                                                            .pincode.message
                                                        }
                                                      </div>
                                                    )}
                                                </div>
                                                <div className="row">
                                                  <div className="col-lg-6 col-md-12">
                                                    <label
                                                      className="form-label"
                                                      htmlFor="countryDropdownTwo"
                                                    >
                                                      Select a Country:
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <select
                                                      id="countryDropdownTwo"
                                                      value={
                                                        formData.billingAddress
                                                          .country
                                                      }
                                                      onChange={
                                                        handleCountryChange
                                                      }
                                                      className={`form-select ${!validation
                                                          .billingAddress
                                                          .country
                                                          ? "is-invalid"
                                                          : ""
                                                        }`}
                                                    >
                                                      <option value="billingAddress.country">
                                                        Select a country
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </option>
                                                      {countries?.map(
                                                        (country) => (
                                                          <option
                                                            key={
                                                              country.geonameId
                                                            }
                                                            value={
                                                              country.geonameId
                                                            }
                                                          >
                                                            {
                                                              country.countryName
                                                            }
                                                          </option>
                                                        )
                                                      )}
                                                    </select>
                                                    {validation.billingAddress
                                                      .country === false && (
                                                        <div className="error-message text-danger">
                                                          Please select a country
                                                        </div>
                                                      )}
                                                    <br />
                                                  </div>
                                                  <div className="col-lg-6 col-md-12">
                                                    {selectedCountry && (
                                                      <div>
                                                        <label
                                                          className="form-label"
                                                          htmlFor="stateDropdownOne"
                                                        >
                                                          Select a State:
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                        <select
                                                          id="stateDropdownOne"
                                                          value={
                                                            formData
                                                              .billingAddress
                                                              .state
                                                          }
                                                          onChange={
                                                            handleStateChange
                                                          }
                                                          class={`form-select ${!validation
                                                              .billingAddress
                                                              .state
                                                              ? "is-invalid"
                                                              : ""
                                                            }`}
                                                        >
                                                          <option value="">
                                                            Select a state
                                                          </option>
                                                          {states.map(
                                                            (state) => (
                                                              <option
                                                                key={
                                                                  state.geonameId
                                                                }
                                                                value={
                                                                  state.geonameId
                                                                }
                                                              >
                                                                {state.name}
                                                              </option>
                                                            )
                                                          )}
                                                        </select>
                                                        {validation
                                                          .billingAddress
                                                          .state === false && (
                                                            <div className="error-message text-danger">
                                                              Please select a
                                                              state
                                                            </div>
                                                          )}
                                                        <br />
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="col-lg-6 col-md-12">
                                                    {selectedState && (
                                                      <div>
                                                        <label
                                                          class="form-label"
                                                          htmlFor="cityDropdownOne"
                                                        >
                                                          Select a City:
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                        <select
                                                          id="cityDropdownOne"
                                                          value={
                                                            formData
                                                              .billingAddress
                                                              .city
                                                          }
                                                          onChange={
                                                            handleCityChange
                                                          }
                                                          class={`form-select ${!validation
                                                              .billingAddress
                                                              .city
                                                              ? "is-invalid"
                                                              : ""
                                                            }`}
                                                        >
                                                          <option value="">
                                                            Select a city
                                                          </option>
                                                          {cities.map(
                                                            (city) => (
                                                              <option
                                                                key={
                                                                  city.geonameId
                                                                }
                                                                value={
                                                                  city.geonameId
                                                                }
                                                              >
                                                                {city.name}
                                                              </option>
                                                            )
                                                          )}
                                                        </select>
                                                        {validation
                                                          .billingAddress
                                                          .city === false && (
                                                            <div className="error-message text-danger">
                                                              Please select a
                                                              country
                                                            </div>
                                                          )}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="row mt-3">
                                              <div className="col-md-12">
                                                <div className="form-check">
                                                  <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="sameAsBilling"
                                                    checked={
                                                      formData.sameAsBilling
                                                    }
                                                    onChange={
                                                      handleSameAsBillingChange
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="sameAsBilling"
                                                  >
                                                    Shipping Address is Same as
                                                    Billing Address
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                            {!formData.sameAsBilling && (
                                              <div className="col-md-12">
                                                <h2 className="mt-5 mb-3 fs-4">
                                                  Shipping Address
                                                </h2>
                                                <div className="row">
                                                  <div class="col-lg-6 col-md-12 mb-3">
                                                    <label
                                                      for="inputAddress"
                                                      class="form-label"
                                                    >
                                                      Address{" "}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      class={`form-control ${!validation
                                                          .shippingAddress
                                                          .addressLine1.isValid
                                                          ? "is-invalid"
                                                          : ""
                                                        }`}
                                                      id="inputAddress"
                                                      placeholder="1234 Main St"
                                                      value={
                                                        formData.shippingAddress
                                                          .addressLine1
                                                      }
                                                      onChange={(e) =>
                                                        handleFieldChange(
                                                          e,
                                                          "shippingAddress.addressLine1",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {!validation.shippingAddress
                                                      .addressLine1.isValid && (
                                                        <div className="error-message text-danger">
                                                          {
                                                            validation
                                                              .shippingAddress
                                                              .addressLine1
                                                              .message
                                                          }
                                                        </div>
                                                      )}
                                                  </div>

                                                  <div class="col-lg-6 col-md-12 mb-3">
                                                    <label
                                                      for="inputAddress2"
                                                      class="form-label"
                                                    >
                                                      Pincode{" "}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      class={`form-control ${!validation
                                                          .shippingAddress
                                                          .pincode.isValid
                                                          ? "is-invalid"
                                                          : ""
                                                        }`}
                                                      id="Pincode"
                                                      placeholder="Enter Pincode"
                                                      value={
                                                        formData.shippingAddress
                                                          .pincode
                                                      }
                                                      onChange={(e) =>
                                                        handleFieldChange(
                                                          e,
                                                          "shippingAddress.pincode",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {!validation.shippingAddress
                                                      .pincode.isValid && (
                                                        <div className="error-message text-danger">
                                                          {
                                                            validation
                                                              .shippingAddress
                                                              .pincode.message
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="row">
                                                    <div className="col-lg-6 col-md-12 mb-3">
                                                      <label
                                                        className="form-label"
                                                        htmlFor="countryDropdownTwo"
                                                      >
                                                        Select a Country:{" "}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                      <select
                                                        id="countryDropdownTwo"
                                                        value={
                                                          formData
                                                            .shippingAddress
                                                            .country
                                                        }
                                                        onChange={
                                                          handleCountryChangeTwo
                                                        }
                                                        className={`form-select ${!validation
                                                            .shippingAddress
                                                            .country
                                                            ? "is-invalid"
                                                            : ""
                                                          }`}
                                                      >
                                                        <option value="">
                                                          Select a country
                                                        </option>
                                                        {billingCountries?.map(
                                                          (country) => (
                                                            <option
                                                              key={
                                                                country.geonameId
                                                              }
                                                              value={
                                                                country.geonameId
                                                              }
                                                            >
                                                              {
                                                                country.countryName
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                      {!validation
                                                        .shippingAddress
                                                        .country && (
                                                          <div className="error-message text-danger">
                                                            Please select a
                                                            country.
                                                          </div>
                                                        )}
                                                      <br />
                                                    </div>
                                                    <div className="col-lg-6 col-md-12 mb-3">
                                                      {selectedBillingCountry && (
                                                        <div>
                                                          <label
                                                            className="form-label"
                                                            htmlFor="stateDropdownTwo"
                                                          >
                                                            Select a State:{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                          <select
                                                            id="stateDropdownTwo"
                                                            value={
                                                              formData
                                                                .shippingAddress
                                                                .state
                                                            }
                                                            onChange={
                                                              handleStateChangeTwo
                                                            }
                                                            class={`form-select ${!validation
                                                                .shippingAddress
                                                                .state
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                          >
                                                            <option value="">
                                                              Select a state
                                                            </option>
                                                            {billingstates.map(
                                                              (state) => (
                                                                <option
                                                                  key={
                                                                    state.geonameId
                                                                  }
                                                                  value={
                                                                    state.geonameId
                                                                  }
                                                                >
                                                                  {state.name}
                                                                </option>
                                                              )
                                                            )}
                                                          </select>
                                                          {!validation
                                                            .shippingAddress
                                                            .state && (
                                                              <div className="error-message text-danger">
                                                                Please select a
                                                                state.
                                                              </div>
                                                            )}
                                                          <br />
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-12 mb-3">
                                                      {selectedBillingState && (
                                                        <div>
                                                          <label
                                                            class="form-label"
                                                            htmlFor="cityDropdownTwo"
                                                          >
                                                            Select a City:{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                          <select
                                                            id="cityDropdownTwo"
                                                            value={
                                                              formData
                                                                .shippingAddress
                                                                .city
                                                            }
                                                            onChange={
                                                              handleCityChangeTwo
                                                            }
                                                            class={`form-select ${!validation
                                                                .shippingAddress
                                                                .city
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                          >
                                                            <option value="">
                                                              Select a city
                                                            </option>
                                                            {billingcities.map(
                                                              (city) => (
                                                                <option
                                                                  key={
                                                                    city.geonameId
                                                                  }
                                                                  value={
                                                                    city.geonameId
                                                                  }
                                                                >
                                                                  {city.name}
                                                                </option>
                                                              )
                                                            )}
                                                          </select>
                                                          {!validation
                                                            .shippingAddress
                                                            .city && (
                                                              <div className="error-message text-danger">
                                                                Please select a
                                                                city.
                                                              </div>
                                                            )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          {/* <div className="col-12">
                                            <button
                                              className="btn btn-primary"
                                              onClick={handleFormSubmit}
                                            >
                                              Submit
                                            </button>
                                          </div> */}
                                        </form>
                                      </div>
                                    </div>
                                  </div>{" "}
                                  {/* end row*/}
                                </div>{" "}
                                {/* end card*/}
                              </div>{" "}
                            </div>
                          </div>

                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary waves-effect me-2"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn btn-info waves-effect waves-light"
                              onClick={handleFormSubmit}
                            >
                              SaveSubmit
                            </button>
                          </div>
                        </div>
                        {/* /.modal-content */}
                      </div>
                    </div>
                    <div
                      className="modal fade"
                      id="edit-customer-page-1"
                      tabIndex={-1}
                      role="dialog"
                      aria-labelledby="myLargeModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                              <h4
                                className="modal-title"
                                id="myLargeModalLabel"
                              >
                                edit Customer
                              </h4>
                              <button
                                type="button"
                                className="close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                <span
                                  className="align-center"
                                  aria-hidden="true"
                                >
                                  ×
                                </span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col-xl-12">
                                  <div className="card">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="card-body pb-0">
                                          <div className="form-group-item border-bottom-0 m-0">
                                            {/* <h5 className="form-title">Profile Picture</h5> */}
                                            <div className="profile-picture m-0">
                                              <div className="upload-profile">
                                                <div className="profile-img">
                                                  {formData.image ? (
                                                    <img
                                                      id="blah"
                                                      className="avatar"
                                                      src={formData.image.url}
                                                      alt="Profile"
                                                    />
                                                  ) : (
                                                    <img
                                                      id="blah"
                                                      className="avatar"
                                                      src={img10}
                                                      alt=""
                                                    />
                                                  )}
                                                </div>

                                                <div className="add-profile">
                                                  <h5>
                                                    Upload a New Photo{" "}
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </h5>
                                                  <span>
                                                    {formData.image
                                                      ? "Profile-pic.jpg"
                                                      : ""}
                                                  </span>
                                                  {validation.billingAddress
                                                    .state === false && (
                                                      <div className="error-message text-danger">
                                                        Please select a state
                                                      </div>
                                                    )}
                                                </div>
                                              </div>
                                              <div className="img-upload">
                                                <label className="btn btn-primary me-2">
                                                  Upload
                                                  <input
                                                    type="file"
                                                    className="d-none"
                                                    onChange={handleImageChange}
                                                    required
                                                  />
                                                </label>
                                                <button
                                                  className="btn btn-remove"
                                                  onClick={() =>
                                                    setFormData({ image: null })
                                                  }
                                                >
                                                  Remove
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="card-body">
                                          <form
                                            className="row g-3 form-group"
                                            onSubmit={handleFormSubmit}
                                          >
                                            <div className="col-md-4">
                                              <label
                                                htmlFor="inputName4"
                                                className="form-label"
                                              >
                                                Name
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                className={`form-control ${!validation.name.isValid
                                                    ? "is-invalid"
                                                    : ""
                                                  }`}
                                                id="inputName4"
                                                placeholder="Enter Item Name"
                                                value={formData.name}
                                                onChange={(e) => {
                                                  handleInputChange(
                                                    "name",
                                                    e.target.value
                                                  );
                                                }}
                                              />
                                              {!validation.name.isValid && (
                                                <div className="error-message text-danger">
                                                  {validation.name.message}
                                                </div>
                                              )}
                                            </div>

                                            <div className="col-md-4">
                                              <label
                                                htmlFor="inputPhone"
                                                className="form-label"
                                              >
                                                Phone{" "}
                                                <span className="text-danger ">
                                                  *
                                                </span>
                                              </label>
                                              <input
                                                type="number"
                                                className={`form-control ${!validation.phone.isValid
                                                    ? "is-invalid"
                                                    : ""
                                                  }`}
                                                placeholder="Enter Phone Number"
                                                id="inputPhone"
                                                pattern="[0-9]*"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                  handleInputChange(
                                                    "phone",
                                                    e.target.value
                                                  );
                                                }}
                                              />
                                              {!validation.phone.isValid && (
                                                <div className="error-message text-danger">
                                                  {validation.phone.message}
                                                </div>
                                              )}
                                            </div>
                                            {/* <div class="col-md-4">
                                            <label for="inputCurrency" class="form-label">
                                              Currency <span className="text-danger">*</span>
                                            </label>
                                            <select
                                              id="inputCurrency"
                                              class={`form-select ${!validation.currency.isValid ? "is-invalid" : ""
                                                }`}
                                              value={formData.currency}
                                              onChange={(e) => {
                                                handleInputChange("currency", e.target.value);
                                              }}
                                            >
                                              {data.map((cData) => (
                                                <option value={cData.code}>{cData.code}</option>
                                              ))}
                                            </select>
                                            {!validation.currency.isValid && (
                                              <div className="error-message text-danger">
                                                {validation.currency.message}
                                              </div>
                                            )}
                                          </div> */}

                                            <div className="col-md-4">
                                              <label>GST No</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter GST Number"
                                                value={formData.GSTNo}
                                                onChange={(e) => {
                                                  setFormData({
                                                    ...formData,
                                                    GSTNo: e.target.value,
                                                  });
                                                }}
                                              />
                                            </div>
                                            <div className="col-md-4">
                                              <label>PAN Number</label>
                                              <input
                                                type="text"
                                                placeholder="Enter PAN Number"
                                                className="form-control"
                                                value={formData.PANNumber}
                                                onChange={(e) => {
                                                  setFormData({
                                                    ...formData,
                                                    PANNumber: e.target.value,
                                                  });
                                                }}
                                              />
                                            </div>

                                            <div className="row mt-5">
                                              <div className="col-md-12">
                                                <h2 className="mt-3 mb-3 fs-4">
                                                  Billing Address
                                                </h2>
                                                <div className="row">
                                                  <div class="col-lg-6 col-md-12 mb-3">
                                                    <label
                                                      for="inputAddress"
                                                      class="form-label"
                                                    >
                                                      Address
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      class={`form-control ${!validation
                                                          .billingAddress
                                                          .addressLine1.isValid
                                                          ? "is-invalid"
                                                          : ""
                                                        }`}
                                                      id="inputAddress"
                                                      placeholder="1234 Main St"
                                                      value={
                                                        formData.billingAddress
                                                          .addressLine1
                                                      }
                                                      name="billingAddress.addressLine1"
                                                      onChange={(e) =>
                                                        handleFieldChange(
                                                          e,
                                                          "billingAddress.addressLine1",
                                                          "addressLine1"
                                                        )
                                                      }
                                                    />
                                                    {!validation.billingAddress
                                                      .addressLine1.isValid && (
                                                        <div className="error-message text-danger">
                                                          {
                                                            validation
                                                              .billingAddress
                                                              .addressLine1
                                                              .message
                                                          }
                                                        </div>
                                                      )}
                                                  </div>

                                                  <div class="col-lg-6 col-md-12 mb-3">
                                                    <label
                                                      for="inputAddress2"
                                                      class="form-label"
                                                    >
                                                      Pincode
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="number"
                                                      class={`form-control ${!validation
                                                          .billingAddress
                                                          .pincode.isValid
                                                          ? "is-invalid"
                                                          : ""
                                                        }`}
                                                      id="Pincode"
                                                      placeholder="Enter Pincode"
                                                      value={
                                                        formData.billingAddress
                                                          .pincode
                                                      }
                                                      onChange={(e) =>
                                                        handleFieldChange(
                                                          e,
                                                          "billingAddress.pincode",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {!validation.billingAddress
                                                      .pincode.isValid && (
                                                        <div className="error-message text-danger">
                                                          {
                                                            validation
                                                              .billingAddress
                                                              .pincode.message
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                  <div className="row">
                                                    <div className="col-lg-6 col-md-12">
                                                      <label
                                                        className="form-label"
                                                        htmlFor="countryDropdownTwo"
                                                      >
                                                        Select a Country:
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                      <select
                                                        id="countryDropdownTwo"
                                                        value={
                                                          formData
                                                            .billingAddress
                                                            .country
                                                        }
                                                        onChange={
                                                          handleCountryChange
                                                        }
                                                        className={`form-select ${!validation
                                                            .billingAddress
                                                            .country
                                                            ? "is-invalid"
                                                            : ""
                                                          }`}
                                                      >
                                                        <option value="billingAddress.country">
                                                          Select a country
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </option>
                                                        {countries?.map(
                                                          (country) => (
                                                            <option
                                                              key={
                                                                country.geonameId
                                                              }
                                                              value={
                                                                country.geonameId
                                                              }
                                                            >
                                                              {
                                                                country.countryName
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                      {validation.billingAddress
                                                        .country === false && (
                                                          <div className="error-message text-danger">
                                                            Please select a
                                                            country
                                                          </div>
                                                        )}
                                                      <br />
                                                    </div>
                                                    <div className="col-lg-6 col-md-12">
                                                      {selectedCountry && (
                                                        <div>
                                                          <label
                                                            className="form-label"
                                                            htmlFor="stateDropdownOne"
                                                          >
                                                            Select a State:
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                          <select
                                                            id="stateDropdownOne"
                                                            value={
                                                              formData
                                                                .billingAddress
                                                                .state
                                                            }
                                                            onChange={
                                                              handleStateChange
                                                            }
                                                            class={`form-select ${!validation
                                                                .billingAddress
                                                                .state
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                          >
                                                            <option value="">
                                                              Select a state
                                                            </option>
                                                            {states.map(
                                                              (state) => (
                                                                <option
                                                                  key={
                                                                    state.geonameId
                                                                  }
                                                                  value={
                                                                    state.geonameId
                                                                  }
                                                                >
                                                                  {state.name}
                                                                </option>
                                                              )
                                                            )}
                                                          </select>
                                                          {validation
                                                            .billingAddress
                                                            .state ===
                                                            false && (
                                                              <div className="error-message text-danger">
                                                                Please select a
                                                                state
                                                              </div>
                                                            )}
                                                          <br />
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="col-lg-6 col-md-12">
                                                      {selectedState && (
                                                        <div>
                                                          <label
                                                            class="form-label"
                                                            htmlFor="cityDropdownOne"
                                                          >
                                                            Select a City:
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                          <select
                                                            id="cityDropdownOne"
                                                            value={
                                                              formData
                                                                .billingAddress
                                                                .city
                                                            }
                                                            onChange={
                                                              handleCityChange
                                                            }
                                                            class={`form-select ${!validation
                                                                .billingAddress
                                                                .city
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                          >
                                                            <option value="">
                                                              Select a city
                                                            </option>
                                                            {cities.map(
                                                              (city) => (
                                                                <option
                                                                  key={
                                                                    city.geonameId
                                                                  }
                                                                  value={
                                                                    city.geonameId
                                                                  }
                                                                >
                                                                  {city.name}
                                                                </option>
                                                              )
                                                            )}
                                                          </select>
                                                          {validation
                                                            .billingAddress
                                                            .city === false && (
                                                              <div className="error-message text-danger">
                                                                Please select a
                                                                country
                                                              </div>
                                                            )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="row mt-3">
                                                <div className="col-md-12">
                                                  <div className="form-check">
                                                    <input
                                                      className="form-check-input"
                                                      type="checkbox"
                                                      id="sameAsBilling"
                                                      checked={
                                                        formData.sameAsBilling
                                                      }
                                                      onChange={
                                                        handleSameAsBillingChange
                                                      }
                                                    />
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="sameAsBilling"
                                                    >
                                                      Shipping Address is Same
                                                      as Billing Address
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              {!formData.sameAsBilling && (
                                                <div className="col-md-12">
                                                  <h2 className="mt-5 mb-3 fs-4">
                                                    Shipping Address
                                                  </h2>
                                                  <div className="row">
                                                    <div class="col-lg-6 col-md-12 mb-3">
                                                      <label
                                                        for="inputAddress"
                                                        class="form-label"
                                                      >
                                                        Address{" "}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        class={`form-control ${!validation
                                                            .shippingAddress
                                                            .addressLine1
                                                            .isValid
                                                            ? "is-invalid"
                                                            : ""
                                                          }`}
                                                        id="inputAddress"
                                                        placeholder="1234 Main St"
                                                        value={
                                                          formData
                                                            .shippingAddress
                                                            .addressLine1
                                                        }
                                                        onChange={(e) =>
                                                          handleFieldChange(
                                                            e,
                                                            "shippingAddress.addressLine1",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                      {!validation
                                                        .shippingAddress
                                                        .addressLine1
                                                        .isValid && (
                                                          <div className="error-message text-danger">
                                                            {
                                                              validation
                                                                .shippingAddress
                                                                .addressLine1
                                                                .message
                                                            }
                                                          </div>
                                                        )}
                                                    </div>

                                                    <div class="col-lg-6 col-md-12 mb-3">
                                                      <label
                                                        for="inputAddress2"
                                                        class="form-label"
                                                      >
                                                        Pincode{" "}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        class={`form-control ${!validation
                                                            .shippingAddress
                                                            .pincode.isValid
                                                            ? "is-invalid"
                                                            : ""
                                                          }`}
                                                        id="Pincode"
                                                        placeholder="Enter Pincode"
                                                        value={
                                                          formData
                                                            .shippingAddress
                                                            .pincode
                                                        }
                                                        onChange={(e) =>
                                                          handleFieldChange(
                                                            e,
                                                            "shippingAddress.pincode",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                      {!validation
                                                        .shippingAddress.pincode
                                                        .isValid && (
                                                          <div className="error-message text-danger">
                                                            {
                                                              validation
                                                                .shippingAddress
                                                                .pincode.message
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-lg-6 col-md-12 mb-3">
                                                        <label
                                                          className="form-label"
                                                          htmlFor="countryDropdownTwo"
                                                        >
                                                          Select a Country:{" "}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                        <select
                                                          id="countryDropdownTwo"
                                                          value={
                                                            formData
                                                              .shippingAddress
                                                              .country
                                                          }
                                                          onChange={
                                                            handleCountryChangeTwo
                                                          }
                                                          className={`form-select ${!validation
                                                              .shippingAddress
                                                              .country
                                                              ? "is-invalid"
                                                              : ""
                                                            }`}
                                                        >
                                                          <option value="">
                                                            Select a country
                                                          </option>
                                                          {billingCountries?.map(
                                                            (country) => (
                                                              <option
                                                                key={
                                                                  country.geonameId
                                                                }
                                                                value={
                                                                  country.geonameId
                                                                }
                                                              >
                                                                {
                                                                  country.countryName
                                                                }
                                                              </option>
                                                            )
                                                          )}
                                                        </select>
                                                        {!validation
                                                          .shippingAddress
                                                          .country && (
                                                            <div className="error-message text-danger">
                                                              Please select a
                                                              country.
                                                            </div>
                                                          )}
                                                        <br />
                                                      </div>
                                                      <div className="col-lg-6 col-md-12 mb-3">
                                                        {selectedBillingCountry && (
                                                          <div>
                                                            <label
                                                              className="form-label"
                                                              htmlFor="stateDropdownTwo"
                                                            >
                                                              Select a State:{" "}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>
                                                            <select
                                                              id="stateDropdownTwo"
                                                              value={
                                                                formData
                                                                  .shippingAddress
                                                                  .state
                                                              }
                                                              onChange={
                                                                handleStateChangeTwo
                                                              }
                                                              class={`form-select ${!validation
                                                                  .shippingAddress
                                                                  .state
                                                                  ? "is-invalid"
                                                                  : ""
                                                                }`}
                                                            >
                                                              <option value="">
                                                                Select a state
                                                              </option>
                                                              {billingstates.map(
                                                                (state) => (
                                                                  <option
                                                                    key={
                                                                      state.geonameId
                                                                    }
                                                                    value={
                                                                      state.geonameId
                                                                    }
                                                                  >
                                                                    {state.name}
                                                                  </option>
                                                                )
                                                              )}
                                                            </select>
                                                            {!validation
                                                              .shippingAddress
                                                              .state && (
                                                                <div className="error-message text-danger">
                                                                  Please select a
                                                                  state.
                                                                </div>
                                                              )}
                                                            <br />
                                                          </div>
                                                        )}
                                                      </div>
                                                      <div className="col-lg-6 col-md-12 mb-3">
                                                        {selectedBillingState && (
                                                          <div>
                                                            <label
                                                              class="form-label"
                                                              htmlFor="cityDropdownTwo"
                                                            >
                                                              Select a City:{" "}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>
                                                            <select
                                                              id="cityDropdownTwo"
                                                              value={
                                                                formData
                                                                  .shippingAddress
                                                                  .city
                                                              }
                                                              onChange={
                                                                handleCityChangeTwo
                                                              }
                                                              class={`form-select ${!validation
                                                                  .shippingAddress
                                                                  .city
                                                                  ? "is-invalid"
                                                                  : ""
                                                                }`}
                                                            >
                                                              <option value="">
                                                                Select a city
                                                              </option>
                                                              {billingcities.map(
                                                                (city) => (
                                                                  <option
                                                                    key={
                                                                      city.geonameId
                                                                    }
                                                                    value={
                                                                      city.geonameId
                                                                    }
                                                                  >
                                                                    {city.name}
                                                                  </option>
                                                                )
                                                              )}
                                                            </select>
                                                            {!validation
                                                              .shippingAddress
                                                              .city && (
                                                                <div className="error-message text-danger">
                                                                  Please select a
                                                                  city.
                                                                </div>
                                                              )}
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            {/* <div className="col-12">
                                            <button
                                              className="btn btn-primary"
                                              onClick={handleFormSubmit}
                                            >
                                              Submit
                                            </button>
                                          </div> */}
                                          </form>
                                        </div>
                                      </div>
                                    </div>{" "}
                                    {/* end row*/}
                                  </div>{" "}
                                  {/* end card*/}
                                </div>{" "}
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary waves-effect me-2"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                className="btn btn-info waves-effect waves-light"
                                onClick={handleFormSubmit}
                              >
                                SaveSubmit
                              </button>
                            </div>
                          </div>
                          {/* /.modal-content */}
                        </div>
                        {/* /.modal-content */}
                      </div>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="card customers">
                  <div className="card-body">
                    <div className="table-responsive table-hover">
                      <Table
                        className="table"
                        pagination={{
                          total: datasource.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                        }}
                        columns={columns}
                        dataSource={datasource.filter(
                          (record) =>
                            record.name
                              .toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            record.phone.includes(searchText) ||
                            record.email
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                        )}
                        rowKey={(record) => record.id}
                      />
                      <EditCustomer
                        visible={editModalVisible}
                        customerId={customerId}
                        onClose={() => setEditModalVisible(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddVendor setShow={setShow} show={show} />

        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete FAQ</h3>
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
                        className="w-100 btn btn-primary paid-cancel-btn"
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
    </>
  );
};
export default Customers;
