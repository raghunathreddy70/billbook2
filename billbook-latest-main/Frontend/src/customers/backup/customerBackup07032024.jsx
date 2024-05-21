import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Checkbox,
  Button,
  Popconfirm,
  message,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import axios from "axios";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from "../Hooks/useHandleDownload";
import { backendUrl } from "../../backendUrl";
const { Option } = Select;

const Customer = () => {
  const history = useHistory()
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    GSTNo: "",
    PANNumber: "",
    billingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
    },
    useShippingAddress: false,
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
    },
  });
  console.log("customers", customers);
  useEffect(() => {
    // Populate the form fields if editing an existing customer
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
    } else {
      // Reset form fields if adding a new customer
      setCustomer({
        name: "",
        phone: "",
        email: "",
        GSTNo: "",
        PANNumber: "",
        billingAddress: {
          addressLine1: "",
          addressLine2: "",
          country: "",
          state: "",
          city: "",
        },
        useshippingAddress: false,
        shippingAddress: {
          addressLine1: "",
          addressLine2: "",
          country: "",
          state: "",
          city: "",
        },
      });
    }
  }, [selectedCustomer]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const handleInputChange = (field, value) => {
  //   if (field === "useShippingAddress" && value) {
  //     setCustomer((prev) => ({
  //       ...prev,
  //       useShippingAddress: value,
  //       shippingAddress: { ...prev.billingAddress }, // Create a deep copy
  //     }));
  //   } else {
  //     setCustomer((prev) => ({
  //       ...prev,
  //       [field]: value,
  //     }));
  //   }
  // };
  const handleInputChange = (fieldName, value) => {
  // Reset errors
  setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));

  // Input validation
  if (typeof value === 'string' && value.trim() === '' && fieldName !== 'useShippingAddress') {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: 'This field is required',
    }));
  } else {
    // Additional validation based on field name
    switch (fieldName) {
      case 'name':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: 'Invalid name number (only Text  allowed)',
          }));
        }
        break;
      case 'phone':
        if (!/^\d+$/.test(value)) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: 'Invalid phone number (only numbers allowed)',
          }));
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: 'Invalid email address',
          }));
        }
        break;
      case 'GSTNo':
        if (!/^[a-zA-Z0-9]{15}$/.test(value)) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: 'Invalid GST number (alphanumeric, 15 characters)',
          }));
        }
        break;
      case 'PANNumber':
        if (!/^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/.test(value)) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: 'Invalid PAN number (5 alphabets, 4 digits, 1 alphabet)',
          }));
        }
        break;
        case 'billingAddress':
        // Handle validation for billingAddress fields
        handleBillingAddressValidation(value);
        break;
      // Add other cases for different fields as needed
      // ...
      default:
        break;
    }
  }

  // Update the customer state
  setCustomer((prevCustomer) => ({
    ...prevCustomer,
    [fieldName]: value,
  }));
};


// const handleBillingAddressValidation = (billingAddress) => {
//   // Validation for addressLine1
//   if (billingAddress.addressLine1.trim() === '') {
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       billingAddress: {
//         ...prevErrors.billingAddress,
//         addressLine1: 'Billing address line 1 is required',
//       },
//     }));
//   } else {
//     // Clear the error for addressLine1 if it's valid
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       billingAddress: {
//         ...prevErrors.billingAddress,
//         addressLine1: '', // Clear the error
//       },
//     }));
//   }

//   // Validation for addressLine2
//   if (!/^\d{6}$/.test(billingAddress.addressLine2)) {
//     // Validation for addressLine2 - 6-digit pin code
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       billingAddress: {
//         ...prevErrors.billingAddress,
//         addressLine2: 'Invalid pin code (exactly 6 digits required)',
//       },
//     }));
//   } else {
//     // Clear the error for addressLine2 if it's valid
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       billingAddress: {
//         ...prevErrors.billingAddress,
//         addressLine2: '', // Clear the error
//       },
//     }));
//   }

//   // Validation for other fields or additional logic if needed
// };
const [countryError, setCountryError] = useState('');
const [stateError, setStateError] = useState('');
const [cityError, setCityError] = useState('');

const handleBillingAddressValidation = (billingAddress) => {
  // Reset billing address errors
  setCountryError('');
  setStateError('');
  setCityError('');
  setFormErrors((prevErrors) => ({
    ...prevErrors,
    billingAddress: {
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
    },
  }));

  // Validation for addressLine1
  if (billingAddress.addressLine1.trim() === '') {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        addressLine1: 'Billing address line 1 is required',
      },
    }));
  } else {
    // Clear the error for addressLine1 if it's valid
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        addressLine1: '', // Clear the error
      },
    }));
  }

  // Validation for addressLine2
  if (!/^\d{6}$/.test(billingAddress.addressLine2)) {
    // Validation for addressLine2 - 6-digit pin code
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        addressLine2: 'Invalid pin code (exactly 6 digits required)',
      },
    }));
  } else {
    // Clear the error for addressLine2 if it's valid
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        addressLine2: '', // Clear the error
      },
    }));
  }

  // Validation for country
  if (!billingAddress.country) {
    setCountryError('Select a country');
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        country: 'Select a country',
      },
    }));
  } else {
   
    // Clear the error for country if it's valid
    setFormErrors((prevErrors) => ({
      
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        country: '', // Clear the error
      },
    }));
  }

  // Validation for state (if country is selected)
  if (billingAddress.country && !billingAddress.state) {
    setStateError('Select a state');
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        state: 'Select a state',
      },
    }));
  } else {
    // Clear the error for state if it's valid
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        state: '', // Clear the error
      },
    }));
  }

  // Validation for city (if state is selected)
  if (billingAddress.state && !billingAddress.city) {
    setCityError('Select a city');
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        city: 'Select a city',
      },
    }));
  } else {
    // Clear the error for city if it's valid
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      billingAddress: {
        ...prevErrors.billingAddress,
        city: '', // Clear the error
      },
    }));
  }
};

  const handleAddressChange = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
      ...(prev.useShippingAddress && {
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }),
    }));
  };

  const fetchCountryName = async (countryId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/countries/${countryId}`
      );
      return response.data.name;
    } catch (error) {
      console.error("Error fetching country name:", error.message);
      return "";
    }
  };

  const fetchStateName = async (stateId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/states/${stateId}`
      );
      return response.data.name;
    } catch (error) {
      console.error("Error fetching state name:", error.message);
      return "";
    }
  };

  const fetchCityName = async (cityId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/cities/${cityId}`
      );
      console.log("City API Response:", response.data); // Log the response for debugging
      return response.data.name; // Adjust based on your actual response format
    } catch (error) {
      console.error("Error fetching city name:", error.message);
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const handleAddCustomer = async () => {
    try {
      const countryName = await fetchCountryName(
        customer.billingAddress.country
      );
      const stateName = await fetchStateName(customer.billingAddress.state);
      const cityName = await fetchCityName(customer.billingAddress.city);
      const shippingCountryName = await fetchCountryName(
        customer.shippingAddress.country
      );
      const shippingStateName = await fetchStateName(
        customer.shippingAddress.state
      );
      const shippingCityName = await fetchCityName(
        customer.shippingAddress.city
      );
      setFormErrors({
      name: '',
      phone: '',
      email: '',
      GSTNo: '',
      PANNumber: '',
      billingAddress:{
        addressLine1:'',
      addressLine2:''
      }
      // ... (add other fields as needed)
    });

    // Validate the input using handleInputChange
    Object.entries(customer).forEach(([fieldName, value]) => {
      handleInputChange(fieldName, value);
    });

    // Check if there are any validation errors
    const hasErrors = Object.values(formErrors).some((error) => !!error);
      const response = await axios.post(
        `${backendUrl}/api/addCustomer/customers`,
        {
          formData: {
            ...customer,
            billingAddress: {
              ...customer.billingAddress,
              country: countryName,
              state: stateName,
              city: cityName, // Include selectedCity if applicable
            },
            shippingAddress: {
              ...customer.shippingAddress,
              country: shippingCountryName,
              state: shippingStateName,
              city: shippingCityName,
            },
          },
        }
      );

      setModalVisible(false); // Close the modal after a successful API call
      history.push('/customers')
      // Update the table with the newly added/updated customer
      setCustomers((prevCustomers) => {
        const updatedCustomers = [...prevCustomers, response.data];
        return updatedCustomers;
      });

      // Reset the form fields and selected values after successful submission
      setCustomer({
        name: "",
        phone: "",
        email: "",
        GSTNo: "",
        PANNumber: "",
        billingAddress: {
          addressLine1: "",
          addressLine2: "",
          country: "",
          state: "",
          city: "",
        },
        shippingAddress: {
          addressLine1: "",
          addressLine2: "",
          country: "",
          state: "",
          city: "",
        },
      });

      // Reset selected country, state, and city
      setSelectedCountry(null);
      setSelectedState(null);
      setCities([]);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };
  const userData = useSelector((state) => state?.user?.userData)
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/addCustomer/customers/${userData?.data?._id}`
      ); // Adjust the endpoint
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleEditSubmit = async () => {

    try {
      setFormErrors({
      name: '',
      phone: '',
      email: '',
      GSTNo: '',
      PANNumber: '',
      billingAddress: {
        addressLine1: '',
        addressLine2: '',
        country: '',
      state: '',
      city: '',
      },
      // ... (add other fields as needed)
    });

    // Validate the input using handleInputChange
    Object.entries(customer).forEach(([fieldName, value]) => {
      handleInputChange(fieldName, value);
    });

    // Check if there are any validation errors
    const hasErrors = Object.values(formErrors).some((error) => !!error);
      // Make a PUT request to update the customer data
      
      const response = await axios.put(
        `${backendUrl}/api/addCustomer/update-customer/${selectedCustomer.customerId}`,
        {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          GSTNo: customer.GSTNo,
          PANNumber: customer.PANNumber,
          billingAddress: {
            addressLine1: customer.billingAddress.addressLine1,
            addressLine2: customer.billingAddress.addressLine2,
            country: customer.billingAddress.country,
            state: customer.billingAddress.state,
            city: customer.billingAddress.city,
          },
          shippingAddress: {
            addressLine1: customer.shippingAddress.addressLine1,
            addressLine2: customer.shippingAddress.addressLine2,
            country: customer.shippingAddress.country,
            state: customer.shippingAddress.state,
            city: customer.shippingAddress.city,
          },
        }
      );

      // Handle success, e.g., close modal and refresh data
      setModalVisible(false);
      fetchData(); // Fetch updated data

      // Reset the form fields and selected values after successful submission
      setCustomer(initialCustomerState);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error updating customer:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    // Fetch customers data from the API endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/addCustomer/customers/${userData?.data?._id}`
        ); // Adjust the endpoint
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to trigger the effect only once on component mount
  // const handleEdit = (customer) => {
  //   setSelectedCustomer(customer);
  //   setModalVisible(true);
  // };
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setCustomer({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      GSTNo: customer.GSTNo,
      PANNumber: customer.PANNumber,
      billingAddress: {
        addressLine1: customer.billingAddress.addressLine1,
        addressLine2: customer.billingAddress.addressLine2,
        country: customer.billingAddress.country,
        state: customer.billingAddress.state,
        city: customer.billingAddress.city,
      },
      shippingAddress: {
        addressLine1: customer.shippingAddress.addressLine1,
        addressLine2: customer.shippingAddress.addressLine2,
        country: customer.shippingAddress.country,
        state: customer.shippingAddress.state,
        city: customer.shippingAddress.city,
      },
    });
    setModalVisible(true);
  };

  // const handleDelete = async (customerId) => {
  //   try {
  //     // Assuming the API endpoint is http://localhost:8000/api/deleteCustomer/:customerId
  //     await axios.delete(
  //          `http://localhost:8000/api/addCustomer/deletecustomers/${customerId}`
  //       // `http://localhost:8000/api/addCustomer/deletecustomers/${customerId}`
  //     );

  //     // Update the table after successful deletion
  //     setCustomers((prevCustomers) =>
  //       prevCustomers.filter((customer) => customer.customerId !== customerId)
  //     );

  //     message.success("Customer deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting customer:", error);
  //     message.error("Failed to delete customer");
  //   }
  // };
  // console.log("deleted Customer",customers)

  const handleDelete = async (customerId) => {
    try {
      console.log("Deleting Customer ID:", customerId);

      await axios.delete(
        `${backendUrl}/api/addCustomer/deletecustomers/${customerId}`
      );

      // Update the table after successful deletion
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.customerId !== customerId)
      );
history.push('/customers')
      message.success("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("Failed to delete customer");
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Title ",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link to={`/customer-details/${record._id}`}>
          <h2 className="table-avatar">{record.name}</h2>
        </Link>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    { title: "GST Number", dataIndex: "GSTNo", key: "GSTNo" },
    { title: "PAN Number", dataIndex: "PANNumber", key: "PANNumber" },
    // {
    //   title: "Billing Address",
    //   dataIndex: "billingAddress.country",
    //   key: "billingAddress.country",
    // },
    // {
    //   title: "Shipping Address",
    //   dataIndex: "shippingAddress",
    //   key: "shippingAddress",
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <span className="d-flex">
          <Link
            to="#"
            className="btn waves-light"
            onClick={() => handleEdit(record)}
          >
            <div className="bg-[#e1ffed] p-1 rounded">
              <FeatherIcon icon="edit" className="text-[#1edd6a] " />
            </div>
          </Link>
          <Link
            to={`/customer-details/${record._id}`}
            className="btn waves-light"
            
          >
            <div className="bg-[#e1ffed] p-1 rounded">
              <FeatherIcon icon="eye" className="text-[#1edd6a] " />
            </div>
          </Link>
          <Link
            to="#"
            className="btn waves-light"

          >
            <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            {/* <Button type="danger" className="btn btn-secondary waves-effect" style={{ marginLeft: "8px" }}>
              Delete
            </Button> */}
            <div className=" bg-[#ffeded] p-1 rounded">
              <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
            </div>
          </Popconfirm>
          </Link>
          {/* <div className="bg-[#e1ffed] p-1 rounded">
            <Link className="" to={`/customer-details/${record._id}`}>
              <FeatherIcon icon="eye" className="text-[#1edd6a] " />
            </Link>
          </div>
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record.customerId)}
            okText="Yes"
            cancelText="No"
          >
            {/* <Button type="danger" className="btn btn-secondary waves-effect" style={{ marginLeft: "8px" }}>
              Delete
            </Button> *
            <div className=" bg-[#ffeded] p-1 rounded">
              <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
            </div>
          </Popconfirm> */}
        </span>
      ),
    },
  ];

  const initialCustomerState = {
    name: "",
    phone: "",
    email: "",
    GSTNo: "",
    PANNumber: "",
    billingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
    },
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
    },
  };

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  // Add new state variables for selectedCountry and selectedState

  useEffect(() => {
    // Fetch countries on component mount
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/countries`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

  const fetchStatesByCountry = async (countryId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/countries/${countryId}`
      );
      const statesData = response.data.states;

      // Fetch details for each state
      // const statePromises = statesData.map(async (state) => {
      //   const stateResponse = await axios.get(
      //     `http://localhost:8000/api/states/${state}`
      //   );
      //   return stateResponse.data;
      // });
      const statePromises = statesData.map(async (state) => {
        try {
          const stateResponse = await axios.get(
            `${backendUrl}/api/states/${state}`
          );
          return stateResponse.data;
        } catch (error) {
          console.error(`Error fetching state ${state}:`, error.message);
          // Handle the error as needed, e.g., set an empty object for this state
          return {};
        }
      });
      // Wait for all state details to be fetched
      const statesDetails = await Promise.all(statePromises);

      console.log("States Details:", statesDetails);

      // Set states details in your component state
      setStates(statesDetails);
    } catch (error) {
      console.error("Error fetching states:", error.message);
    }
  };

  const fetchCitiesByState = async (stateId) => {
    try {
      // Check if 'stateId' is in a valid ObjectId format
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(stateId);

      if (!isValidObjectId) {
        console.error("Invalid state ID:", stateId);
        // Handle non-ObjectId state values here (e.g., return an empty array)
        setCities([]);
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/cities?state=${stateId}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error.message);
      // Handle the error as needed
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value); // Set selectedCountry state if needed
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      billingAddress: {
        ...prevCustomer.billingAddress,
        country: value, // Update customer state with the selected country
      },
    }));
    // Fetch states based on selected country
    fetchStatesByCountry(value);
    // Reset selected state and cities
    setSelectedState(null);
    setCities([]);
  };

  const handleStateChange = (value) => {
    setSelectedState(value); // Set selectedState state if needed
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      billingAddress: {
        ...prevCustomer.billingAddress,
        state: value, // Update customer state with the selected state
      },
    }));
    // Fetch cities based on selected state
    fetchCitiesByState(value);
    // Reset selected city
    setSelectedCity(null);
  };
  const handleCityChange = (value) => {
    setSelectedCity(value); // Set selectedCity state if needed
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      billingAddress: {
        ...prevCustomer.billingAddress,
        city: value, // Update customer state with the selected city
      },
    }));
  };

  // country selection code for shipping address
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const [selectedShippingCountry, setSelectedShippingCountry] = useState(null);
  const [selectedShippingState, setSelectedShippingState] = useState(null);
  const [selectedShippingCity, setSelectedShippingCity] = useState(null);
  const [shippingCountries, setShippingCountries] = useState([]);

  // Add new state variables for selectedCountry and selectedState

  useEffect(() => {
    // Fetch countries on component mount
    fetchShippingCountries();
  }, []);

  const fetchShippingCountries = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/countries`);
      setShippingCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

  const fetchShippingStatesByCountry = async (countryId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/countries/${countryId}`
      );
      const statesData = response.data.states;

      const statePromises = statesData.map(async (state) => {
        try {
          const stateResponse = await axios.get(
            `${backendUrl}/api/states/${state}`
          );
          return stateResponse.data;
        } catch (error) {
          console.error(`Error fetching state ${state}:`, error.message);
          return {};
        }
      });

      const statesDetails = await Promise.all(statePromises);
      setShippingStates(statesDetails);
    } catch (error) {
      console.error("Error fetching states:", error.message);
    }
  };

  const fetchShippingCitiesByState = async (stateId) => {
    try {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(stateId);

      if (!isValidObjectId) {
        console.error("Invalid state ID:", stateId);
        setShippingCities([]);
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/cities?state=${stateId}`
      );
      setShippingCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error.message);
    }
  };
  const handleShippingCountryChange = (value) => {
    setSelectedShippingCountry(value);
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      shippingAddress: {
        ...prevCustomer.shippingAddress,
        country: value,
      },
    }));
    fetchShippingStatesByCountry(value);
    setSelectedShippingState(null);
    setShippingCities([]);
  };

  const handleShippingStateChange = (value) => {
    setSelectedShippingState(value);
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      shippingAddress: {
        ...prevCustomer.shippingAddress,
        state: value,
      },
    }));
    fetchShippingCitiesByState(value);
    setSelectedShippingCity(null);
  };

  const handleShippingCityChange = (value) => {
    setSelectedShippingCity(value);
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      shippingAddress: {
        ...prevCustomer.shippingAddress,
        city: value,
      },
    }));
  };
  // country selection code for shipping address

  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    // When navigating away from the table page, store the state
    const handleBeforeUnload = () => {
      localStorage.setItem(
        "tableState",
        JSON.stringify({ page: currentPage, selectedRow })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentPage, selectedRow]);

  useEffect(() => {
    // When returning to the table page, retrieve the stored state
    const storedState = localStorage.getItem("tableState");

    if (storedState) {
      const { page, selectedRow: storedSelectedRow } = JSON.parse(storedState);

      setCurrentPage(page);

      // Highlight or scroll to the selected row
      setSelectedRow(storedSelectedRow);
    }
  }, []);

  const navigateToAnotherPage = (record) => {
    // Store the selected row
    setSelectedRow(record.id);

    // Navigate to another page
    history.push(`{/customer-details/${record._id}}`);
  };
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleReset = () => {
    setSearchText("");
  };
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [downloadData, setDownloadData] = useState([]);
  useEffect(() => {
    let downloadableData = customers;
    setDownloadData(downloadableData);
  }, [customers]);
  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    const csvData = downloadData.map((item) => ({
      "No.": item.id,
      Name: item.name,
      Phone: item?.phone,
      "Email ": item?.email,
      "PanNumber ": item?.PANNumber,
      "GstNO ": item?.GSTNo,
      "Country ": item?.billingAddress.country,
    }));
    // Define CSV headers
    const headers = [
      { label: "No.", key: "id" },
      { label: "Name", key: "name" },
      { label: "Phone", key: "phone" },
      { label: "Email", key: "email" },
      { label: "PanNumber", key: "PanNumber" },
      { label: "GstNO", key: "GstNO" },
      { label: "Country", key: "Country" },
    ];
    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here
  // download data in pdf format code goes here
  const handlePDFDownloadSet = () => {
    const columns = [
      "No.",
      "Name",
      "Phone",
      "Email",
      "PanNumber",
      "GstNo",
      "Country",
    ];

    const rows = downloadData.map((item) => [
      item.id,
      item?.name,
      item?.phone,
      item.email,
      item.PANNumber,
      item.GSTNo,
      item.billingAddress.country,
    ]);
    handlePDFDownload({ columns, rows, heading: "Vendors" });
  };
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
    GSTNo: '',
    PANNumber: '',
  billingAddress:{
    addressLine1:'',
    addressLine2:'',
    country: '',
      state: '',
      city: '',
  }
    // ... (add other fields as needed)
  });
  return (
    <>
      <div>
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          <Header onMenuClick={(value) => toggleMobileMenu()} />
          <Sidebar active={2} />

          <div className="page-wrapper px-5 ">
            {/* Page Header */}
            <div className="page-header pt-3">
              <div className="content-page-header ">
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
                    <li className="">
                      <div className="dropdown dropdown-action">
                        <Tooltip title='Download' placement="top">
                        <Link
                          to="#"
                          className="btn-filters me-2 btn btn-primary"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            <FeatherIcon icon="download" />
                          </span>
                        </Link> 
                        </Tooltip>
                        <div className="dropdown-menu dropdown-menu-end">
                          <ul className="d-block">
                            <li>
                              <Link
                                className="d-flex align-items-center download-item"
                                to="#"
                                download=""
                                onClick={handlePDFDownloadSet}
                              >
                                <i className="far fa-file-pdf me-2" />
                                PDF
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="d-flex align-items-center download-item"
                                to="#"
                                download=""
                                onClick={handleCSVDownloadSet}
                              >
                                <i className="far fa-file-text me-2" />
                                CSV
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    {/* <CSVLink {...csvContent} id="csv-link" style={{ display: 'none' }}>
        Download CSV
      </CSVLink> */}
                    <li>
                      {/* <button
                        type="primary"
                        className="btn btn-primary my-2"
                        onClick={() => setModalVisible(true)}
                      >
                        Add Customer
                      </button> */}
                      <Tooltip title="Add Customer" placement="top">
                     <Link
                        className="btn btn-primary"
                        to="#"
                        onClick={() => setModalVisible(true)}
                      >
                        <i className="fa fa-plus-circle " aria-hidden="true" />
                      </Link>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Search Filter */}

            {/* <Table
                        pagination={{
                          total: customers ? customers.length : 0,

                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}

                        dataSource={customers}
                        rowKey={(record) => record.id}

                      /> */}
            <Table
              pagination={{
                total: customers ? customers.length : 0,
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                showSizeChanger: true,
                onShowSizeChange: onShowSizeChange,
                itemRender: itemRender,
              }}
              // dataSource={customers}
              dataSource={customers.filter(
                (record) =>
                  record?.name
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  (record?.phone &&
                    record.phone.toString().includes(searchText))
              )}
              columns={columns}
           
              rowKey={(record) => record.id}
            />
            
                                
            <Modal
              title={selectedCustomer ? "Edit Customer" : "Add Customer"}
              visible={modalVisible}
              width={800}
              onCancel={() => {
                setModalVisible(false);
                setCustomer(initialCustomerState); // Reset form fields on modal close
              }}
              footer={[
                <Button
                  key="cancel"
                  className="btn btn-secondary waves-effect"
                  onClick={() => setModalVisible(false)}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  className="btn btn-info waves-effect waves-light"
                  onClick={
                    selectedCustomer ? handleEditSubmit : handleAddCustomer
                  }
                >
                  {selectedCustomer ? "Edit" : "Add"}
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-md-6 my-3">
                  <label htmlFor="customerName" className="form-label">
                    Customer Nameduiiki
                  </label>
                  <Input
                    placeholder="Customer Name"
                    value={customer.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                   {formErrors.name && (
            <span className="text-danger">{formErrors.name}</span>
          )}
                </div>
                <div className="col-md-6 my-3">
                  <label htmlFor="customerName" className="form-label">
                    Phone
                  </label>
                  <Input
                    placeholder="Phone"
                    value={customer.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                    {formErrors.phone && (
            <span className="text-danger">{formErrors.phone}</span>
          )}
                </div>
                <div className="col-md-6 my-3">
                  <label htmlFor="customerName" className="form-label">
                    Email
                  </label>
                  <Input
                    placeholder="Email"
                    value={customer.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {formErrors.email && (
            <span className="text-danger">{formErrors.email}</span>
          )}
                </div>
                <div className="col-md-6 my-3">
                  <label htmlFor="customerName" className="form-label">
                    GST NO
                  </label>
                  <Input
                    placeholder="GST Number"
                    value={customer.GSTNo}
                    maxLength={15}
                    onChange={(e) => handleInputChange("GSTNo", e.target.value)}
                  />
                  
                  {formErrors.GSTNo && (
            <span className="text-danger">{formErrors.GSTNo}</span>
          )}
                </div>
                <div className="col-md-6 my-3">
                  <label htmlFor="customerName" className="form-label">
                    Pan Number
                  </label>
                  <Input
                    placeholder="PAN Number"
                    value={customer.PANNumber}
                    maxLength={10}
                    onChange={(e) =>
                      handleInputChange("PANNumber", e.target.value)
                    }
                  />
                  {formErrors.PANNumber && (
            <span className="text-danger">{formErrors.PANNumber}</span>
          )}
                </div>

                <div className="col-md-6 my-3">
                  <label htmlFor="customerName" className="form-label">
                    Address Line
                  </label>
                  <Input
                    placeholder="Billing Address"
                    value={customer.billingAddress.addressLine1}
                    onChange={(e) =>
                      handleAddressChange("addressLine1", e.target.value)
                    }
                  />
                 {formErrors.billingAddress && formErrors.billingAddress.addressLine1 && (
            <span className="text-danger">{formErrors.billingAddress.addressLine1}</span>
          )}
                </div>
                <div className="col-md-6 mt-3">
                  <label htmlFor="Country" className="form-label">
                    Select Country
                  </label>
                  <br />
                  <Select
                    placeholder="Select Country"
                    onChange={handleCountryChange}
                    value={customer.billingAddress.country}
                    style={{ width: 200, marginBottom: 16 }}
                  >
                    {countries.map((country) => (
                      <Option key={country._id} value={country._id}>
                        {country.name}
                      </Option>
                    ))}
                  </Select>
                  {countryError && <div className="error-message">{countryError}</div>}
                </div>
                {selectedCountry && (
                  <div className="col-md-6 mt-3">
                    <label htmlFor="State" className="form-label">
                      Select State
                    </label>
                    <br />
                    <Select
                      placeholder="Select State"
                      value={customer.billingAddress.state}
                      onChange={handleStateChange}
                      style={{ width: 200, marginBottom: 16 }}
                    >
                      {states.map((state) => (
                        <Option key={state._id} value={state._id}>
                          {state.name}
                        </Option>
                      ))}
                    </Select>
                    {stateError && <div className="error-message">{setStateError}</div>}
                  </div>
                )}
                {selectedState && (
                  <div className="col-md-6 my-0">
                    <label htmlFor="City" className="form-label">
                      Select City
                    </label>
                    <br />
                    <Select
                      placeholder="Select City"
                      onChange={handleCityChange}
                      style={{ width: 200, marginBottom: 16 }}
                      value={customer.billingAddress.city}
                    >
                      {cities.map((city) => (
                        <Option key={city._id} value={city._id}>
                          {city.name}
                        </Option>
                      ))}
                    </Select>
                    {cityError && <div className="error-message">{cityError}</div>}
                  </div>
                )}
                <div className="col-md-6 my-3">
                  <label htmlFor="Pincode" className="form-label">
                    Pincode
                  </label>
                  <Input
                    placeholder="Pincode"
                    value={customer.billingAddress.addressLine2}
                    onChange={(e) =>
                      handleAddressChange("addressLine2", e.target.value)
                    }
                    maxLength={6}
                  />
                  {formErrors.billingAddress && formErrors.billingAddress.addressLine2 && (
            <span className="text-danger">{formErrors.billingAddress.addressLine2}</span>
          )}
                </div>
              </div>

              <Checkbox
                checked={customer.useShippingAddress}
                onChange={(e) =>
                  handleInputChange("useShippingAddress", e.target.checked)
                }
              >
                Use shipping address
              </Checkbox>
              {!customer.useShippingAddress && (
                <>
                  <div className="row">
                    <div className="col-md-6 my-3">
                      <label htmlFor="ShippingAddress" className="form-label">
                        Address
                      </label>
                      <Input
                        placeholder="Shipping Address"
                        value={customer?.shippingAddress?.addressLine1}
                        onChange={(e) =>
                          handleAddressChange("addressLine1", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 my-3">
                      <label htmlFor="Pincode" className="form-label">
                        Pincode
                      </label>
                      <Input
                        placeholder="Shipping addressLine2"
                        value={customer?.shippingAddress?.addressLine2}
                        onChange={(e) =>
                          handleAddressChange("addressLine2", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 my-3">
                      <label htmlFor="Country" className="form-label">
                        Select Country
                      </label>
                      <br />
                      <Select
                        placeholder="Select Country"
                        onChange={handleShippingCountryChange}
                        value={customer?.shippingAddress?.country}
                        style={{ width: 200, marginBottom: 16 }}
                      >
                        {shippingCountries.map((country) => (
                          <Option key={country._id} value={country._id}>
                            {country.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    {selectedShippingCountry && (
                      <div className="col-md-6 mt-3">
                        <label htmlFor="state" className="form-label">
                          Select State
                        </label>
                        <br />
                        <Select
                          placeholder="Select State"
                          value={customer?.shippingAddress?.state}
                          onChange={handleShippingStateChange}
                          style={{ width: 200, marginBottom: 16 }}
                        >
                          {shippingStates.map((state) => (
                            <Option key={state._id} value={state._id}>
                              {state.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                    {selectedShippingState && (
                      <div className="col-md-6 my-0">
                        <label htmlFor="city" className="form-label">
                          Select City
                        </label>
                        <br />
                        <Select
                          placeholder="Select City"
                          onChange={handleShippingCityChange}
                          style={{ width: 200, marginBottom: 16 }}
                          value={customer?.shippingAddress?.city}
                        >
                          {shippingCities.map((city) => (
                            <Option key={city._id} value={city._id}>
                              {city.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customer;
