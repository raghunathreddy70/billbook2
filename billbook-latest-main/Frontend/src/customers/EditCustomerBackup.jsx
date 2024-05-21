//import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from "react";
//import { Upload } from 'antd';
import CoutryCodes from "../Data/Country.json";
import axios from "axios";
import { message } from "antd";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { img10 } from "../_components/imagepath";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { backendUrl } from "../backendUrl";

const EditCustomer = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [currencyError, setCurrencyError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(false);

  const [formData, setFormData] = useState({
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

  console.log("formdata", formData);

  useEffect(() => {
    const fetchCustomerDetails = async (id) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/addCustomer/getcustomerdetails/${id}`
        );
        if (response.ok) {
          const customerDetails = await response.json();
          setFormData(customerDetails);
        } else {
          console.error("Failed to fetch customer details");
        }
      } catch (error) {
        console.error("Error fetching customer details", error);
      }
    };

    fetchCustomerDetails(id);
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //image validation
    // if (!formData.image) {
    //   setValidation((prevValidation) => ({
    //     ...prevValidation,
    //       image: false,
    //   }));
    //   console.error('Please select a image');
    //   return;
    // }

    //form validation
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

  useEffect(() => {
    console.log(validation);
  }, [validation]);

  const data = CoutryCodes;

  const [countries, setCountries] = useState([]);
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

  useEffect(() => {
    fetch(
      "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.geonames);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      // Fetch a list of states for the selected country from Geonames.org
      fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${selectedCountry}&username=srikanthhirola`
      )
        .then((response) => response.json())
        .then((data) => {
          setStates(data.geonames);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    } else {
      setStates([]);
      setSelectedState("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${selectedState}&username=srikanthhirola`
      )
        .then((response) => response.json())
        .then((data) => {
          setCities(data.geonames);
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedState]);

  useEffect(() => {
    fetch(
      "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola"
    )
      .then((response) => response.json())
      .then((data) => {
        setBillingCountries(data.geonames);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedBillingCountry) {
      fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${selectedBillingCountry}&username=srikanthhirola`
      )
        .then((response) => response.json())
        .then((data) => {
          setBillingStates(data.geonames);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    } else {
      setBillingStates([]);
      setSelectedBillingState("");
    }
  }, [selectedBillingCountry]);

  useEffect(() => {
    if (selectedBillingState) {
      fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${selectedBillingState}&username=srikanthhirola`
      )
        .then((response) => response.json())
        .then((data) => {
          setBillingCities(data.geonames);
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    } else {
      setBillingCities([]);
      setSelectedBillingCity("");
    }
  }, [selectedBillingState]);

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
        // const base64Img = reader.result;
        setFormData({
          ...formData,
          // image: reader.result,
          image: {
            file: file,
            url: reader.result,
          },
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

  // image upload here
  return (
    <div>

      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Edit Customers</h5>
              </div>
            </div>
            <div className="container bg-light">
              <div className="col-md-12 mx-auto">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-body">
                      <div className="form-group-item">
                        <h5 className="form-title">Profile Picture</h5>
                        <div className="profile-picture">
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
                                <span className="text-danger">*</span>
                              </h5>
                              <span>
                                {formData.image ? "Profile-pic.jpg" : ""}
                              </span>
                              {validation.billingAddress.state === false && (
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
                              onClick={() => setFormData({ image: null })}
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
                </div>

                <div className="col-md-12">
                  <form className="row g-3" onSubmit={handleFormSubmit}>
                    <div className="col-md-4">
                      <label htmlFor="inputName4" className="form-label">
                        Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${!validation.name.isValid ? "is-invalid" : ""
                          }`}
                        id="inputName4"
                        placeholder="Enter Item Name"
                        value={formData.name}
                        onChange={(e) => {
                          handleInputChange("name", e.target.value);
                        }}
                      />
                      {!validation.name.isValid && (
                        <div className="error-message text-danger">
                          {validation.name.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${!validation.email.isValid ? "is-invalid" : ""
                          }`}
                        id="inputEmail4"
                        value={formData.email}
                        onChange={(e) => {
                          handleInputChange("email", e.target.value);
                        }}
                      />
                      {!validation.email.isValid && (
                        <div className="error-message text-danger">
                          {validation.email.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="inputPhone" className="form-label">
                        Phone <span className="text-danger ">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${!validation.phone.isValid ? "is-invalid" : ""
                          }`}
                        id="inputPhone"
                        pattern="[0-9]*"
                        value={formData.phone}
                        onChange={(e) => {
                          handleInputChange("phone", e.target.value);
                        }}
                      />
                      {!validation.phone.isValid && (
                        <div className="error-message text-danger">
                          {validation.phone.message}
                        </div>
                      )}
                    </div>
                    <div class="col-md-4">
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
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="inputWebsite" className="form-label">
                        Website <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${!validation.website.isValid ? "is-invalid" : ""
                          }`}
                        id="inputWebsite"
                        value={formData.website}
                        onChange={(e) => {
                          handleInputChange("website", e.target.value);
                        }}
                      />
                      {!validation.website.isValid && (
                        <div className="error-message text-danger">
                          {validation.website.message}
                        </div>
                      )}
                      {websiteError && (
                        <span className="text-danger">{websiteError}</span>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="inputNotes" className="form-label">
                        Notes
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputNotes"
                        value={formData.notes}
                        onChange={(e) => {
                          setFormData({ ...formData, notes: e.target.value });
                        }}
                      />
                      {notesError && (
                        <span className="text-danger">{notesError}</span>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label>Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        // defaultValue="Kanakku"
                        value={formData.companyName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          });
                        }}
                      // placeholder="Enter Company Name"
                      />
                    </div>
                    <div className="col-md-4">
                      <label>GST No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.GSTNo}
                        onChange={(e) => {
                          setFormData({ ...formData, GSTNo: e.target.value });
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

                    <div className="row">
                      <div className="col-md-6">
                        <h2 className="mt-3 mb-3 fs-4">Billing Address</h2>
                        <div className="row">
                          <div class="col-md-12 mb-3">
                            <label for="inputEmail4" class="form-label">
                              Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              class={`form-control ${!validation.billingAddress.name.isValid
                                  ? "is-invalid"
                                  : ""
                                }`}
                              id="inputEmail4"
                              value={formData.billingAddress.name}
                              name="billingAddress.name"
                              onChange={(e) =>
                                handleFieldChange(
                                  e,
                                  "billingAddress.name",
                                  e.target.value
                                )
                              }
                            />
                            {!validation.billingAddress.name.isValid && (
                              <div className="error-message text-danger">
                                {validation.billingAddress.name.message}
                              </div>
                            )}
                          </div>

                          <div class="col-md-12 mb-3">
                            <label for="inputAddress" class="form-label">
                              Address<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              class={`form-control ${!validation.billingAddress.addressLine1.isValid
                                  ? "is-invalid"
                                  : ""
                                }`}
                              id="inputAddress"
                              placeholder="1234 Main St"
                              value={formData.billingAddress.addressLine1}
                              name="billingAddress.addressLine1"
                              onChange={(e) =>
                                handleFieldChange(
                                  e,
                                  "billingAddress.addressLine1",
                                  "addressLine1"
                                )
                              }
                            />
                            {!validation.billingAddress.addressLine1
                              .isValid && (
                                <div className="error-message text-danger">
                                  {validation.billingAddress.addressLine1.message}
                                </div>
                              )}
                          </div>

                          <div class="col-md-6 mb-3">
                            <label for="inputAddress2" class="form-label">
                              Address 2<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              class={`form-control ${!validation.billingAddress.addressLine2.isValid
                                  ? "is-invalid"
                                  : ""
                                }`}
                              id="inputAddress2"
                              placeholder="Apartment, studio, or floor"
                              value={formData.billingAddress.addressLine2}
                              onChange={(e) =>
                                handleFieldChange(
                                  e,
                                  "billingAddress.addressLine2",
                                  "addressLine2"
                                )
                              }
                            />
                            {!validation.billingAddress.addressLine2
                              .isValid && (
                                <div className="error-message text-danger">
                                  {validation.billingAddress.addressLine2.message}
                                </div>
                              )}
                          </div>
                          <div class="col-md-6 mb-3">
                            <label for="inputAddress2" class="form-label">
                              Pincode<span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              class={`form-control ${!validation.billingAddress.pincode.isValid
                                  ? "is-invalid"
                                  : ""
                                }`}
                              id="Pincode"
                              placeholder="Enter Pincode"
                              value={formData.billingAddress.pincode}
                              onChange={(e) =>
                                handleFieldChange(
                                  e,
                                  "billingAddress.pincode",
                                  e.target.value
                                )
                              }
                            />
                            {!validation.billingAddress.pincode.isValid && (
                              <div className="error-message text-danger">
                                {validation.billingAddress.pincode.message}
                              </div>
                            )}
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label
                                className="form-label"
                                htmlFor="countryDropdownTwo"
                              >
                                Select a Country:
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="countryDropdownTwo"
                                value={formData.billingAddress.country}
                                onChange={handleCountryChange}
                                className={`form-select ${!validation.billingAddress.country
                                    ? "is-invalid"
                                    : ""
                                  }`}
                              >
                                <option value="billingAddress.country">
                                  Select a country
                                  <span className="text-danger">*</span>
                                </option>
                                {countries.map((country) => (
                                  <option
                                    key={country.geonameId}
                                    value={country.geonameId}
                                  >
                                    {country.countryName}
                                  </option>
                                ))}
                              </select>
                              {validation.billingAddress.country === false && (
                                <div className="error-message text-danger">
                                  Please select a country
                                </div>
                              )}
                              <br />
                            </div>
                            <div className="col-md-6">
                              {selectedCountry && (
                                <div>
                                  <label
                                    className="form-label"
                                    htmlFor="stateDropdownOne"
                                  >
                                    Select a State:
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    id="stateDropdownOne"
                                    value={formData.billingAddress.state}
                                    onChange={handleStateChange}
                                    class={`form-select ${!validation.billingAddress.state
                                        ? "is-invalid"
                                        : ""
                                      }`}
                                  >
                                    <option value="">Select a state</option>
                                    {states.map((state) => (
                                      <option
                                        key={state.geonameId}
                                        value={state.geonameId}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                  {validation.billingAddress.state ===
                                    false && (
                                      <div className="error-message text-danger">
                                        Please select a state
                                      </div>
                                    )}
                                  <br />
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              {selectedState && (
                                <div>
                                  <label
                                    class="form-label"
                                    htmlFor="cityDropdownOne"
                                  >
                                    Select a City:
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    id="cityDropdownOne"
                                    value={formData.billingAddress.city}
                                    onChange={handleCityChange}
                                    class={`form-select ${!validation.billingAddress.city
                                        ? "is-invalid"
                                        : ""
                                      }`}
                                  >
                                    <option value="">Select a city</option>
                                    {cities.map((city) => (
                                      <option
                                        key={city.geonameId}
                                        value={city.geonameId}
                                      >
                                        {city.name}
                                      </option>
                                    ))}
                                  </select>
                                  {validation.billingAddress.city === false && (
                                    <div className="error-message text-danger">
                                      Please select a country
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
                              checked={formData.sameAsBilling}
                              onChange={handleSameAsBillingChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="sameAsBilling"
                            >
                              Same as Billing Address
                            </label>
                          </div>
                        </div>
                      </div>
                      {!formData.sameAsBilling && (
                        <div className="col-md-6">
                          <h2 className="mt-3 mb-3 fs-4">Shipping Address</h2>
                          <div className="row">
                            <div class="col-md-12 mb-3">
                              <label for="inputEmail4" class="form-label">
                                Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="name"
                                class={`form-control ${!validation.shippingAddress.name.isValid
                                    ? "is-invalid"
                                    : ""
                                  }`}
                                id="inputEmail4"
                                value={formData.shippingAddress.name}
                                onChange={(e) =>
                                  handleFieldChange(
                                    e,
                                    "shippingAddress.name",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.shippingAddress.name.isValid && (
                                <div className="error-message text-danger">
                                  {validation.shippingAddress.name.message}
                                </div>
                              )}
                            </div>

                            <div class="col-md-12 mb-3">
                              <label for="inputAddress" class="form-label">
                                Address <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                class={`form-control ${!validation.shippingAddress.addressLine1
                                    .isValid
                                    ? "is-invalid"
                                    : ""
                                  }`}
                                id="inputAddress"
                                placeholder="1234 Main St"
                                value={formData.shippingAddress.addressLine1}
                                onChange={(e) =>
                                  handleFieldChange(
                                    e,
                                    "shippingAddress.addressLine1",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.shippingAddress.addressLine1
                                .isValid && (
                                  <div className="error-message text-danger">
                                    {
                                      validation.shippingAddress.addressLine1
                                        .message
                                    }
                                  </div>
                                )}
                            </div>

                            <div class="col-md-6 mb-3">
                              <label for="inputAddress2" class="form-label">
                                Address 2 <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                class={`form-control ${!validation.shippingAddress.addressLine2
                                    .isValid
                                    ? "is-invalid"
                                    : ""
                                  }`}
                                id="inputAddress2"
                                placeholder="Apartment, studio, or floor"
                                value={formData.shippingAddress.addressLine2}
                                onChange={(e) =>
                                  handleFieldChange(
                                    e,
                                    "shippingAddress.addressLine2",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.shippingAddress.addressLine2
                                .isValid && (
                                  <div className="error-message text-danger">
                                    {
                                      validation.shippingAddress.addressLine2
                                        .message
                                    }
                                  </div>
                                )}
                            </div>
                            <div class="col-md-6 mb-3">
                              <label for="inputAddress2" class="form-label">
                                Pincode <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                class={`form-control ${!validation.shippingAddress.pincode.isValid
                                    ? "is-invalid"
                                    : ""
                                  }`}
                                id="Pincode"
                                placeholder="Enter Pincode"
                                value={formData.shippingAddress.pincode}
                                onChange={(e) =>
                                  handleFieldChange(
                                    e,
                                    "shippingAddress.pincode",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation.shippingAddress.pincode.isValid && (
                                <div className="error-message text-danger">
                                  {validation.shippingAddress.pincode.message}
                                </div>
                              )}
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label
                                  className="form-label"
                                  htmlFor="countryDropdownTwo"
                                >
                                  Select a Country:{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select
                                  id="countryDropdownTwo"
                                  value={formData.shippingAddress.country}
                                  onChange={handleCountryChangeTwo}
                                  className={`form-select ${!validation.shippingAddress.country
                                      ? "is-invalid"
                                      : ""
                                    }`}
                                >
                                  <option value="">Select a country</option>
                                  {billingCountries.map((country) => (
                                    <option
                                      key={country.geonameId}
                                      value={country.geonameId}
                                    >
                                      {country.countryName}
                                    </option>
                                  ))}
                                </select>
                                {!validation.shippingAddress.country && (
                                  <div className="error-message text-danger">
                                    Please select a country.
                                  </div>
                                )}
                                <br />
                              </div>
                              <div className="col-md-6 mb-3">
                                {selectedBillingCountry && (
                                  <div>
                                    <label
                                      className="form-label"
                                      htmlFor="stateDropdownTwo"
                                    >
                                      Select a State:{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      id="stateDropdownTwo"
                                      value={formData.shippingAddress.state}
                                      onChange={handleStateChangeTwo}
                                      class={`form-select ${!validation.shippingAddress.state
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                    >
                                      <option value="">Select a state</option>
                                      {billingstates.map((state) => (
                                        <option
                                          key={state.geonameId}
                                          value={state.geonameId}
                                        >
                                          {state.name}
                                        </option>
                                      ))}
                                    </select>
                                    {!validation.shippingAddress.state && (
                                      <div className="error-message text-danger">
                                        Please select a state.
                                      </div>
                                    )}
                                    <br />
                                  </div>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                {selectedBillingState && (
                                  <div>
                                    <label
                                      class="form-label"
                                      htmlFor="cityDropdownTwo"
                                    >
                                      Select a City:{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      id="cityDropdownTwo"
                                      value={formData.shippingAddress.city}
                                      onChange={handleCityChangeTwo}
                                      class={`form-select ${!validation.shippingAddress.city
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                    >
                                      <option value="">Select a city</option>
                                      {billingcities.map((city) => (
                                        <option
                                          key={city.geonameId}
                                          value={city.geonameId}
                                        >
                                          {city.name}
                                        </option>
                                      ))}
                                    </select>
                                    {!validation.shippingAddress.city && (
                                      <div className="error-message text-danger">
                                        Please select a city.
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
                    <div className="col-12">
                      <button
                        className="btn btn-primary"
                        onClick={handleFormSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditCustomer;
