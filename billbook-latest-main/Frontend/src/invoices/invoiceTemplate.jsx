import React, { useState } from "react";
import {
  Cashreceipt1,
  Cashreceipt2,
  Cashreceipt3,
  Cashreceipt4,
  GeneralInvoice1,
  GeneralInvoice10,
  GeneralInvoice11,
  GeneralInvoice12,
  GeneralInvoice13,
  GeneralInvoice14,
  GeneralInvoice15,
  GeneralInvoice16,
  GeneralInvoice17,
  GeneralInvoice18,
  GeneralInvoice19,
  GeneralInvoice2,
  GeneralInvoice20,
  GeneralInvoice3,
  GeneralInvoice4,
  GeneralInvoice5,
  GeneralInvoice6,
  GeneralInvoice7,
  GeneralInvoice8,
  GeneralInvoice9,
  generalInvoicesix,
} from "../_components/imagepath";
import { Link } from "react-router-dom";
// import Sample from "../elements/Sample";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const InvoiceTemplate = () => {
  const [menu, setMenu] = useState(false);
  const userData = useSelector(state=> state?.user?.userData);
  const [formData, setFormData] = useState([]);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const handleClick = (index) => {
    handleUpdate(index);
  };

  const handleUpdate = async (index) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/templates/invoiceTemplates`,
        { ...formData, template: index, businessId: userData?.data?._id}
      );
      toast.success("Template Selected Successfully", { position: 'top-right' })
      console.log("Data updated successfully:", response.data);
    } catch (error) {
      toast.error("Error Selecting the Template", { position: 'top-right' })
      console.error("Error updating data:", error);
    }
  };



  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Invoice Templates</h5>
              </div>
            </div>
            {/* <Sample /> */}
            {/* /Page Header */}
            <div className="card mb-0">
              <div className="card-body pb-0">
                <div className="invoice-card-title">
                  <h6>General Invoice</h6>
                </div>
                <div className="row">
                  {/* Invoice List */}
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-betweens ">
                      <div className="blog-image">
                        <img
                          className="img-fluid"
                          src={GeneralInvoice1}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={1} onClick={(e) => handleUpdate(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-1">General Invoice 1</Link>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <img
                          className="img-fluid"
                          src={GeneralInvoice2}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={2} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-2">General Invoice 2</Link>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <img
                          className="img-fluid"
                          src={GeneralInvoice3}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={3} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-3">General Invoice 3</Link>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <img
                          className="img-fluid"
                          src={GeneralInvoice4}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={4} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-4">General Invoice 4</Link>
                      </div>
                    </div>
                  </div>
                  {/* Invoice List */}
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <img
                          className="img-fluid"
                          src={GeneralInvoice5}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={5} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-5">General Invoice 5</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={6} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>

                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-six">General Invoice 6</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={7} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>

                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-seven">
                          General Invoice 7
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={8} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-eight">
                          General Invoice 8
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={9} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-nine">
                          General Invoice 9
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={10} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-ten">
                          General Invoice 10
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={11} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-11">General Invoice 11</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={12} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>

                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-12">General Invoice 12</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={13} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-13">General Invoice 13</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={14} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-14">General Invoice 14</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={15} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-15">General Invoice 15</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={16} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-sixteen">
                          General Invoice 16
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={17} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-seventeen">
                          General Invoice 17
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">

                        <img
                          className="img-fluid"
                          src={generalInvoicesix}
                          alt="Post Image"
                        />
                        <div className="overlay">
                          <button value={18} onClick={(e) => handleClick(e.target.value)}>Select</button>
                        </div>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/general-invoice-18">General Invoice 18</Link>
                      </div>
                    </div>
                  </div>
                  {/* /Invoice List */}
                  {/* /Invoice List */}
                </div>
                <div className="row">
                  <div className="invoice-card-title">
                    <h6>Category Based Invoice</h6>
                  </div>
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/bus-ticket">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice6}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/bus-ticket">Bus Ticket Booking Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/car-booking-invoice">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice7}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/car-booking-invoice">
                          Car Booking Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/coffee-shop">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice8}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/coffee-shop">Coffee Shop Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/domain-hosting">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice9}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/domain-hosting">
                          Domain &amp; Hosting Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/ecommerce">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice10}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/ecommerce">Ecommerce Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/fitness-center">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice11}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/fitness-center">Fitness Center Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/train-ticket-booking">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice12}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/train-ticket-booking">
                          Train Ticket Booking Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/flight-booking-invoice">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice13}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/flight-booking-invoice">
                          Flight Booking Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/hotel-booking">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice14}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/hotel-booking">Hotel Booking Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/internet-billing">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice15}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/internet-billing">
                          Internet Billing Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/medical">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice16}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/medical">Medical Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/moneyexchange">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice17}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/moneyexchange">Money Exchange Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/movie-ticket-booking">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice18}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/movie-ticket-booking">
                          Movie Ticket Booking Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between ">
                      <div className="blog-image">
                        <Link to="/restuarent-billing">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice19}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/restuarent-billing">Restaurant Invoice</Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* Invoice List */}
                  {/* <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                    <div className="blog grid-blog flex-fill d-flex flex-wrap align-content-between">
                      <div className="blog-image">
                        <Link to="/student-billing">
                          <img
                            className="img-fluid"
                            src={GeneralInvoice20}
                            alt="Post Image"
                          />
                        </Link>
                      </div>
                      <div className="invoice-content-title">
                        <Link to="/student-billing">
                          Student Billing Invoice
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* /Invoice List */}
                  {/* <div className="row">
                    <div className="invoice-card-title">
                      <h6>Receipt Invoice</h6>
                    </div>
                    
                    <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                      <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between">
                        <div className="blog-image">
                          <Link to="/cashreceipt-1">
                            <img
                              className="img-fluid"
                              src={Cashreceipt1}
                              alt="Post Image"
                            />
                          </Link>
                        </div>
                        <div className="invoice-content-title">
                          <Link to="/cashreceipt-1">Cash Receipt 1</Link>
                        </div>
                      </div>
                    </div>
                  
                    <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                      <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                        <div className="blog-image">
                          <Link to="/cashreceipt-2">
                            <img
                              className="img-fluid"
                              src={Cashreceipt2}
                              alt="Post Image"
                            />
                          </Link>
                        </div>
                        <div className="invoice-content-title">
                          <Link to="/cashreceipt-2">Cash Receipt 2</Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                      <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                        <div className="blog-image">
                          <Link to="/cashreceipt-3">
                            <img
                              className="img-fluid"
                              src={Cashreceipt3}
                              alt="Post Image"
                            />
                          </Link>
                        </div>
                        <div className="invoice-content-title">
                          <Link to="/cashreceipt-3">Cash Receipt 3</Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                      <div className="blog grid-blog flex-fill  d-flex flex-wrap align-content-between ">
                        <div className="blog-image">
                          <Link to="/cashreceipt-4">
                            <img
                              className="img-fluid"
                              src={Cashreceipt4}
                              alt="Post Image"
                            />
                          </Link>
                        </div>
                        <div className="invoice-content-title">
                          <Link to="/cashreceipt-4">Cash Receipt 4</Link>
                        </div>
                      </div>
                    </div>
                    
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceTemplate;
