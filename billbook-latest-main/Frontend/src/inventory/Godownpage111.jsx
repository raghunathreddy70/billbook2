import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import Data from "../assets/jsons/inventory";
import "../_components/antd.css";
import {
    onShowSizeChange,
    itemRender,
} from "../_components/paginationfunction";
import Select2 from "react-select2-wrapper";
import DatePicker from "react-datepicker";
import { Table } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const GodownList = () => {
    const [formData, setFormData] = useState({
        date: new Date(),
        godownName: "",
        godownStreetAddress: "",
        placeofsupply: "",
        godownPincode: "",
        godownCity: "",
    });

    console.log("formData", formData);

    const [validation, setValidation] = useState({
        godownName: { isValid: true, message: "" },
        godownStreetAddress: { isValid: true, message: "" },
        placeofsupply: { isValid: true, message: "" },
        godownPincode: { isValid: true, message: "" },
        godownCity: { isValid: true, message: "" },
    });



    const [States, setStates] = useState([
        { id: "Andhra Pradesh", text: "Andhra Pradesh" },
        { id: "Arunachal Pradesh", text: "Arunachal Pradesh" },
        { id: "Assam", text: "Assam" },
        { id: "Bihar", text: "Bihar" },
        { id: "Chhattisgarh", text: "Chhattisgarh" },
        { id: "Goa", text: "Goa" },
        { id: "Gujarat", text: "Gujarat" },
        { id: "Haryana", text: "Haryana" },
        { id: "Himachal Pradesh", text: "Himachal Pradesh" },
        { id: "Jharkhand", text: "Jharkhand" },
        { id: "Karnataka", text: "Karnataka" },
        { id: "Kerala", text: "Kerala" },
        { id: "Madhya Pradesh", text: "Madhya Pradesh" },
        { id: "Maharashtra", text: "Maharashtra" },
        { id: "Manipur", text: "Manipur" },
        { id: "Meghalaya", text: "Meghalaya" },
        { id: "Mizoram", text: "Mizoram" },
        { id: "Nagaland", text: "Nagaland" },
        { id: "Odisha", text: "Odisha" },
        { id: "Punjab", text: "Punjab" },
        { id: "Rajasthan", text: "Rajasthan" },
        { id: "Sikkim", text: "Sikkim" },
        { id: "Tamil Nadu", text: "Tamil Nadu" },
        { id: "Telangana", text: "Telangana" },
        { id: "Tripura", text: "Tripura" },
        { id: "Uttar Pradesh", text: "Uttar Pradesh" },
        { id: "Uttarakhand", text: "Uttarakhand" },
        { id: "West Bengal", text: "West Bengal" },
    ]);

    const [menu, setMenu] = useState(false);
    const [show, setShow] = useState(false);

    const toggleMobileMenu = () => {
        setMenu(!menu);
    };

    const columns = [
        {
            title: "Item name",
            dataIndex: "itemName",
        },
        {
            title: "Item code",
            dataIndex: "itemCode",
        },

        {
            title: "Stock Qty",
            dataIndex: "openingStock",
        },
        {
            title: "Stock Value",
            dataIndex: "stockValue",
        },
        {
            title: "Selling Price",
            dataIndex: "salesPrice",
        },
        {
            title: "Purchase Price",
            dataIndex: "purchasePrice",
        },
    ];


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const changeInputForm = (fieldName, value) => {
        const nameRegex = /^[a-zA-Z0-9\s'-]+$/;
        const addressRegex = /^[a-zA-Z0-9\s,'.#-]+$/;
        const cityRegex = /^[a-zA-Z\s'-]+$/;
        const pincodeRegex = /^\d{6}$/;
        let isValid = true;
        let message = "";
        if (fieldName === "godownName") {
            isValid = nameRegex.test(value);
            message = "Invalid godown name";
        }
        if (fieldName === "godownStreetAddress") {
            isValid = addressRegex.test(value);
            message = "Invalid godown Streetaddress";
        }
        if (fieldName === "placeofsupply") {
            isValid = value;
            message = "Invalid godown Streetaddress";
        }
        if (fieldName === "godownPincode") {
            isValid = pincodeRegex.test(value);
            message = "Invalid godown pincode";
        }
        if (fieldName === "godownCity") {
            isValid = cityRegex.test(value);
            message = "Invalid godown city";
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

    const validateFormData = (formData) => {
        const validationErrors = {};
        if (!formData.godownName) {
            validationErrors.godownName = {
                isValid: false,
                message: "please enter valid godown name",
            };
        }
        if (!formData.godownStreetAddress) {
            validationErrors.godownStreetAddress = {
                isValid: false,
                message: "please enter correct godown street adress",
            };
        }
        if (!formData.placeofsupply) {
            validationErrors.placeofsupply = {
                isValid: false,
                message: "please select a power supply",
            };
        }
        if (!formData.godownPincode) {
            validationErrors.godownPincode = {
                isValid: false,
                message: "please select a godownPincode",
            };
        }
        if (!formData.godownCity) {
            validationErrors.godownCity = {
                isValid: false,
                message: "please select a godown City",
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
        try {
            const response = await axios.post(
                "http://localhost:8000/api/godown/addgodown",
                { formData }
            );

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Godown added successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                window.location.reload();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to add Godown. Please try again.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "An error occurred while adding the Godown.",
            });

            console.error("Error:", error);
        }
    };

    const handleDateChange = (fieldName, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: date,
        }));
    };
    const isTransferEnabled = selectedRowKeys.length > 0;

    // godown list part or fetching part

    const [GodownList, setGodownList] = useState([]);
    const [selectedGodown, setSelectedGodown] = useState("");

    console.log("GodownList", GodownList);

    const fetchGodownData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/godown/godownlist"
            );
            setGodownList(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchGodownData();
    }, []);

    const GodownOptions = GodownList.map((godown) => ({
        id: godown.godownId,
        text: godown.godownName,
    }));

    const handleSelectGodown = (value) => {
        setSelectedGodown(value);
    };

    // selectedgodown codes

    const [selectedGodownData, setSelectedGodownData] = useState(null);
    const [selectedformData, setSelectedFormData] = useState({
        godownName: "",
        godownStreetAddress: "",
        placeofsupply: "",
        godownPincode: "",
        godownCity: "",
    });

    useEffect(() => {
        if (selectedGodown) {
            const fetchSelectedGodownData = async (selectedgodown) => {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/api/godown/godownbyid/${selectedgodown}`
                    );
                    setSelectedGodownData(response.data);
                    const data = response.data[0]; // Assuming selectedGodownData is an array with a single object
                    setSelectedFormData({
                        godownName: data.godownName,
                        godownStreetAddress: data.godownStreetAddress,
                        placeofsupply: data.placeofsupply,
                        godownPincode: data.godownPincode,
                        godownCity: data.godownCity,
                    });
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchSelectedGodownData(selectedGodown);
        }
    }, [selectedGodown]);

    const [godownproduct, setGodownproduct] = useState([]);

    useEffect(() => {
        if (selectedGodown) {
            const fetchSelectedGodownproductData = async (selectedgodown) => {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/api/godown/productsbygodown/${selectedgodown}`
                    );
                    setGodownproduct(response.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchSelectedGodownproductData(selectedGodown);
        }
    }, [selectedGodown]);

    console.log("godownproduct", godownproduct);
    // godown edit part codes starts here

    const [selectedvalidation, setSelectedValidation] = useState({
        godownName: { isValid: true, message: "" },
        godownStreetAddress: { isValid: true, message: "" },
        placeofsupply: { isValid: true, message: "" },
        godownPincode: { isValid: true, message: "" },
        godownCity: { isValid: true, message: "" },
    });

    const changeSelectedInputForm = (fieldName, value) => {
        const nameRegex = /^[a-zA-Z0-9\s'-]+$/;
        const addressRegex = /^[a-zA-Z0-9\s,'.#-]+$/;
        const cityRegex = /^[a-zA-Z\s'-]+$/;
        const pincodeRegex = /^\d{6}$/;
        let isValid = true;
        let message = "";
        if (fieldName === "godownName") {
            isValid = nameRegex.test(value);
            message = "Invalid godown name";
        }
        if (fieldName === "godownStreetAddress") {
            isValid = addressRegex.test(value);
            message = "Invalid godown Streetaddress";
        }
        if (fieldName === "placeofsupply") {
            isValid = value;
            message = "Invalid godown Streetaddress";
        }
        if (fieldName === "godownPincode") {
            isValid = pincodeRegex.test(value);
            message = "Invalid godown pincode";
        }
        if (fieldName === "godownCity") {
            isValid = cityRegex.test(value);
            message = "Invalid godown city";
        }
        setSelectedFormData({
            ...selectedformData,
            [fieldName]: value,
        });

        setSelectedValidation({
            ...selectedvalidation,
            [fieldName]: { isValid, message },
        });
    };

    const validateSelectedFormData = (selectedformData) => {
        const validationErrors = {};
        if (!selectedformData.godownName) {
            validationErrors.godownName = {
                isValid: false,
                message: "please enter valid godown name",
            };
        }
        if (!selectedformData.godownStreetAddress) {
            validationErrors.godownStreetAddress = {
                isValid: false,
                message: "please enter correct godown street adress",
            };
        }
        if (!selectedformData.placeofsupply) {
            validationErrors.placeofsupply = {
                isValid: false,
                message: "please select a power supply",
            };
        }
        if (!selectedformData.godownPincode) {
            validationErrors.godownPincode = {
                isValid: false,
                message: "please select a godownPincode",
            };
        }
        if (!selectedformData.godownCity) {
            validationErrors.godownCity = {
                isValid: false,
                message: "please select a godown City",
            };
        }
        return validationErrors;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const validationErrors = validateSelectedFormData(selectedformData);
        if (Object.keys(validationErrors).length > 0) {
            setSelectedValidation((prevValidation) => ({
                ...prevValidation,
                ...validationErrors,
            }));
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/api/godown/updategodown/${selectedGodown}`,
                { selectedformData }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Godown Updated successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                window.location.reload();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Update Godown. Please try again.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "An error occurred while Updating the Godown.",
            });

            console.error("Error:", error);
        }
    };

    // delete godown code starts here
    const handledeletegodown = async (e) => {
        e.preventDefault();

        // Show confirmation dialog
        const confirmed = await Swal.fire({
            icon: "warning",
            title: "Are you sure you want to delete this godown?",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await axios.delete(
                    `http://localhost:8000/api/godown/deletegodown/${selectedGodown}`
                );

                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Godown deleted successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    window.location.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to Delete Godown. Please try again.",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "An error occurred while deleting the Godown.",
                });

                console.error("Error:", error);
            }
        }
    };

    return (
        <>
            <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
                <Header onMenuClick={(value) => toggleMobileMenu()} />
                <Sidebar active={7} />

                <div className="page-wrapper">
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <h3 className="py-3">Godown Management</h3>
                            <div className="content-page-header ">
                                <div className="form-group  godown-dropdown-select">
                                    <Select2
                                        className="w-100"
                                        data={GodownOptions}
                                        value={selectedGodown}
                                        options={{ placeholder: "Choose godown" }}
                                        onChange={(e) => handleSelectGodown(e.target.value)}
                                    />
                                </div>
                                <div className="list-btn">
                                    <ul className="filter-list">
                                        <div className="button-list me-2">
                                            <button
                                                type="button"
                                                className={`btn  waves-effect waves-light  me-1 transfer-button ${isTransferEnabled ? "enabled" : ""
                                                    }`}
                                                data-bs-toggle="modal"
                                                data-bs-target="#stock-transfer-modal"
                                                disabled={!isTransferEnabled}
                                            >
                                                Transfer Stock
                                            </button>
                                        </div>
                                        <div className="button-list me-2 ">
                                            {/* Responsive modal */}
                                            <button
                                                type="button"
                                                className="btn btn-primary waves-effect waves-light mt-1 me-1"
                                                data-bs-toggle="modal"
                                                data-bs-target="#con-close-modal"
                                            >
                                                Create Godown
                                            </button>
                                        </div>
                                        <div
                                            id="con-close-modal"
                                            className="modal fade"
                                            tabIndex={-1}
                                            role="dialog"
                                            aria-hidden="true"
                                            style={{ display: "none" }}
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Add Godown</h4>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="modal-body p-4">
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>
                                                                        Godown Name{" "}
                                                                        <span className="accountprofilesettings-start-mark">
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${!validation.godownName.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        id="field-1"
                                                                        placeholder="Ex. Main FCD Godown"
                                                                        value={formData.godownName}
                                                                        onChange={(e) =>
                                                                            changeInputForm(
                                                                                "godownName",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    {!validation.godownName.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {validation.godownName.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>Street Address</label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${!validation.godownStreetAddress.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        id="field-2"
                                                                        value={formData.godownStreetAddress}
                                                                        placeholder="Enter Street Address"
                                                                        onChange={(e) =>
                                                                            changeInputForm(
                                                                                "godownStreetAddress",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    {!validation.godownStreetAddress.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {validation.godownStreetAddress.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="form-group">
                                                                    <label>Place of Supply</label>
                                                                    <Select2
                                                                        data={States}
                                                                        onChange={(e) =>
                                                                            changeInputForm(
                                                                                "placeofsupply",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className={`form-select w-100 is-invalid`}
                                                                        options={{
                                                                            placeholder: "Enter state",
                                                                        }}
                                                                        value={formData.placeofsupply}
                                                                    />
                                                                    {!validation.placeofsupply.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {validation.placeofsupply.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="form-group">
                                                                    <label>Pincode</label>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) =>
                                                                            changeInputForm(
                                                                                "godownPincode",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        value={formData.godownPincode}
                                                                        className={`form-control ${!validation.godownPincode.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        placeholder="Ex.560038"
                                                                    />
                                                                    {!validation.godownPincode.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {validation.godownPincode.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>City</label>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) =>
                                                                            changeInputForm(
                                                                                "godownCity",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        value={formData.godownCity}
                                                                        className={`form-control ${!validation.godownCity.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        id="field-4"
                                                                        placeholder="Boston"
                                                                    />
                                                                    {!validation.godownCity.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {validation.godownCity.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
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
                                                            onClick={handleSubmit}
                                                        >
                                                            Save changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            id="stock-transfer-modal"
                                            className="modal fade"
                                            tabIndex={-1}
                                            role="dialog"
                                            aria-hidden="true"
                                            style={{ display: "none" }}
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Transfer new</h4>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="modal-body p-4">
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Date<span className="text-danger">*</span>
                                                                    </label>
                                                                    <div className="cal-icon cal-icon-info">
                                                                        <DatePicker
                                                                            className="datetimepicker form-control"
                                                                            selected={formData.dueDate}
                                                                            onChange={(date) =>
                                                                                handleDateChange("dueDate", date)
                                                                            }
                                                                            dateFormat="dd-MM-yyyy"
                                                                            showTimeInput={false}
                                                                        ></DatePicker>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>Transfer From</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="field-2"
                                                                        placeholder="Enter Transfer From"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-6 col-sm-12">
                                                            <div className="mb-3 form-group">
                                                                <label>Set Quantity</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    id="field-2"
                                                                    placeholder="Enter Transfer From"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>Transfer To</label>
                                                                    <Select2
                                                                        data={States}
                                                                        onChange={(e) =>
                                                                            changeInputForm(
                                                                                "placeofsupply",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className={`form-select w-100 is-invalid`}
                                                                        options={{
                                                                            placeholder: "Enter state",
                                                                        }}
                                                                        value={formData.placeofsupply}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer godown-list-modal-footer">
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
                                                        >
                                                            Save changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <li className="">
                                            <div className="dropdown dropdown-action">
                                                <Link
                                                    to="#"
                                                    className="btn-filters"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <span>
                                                        {/* <i className="fe fe-download" /> */}
                                                        <FeatherIcon icon="download" />
                                                    </span>
                                                </Link>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <ul className="d-block">
                                                        <li>
                                                            <Link
                                                                className="d-flex align-items-center download-item"
                                                                to="#"
                                                                download=""
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
                                                            >
                                                                <i className="far fa-file-text me-2" />
                                                                CVS
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* /Page Header */}
                        {/* Table */}
                        <div className="row godown-edit-delete-box">
                            <div className="content-page-header ">
                                <div className="col">
                                    {selectedGodownData && selectedGodownData.length > 0 ? (
                                        <>
                                            {selectedGodownData &&
                                                selectedGodownData.length > 0 &&
                                                selectedGodownData.map((godown) => (
                                                    <>
                                                        <h5>{godown.godownName}</h5>
                                                        <p>
                                                            {godown.godownStreetAddress},
                                                            {godown.placeofsupply}
                                                        </p>
                                                    </>
                                                ))}
                                        </>
                                    ) : (
                                        <>
                                            <h4>Select a Godown</h4>
                                        </>
                                    )}
                                </div>

                                <div className="list-btn">
                                    <ul className="filter-list">
                                        <div className="button-list me-2">
                                            <button
                                                type="button"
                                                className="btn edit-button-line  waves-effect waves-light mt-1 me-1"
                                                data-bs-toggle="modal"
                                                data-bs-target="#godown-edit-details"
                                            >
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </button>
                                        </div>
                                        <div className="button-list me-2">
                                            {/* Responsive modal */}
                                            <button
                                                type="button "
                                                className="btn  edit-button-line waves-effect waves-light mt-1 me-1"
                                                onClick={handledeletegodown}
                                            >
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                        <div
                                            id="godown-edit-details"
                                            className="modal fade"
                                            tabIndex={-1}
                                            role="dialog"
                                            aria-hidden="true"
                                            style={{ display: "none" }}
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Edit Godown</h4>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="modal-body p-4">
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>
                                                                        Godown Name{" "}
                                                                        <span className="accountprofilesettings-start-mark">
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${!selectedvalidation.godownName.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        id="field-1"
                                                                        placeholder="Ex. Main FCD Godown"
                                                                        value={selectedformData.godownName}
                                                                        onChange={(e) =>
                                                                            changeSelectedInputForm(
                                                                                "godownName",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    {!selectedvalidation.godownName.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {selectedvalidation.godownName.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>Street Address</label>
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control ${!selectedvalidation.godownStreetAddress
                                                                                .isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        id="field-2"
                                                                        value={selectedformData.godownStreetAddress}
                                                                        placeholder="Enter Street Address"
                                                                        onChange={(e) =>
                                                                            changeSelectedInputForm(
                                                                                "godownStreetAddress",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    {!selectedvalidation.godownStreetAddress
                                                                        .isValid && (
                                                                            <div className="error-message text-danger">
                                                                                {
                                                                                    selectedvalidation.godownStreetAddress
                                                                                        .message
                                                                                }
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="form-group">
                                                                    <label>Place of Supply</label>
                                                                    <Select2
                                                                        data={States}
                                                                        onChange={(e) =>
                                                                            changeSelectedInputForm(
                                                                                "placeofsupply",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className={`form-select w-100 is-invalid`}
                                                                        options={{
                                                                            placeholder: "Enter state",
                                                                        }}
                                                                        value={selectedformData.placeofsupply}
                                                                    />
                                                                    {!selectedvalidation.placeofsupply
                                                                        .isValid && (
                                                                            <div className="error-message text-danger">
                                                                                {selectedvalidation.placeofsupply.message}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="form-group">
                                                                    <label>Pincode</label>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) =>
                                                                            changeSelectedInputForm(
                                                                                "godownPincode",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        value={selectedformData.godownPincode}
                                                                        className={`form-control ${!selectedvalidation.godownPincode.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        placeholder="Ex.560038"
                                                                    />
                                                                    {!selectedvalidation.godownPincode
                                                                        .isValid && (
                                                                            <div className="error-message text-danger">
                                                                                {selectedvalidation.godownPincode.message}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="mb-3 form-group">
                                                                    <label>City</label>
                                                                    <input
                                                                        type="text"
                                                                        onChange={(e) =>
                                                                            changeSelectedInputForm(
                                                                                "godownCity",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        value={selectedformData.godownCity}
                                                                        className={`form-control ${!selectedvalidation.godownCity.isValid
                                                                                ? "is-invalid"
                                                                                : ""
                                                                            }`}
                                                                        id="field-4"
                                                                        placeholder="Boston"
                                                                    />
                                                                    {!selectedvalidation.godownCity.isValid && (
                                                                        <div className="error-message text-danger">
                                                                            {selectedvalidation.godownCity.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
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
                                                            onClick={handleUpdate}
                                                        >
                                                            Save changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-12 godown-data-selection-table">
                                <div>
                                    <div
                                        style={{
                                            marginBottom: 16,
                                        }}
                                    ></div>
                                    <div className="table-responsive table-hover table-striped">
                                        <Table
                                            rowSelection={rowSelection}

                                            rowKey={(record) => record._id}
                                            columns={columns}
                                            dataSource={godownproduct}
                                        />
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

export default GodownList;