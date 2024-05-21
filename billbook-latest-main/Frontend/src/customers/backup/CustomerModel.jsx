// CustomerModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Input, Checkbox, Button } from 'antd';
import axios from 'axios';
import { backendUrl } from '../../backendUrl';

const CustomerModal = ({ visible, onCancel, selectedCustomer, onAddOrUpdate }) => {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    GSTNo: '',
    PANNumber: '',
    billingAddress: {
      addressLine1: '',
      addressLine2: '',
    },
    useshippingAddress: false,
    shippingAddress: {
      addressLine1: '',
      addressLine2: '',
    },
  });

  useEffect(() => {
    // Populate the form fields if editing an existing customer
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
    } else {
      // Reset form fields if adding a new customer
      setCustomer({
        name: '',
        phone: '',
        email: '',
        GSTNo: '',
        PANNumber: '',
        billingAddress: {
          addressLine1: '',
          addressLine2: '',
        },
        useshippingAddress: false,
        shippingAddress: {
          addressLine1: '',
          addressLine2: '',
        },
      });
    }
  }, [selectedCustomer]);

  const handleInputChange = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value, isShipping = false) => {
    setCustomer((prev) => ({
      ...prev,
      [isShipping ? 'shippingAddress' : 'billingAddress']: {
        ...prev[isShipping ? 'shippingAddress' : 'billingAddress'],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    handleInputChange('useshippingAddress', e.target.checked);
  };

  const handleModalSubmit = async () => {
    try {
      // Assuming the API endpoint is http://localhost:8000/api/addCustomer/customers
      const response = await axios.post(`${backendUrl}/api/addCustomer/customers`, { formData: customer });

      // If successfully added or updated, pass the updated customer to the parent component
      onAddOrUpdate(response.data);
    } catch (error) {
      console.error('Error adding/updating customer:', error);
    }
  };

  return (
    <Modal
      title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" className="primary-button" onClick={handleModalSubmit}>
          Submit
        </Button>,
      ]}
    >
      {/* ... (rest of the form fields as in the previous examples) */}
    </Modal>
  );
};

export default CustomerModal;
