import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { backendUrl } from "../backendUrl";
import FeatherIcon from "feather-icons-react";
import { logo, logoblack } from "../../src/_components/imagepath";
import {
  De,
  Es,
  Fr,
  img2,
  img3,
  img4,
  img7,
  search,
  Us,
  Us1,
} from "../_components/imagepath";
import CreateNewBusiness from "../settings/CreateNewBusiness";
import { setActiveBusiness } from "../reducers/userReducer";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

const Header = (props) => {
  const [bussinessClick, setBusinessClick] = useState(false);
  const handleBusinessClick = () => {
    setBusinessClick(true);
  };
  const [open4, setOpen4] = useState(false);

  const activeBusiness = useSelector((state) => state.user.activeBusiness);

  const userData = useSelector((state) => state?.user?.userData);
  console.log("userData", userData)

  const dispatch = useDispatch();
  const handleSetActiveBusiness = (businessId) => {
    // Dispatch setActiveBusiness action to set active business
    dispatch(setActiveBusiness(businessId));
  };

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };

  const onMenuClik = () => {
    props.onMenuClick();
  };
  const [formData, setFormData] = useState({
    _id: "",
    businessName: "",
    phone: "",
    email: "",
    billingAddress: "",
    state: "",
    pincode: "",
    city: "",
    GSTIN: "",
    PANNumber: "",
    businessType: "",
    industryType: "",
    registrationType: "",
    termsAndConditions: "",
    signatureImage: null,
    profileImage: null,
  });

  const [selectedButton, setSelectedButton] = useState(null);

  console.log("formData", formData);
  const handleInputForm = (fieldName, value) => {
    console.log("fieldName", fieldName);
    console.log("value", value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };
  const [businessCards, setBusinessCards] = useState([]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/manageBusiness`,
        { phone: userData?.data?.phone }
      );
      console.log("response", response);

      if (response.data) {
        setFormData(response.data.businesses[0]);
        console.log("object", response.data.businesses[0]);
        setBusinessCards(response.data.businesses);
        console.log("response.data", response.data.businesses);
      } else {
        console.error("Failed ");
      }
    } catch (error) {
      console.error("Error fetching business details", error);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const handleBusiness = (e) => {
    console.log("e.target.id", e.target.id);
    setFormData(businessCards[e.target.id]);
    handleSetActiveBusiness(e.target.id)

  };
  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  useEffect(() => {
    let activeBusinessState =
      sessionStorage.getItem("bill_book_active") || businessCards[0];

    console.log("activeBusinessState", activeBusinessState);

    setFormData(businessCards[parseInt(activeBusinessState)]);
  }, [businessCards, activeBusiness]);


  // useEffect(() => {
  //   let activeBusiness =
  //     sessionStorage.getItem("userId") || businessCards[0];

  //   console.log("activeBusiness", activeBusiness);

  //   setFormData(businessCards[parseInt(activeBusiness)]);
  // }, [businessCards]);




  useEffect(() => {
    const handleClick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    const maximizeBtn = document.querySelector(".win-maximize");
    maximizeBtn.addEventListener("click", handleClick);

    return () => {
      maximizeBtn.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    $(document).on("change", ".sidebar-type-five input", function () {
      if ($(this).is(":checked")) {
        $(".sidebar").addClass("sidebar-nine");
        $(".sidebar-menu").addClass("sidebar-menu-nine");
        $(".menu-title").addClass("menu-title-nine");
        $(".header").addClass("header-nine");
        $(".header-left-two").addClass("header-left-nine");
        $(".user-menu").addClass("user-menu-nine");
        $(".dropdown-toggle").addClass("dropdown-toggle-nine");
        $("#toggle_btn").addClass("darktoggle_btn");
        $(".white-logo").addClass("show-logo");
        $(
          ".header-one .header-left-one .logo:not(.logo-small), .header-five .header-left-five .logo:not(.logo-small)"
        ).addClass("hide-logo");
      } else {
        $(".sidebar").removeClass("sidebar-nine");
        $(".sidebar-menu").removeClass("sidebar-menu-nine");
        $(".menu-title").removeClass("menu-title-nine");
        $(".header").removeClass("header-nine");
        $(".header-left-two").removeClass("header-left-nine");
        $(".user-menu").removeClass("user-menu-nine");
        $(".dropdown-toggle").removeClass("dropdown-toggle-nine");
        $("#toggle_btn").removeClass("darktoggle_btn");
        $(".white-logo").removeClass("show-logo");
        $(
          ".header-one .header-left-one .logo:not(.logo-small), .header-five .header-left-five .logo:not(.logo-small)"
        ).removeClass("hide-logo");
      }
    });
  }, []);

  useEffect(() => {
    $(document).on("change", ".sidebar-type-three input", function () {
      if ($(this).is(":checked")) {
        $(".sidebar").addClass("sidebar-seven");
        $(".sidebar-menu").addClass("sidebar-menu-seven");
        $(".menu-title").addClass("menu-title-seven");
        $(".header").addClass("header-seven");
        $(".header-left-two").addClass("header-left-seven");
        $(".user-menu").addClass("user-menu-seven");
        $(".dropdown-toggle").addClass("dropdown-toggle-seven");
        $(
          ".header-two .header-left-two .logo:not(.logo-small), .header-four .header-left-four .logo:not(.logo-small)"
        ).addClass("hide-logo");
        $(
          ".header-two .header-left-two .dark-logo, .header-four .header-left-four .dark-logo"
        ).addClass("show-logo");
      } else {
        $(".sidebar").removeClass("sidebar-seven");
        $(".sidebar-menu").removeClass("sidebar-menu-seven");
        $(".menu-title").removeClass("menu-title-seven");
        $(".header").removeClass("header-seven");
        $(".header-left-two").removeClass("header-left-seven");
        $(".user-menu").removeClass("user-menu-seven");
        $(".dropdown-toggle").removeClass("dropdown-toggle-seven");
        $(
          ".header-two .header-left-two .logo:not(.logo-small), .header-four .header-left-four .logo:not(.logo-small)"
        ).removeClass("hide-logo");
        $(
          ".header-two .header-left-two .dark-logo, .header-four .header-left-four .dark-logo"
        ).removeClass("show-logo");
      }
    });
  }, []);

  useEffect(() => {
    $(document).on("change", ".sidebar-type-two input", function () {
      if ($(this).is(":checked")) {
        $(".sidebar").addClass("sidebar-six");
        $(".sidebar-menu").addClass("sidebar-menu-six");
        $(".sidebar-menu-three").addClass("sidebar-menu-six");
        $(".menu-title").addClass("menu-title-six");
        $(".menu-title-three").addClass("menu-title-six");
        $(".header").addClass("header-six");
        $(".header-left-two").addClass("header-left-six");
        $(".user-menu").addClass("user-menu-six");
        $(".dropdown-toggle").addClass("dropdown-toggle-six");
        $(
          ".header-two .header-left-two .logo:not(.logo-small), .header-four .header-left-four .logo:not(.logo-small)"
        ).addClass("hide-logo");
        $(
          ".header-two .header-left-two .dark-logo, .header-four .header-left-four .dark-logo"
        ).addClass("show-logo");
      } else {
        $(".sidebar").removeClass("sidebar-six");
        $(".sidebar-menu").removeClass("sidebar-menu-six");
        $(".sidebar-menu-three").removeClass("sidebar-menu-six");
        $(".menu-title").removeClass("menu-title-six");
        $(".menu-title-three").removeClass("menu-title-six");
        $(".header").removeClass("header-six");
        $(".header-left-two").removeClass("header-left-six");
        $(".user-menu").removeClass("user-menu-six");
        $(".dropdown-toggle").removeClass("dropdown-toggle-six");
        $(
          ".header-two .header-left-two .logo, .header-four .header-left-four .logo:not(.logo-small)"
        ).removeClass("hide-logo");
        $(
          ".header-two .header-left-two .dark-logo, .header-four .header-left-four .dark-logo"
        ).removeClass("show-logo");
      }
    });
  }, []);

  return (
    <div className="header header-one">
    <div className="d-flex gap-2 align-items-center">
    <div className="sidebar-logo bg-light " >
        <img src={logoblack} className="img-fluid logo bg-light" alt="" width={200} />
      </div>
      <div className='Dashboard3one-parent-sub-title'>
          <h5>Dashboard</h5>
        </div>
    </div>
      {/* Sidebar Toggle */}
      {/* <Link to="#" id="toggle_btn" onClick={handlesidebar} >
        <span className="toggle-bars">
          <span className="bar-icons" />
          <span className="bar-icons" />
          <span className="bar-icons" />
          <span className="bar-icons" />
        </span>
      </Link> */}
      {/* /Sidebar Toggle */}
      {/* Search */}
      {/* <Link to="#" className="mobile_btn" id="mobile_btn" >
        <i className="fas fa-bars" />
      </Link> */}
      {/* <div className="top-nav-search">
        <form>
          <input
            type="text"
            className="form-control"
            placeholder="Search here"
          />
          <button className="btn" type="submit">
            <img src={search} alt="img" />
          </button>
        </form>
      </div> */}
      {/* /Search */}
      {/* Mobile Menu Toggle */}
      <Link
        to="#"
        className="mobile_btn"
        id="mobile_btn"
        onClick={() => onMenuClik()}
      >
        <i className="fas fa-bars" />
      </Link>
      {/* /Mobile Menu Toggle */}
      {/* Header Menu */}
      <ul className="nav nav-tabs user-menu ">
        {/* Flag */}

        {/* <li className="nav-item dropdown has-arrow flag-nav d-none">
          <Link
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            to="#"
            role="button"
          >
            <img src={Us1} alt="" height={20} />
            <span>English</span>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link to="#" className="dropdown-item">
              <img src={Us} alt="" height={16} />
              <span>English</span>
            </Link>
            <Link to="#" className="dropdown-item">
              <img src={Fr} alt="" height={16} />
              <span>French</span>
            </Link>
            <Link to="#" className="dropdown-item">
              <img src={Es} alt="" height={16} />
              <span>Spanish</span>
            </Link>
            <Link to="#" className="dropdown-item">
              <img src={De} alt="" height={16} />
              <span>German</span>
            </Link>
          </div>
        </li> */}
        {/* /Flag */}
        {/* <li className="nav-item  has-arrow dropdown-heads ">
          <Link to="#" className="toggle-switch moon-switch">
      
            <FeatherIcon icon="moon" />
          </Link>
        </li> */}
        {/* <li className="nav-item dropdown  flag-nav dropdown-heads">
          <Link
            className="nav-link bell-icon"
            data-bs-toggle="dropdown"
            to="#"
            role="button"
          >
         
            <FeatherIcon icon="bell" />
            <span className="badge rounded-pill" />
          </Link>
          <div className="dropdown-menu notifications">
            <div className="topnav-dropdown-header">
              <span className="notification-title">Notifications</span>
              <Link to="#" className="clear-noti">
                {" "}
                Clear All
              </Link>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                <li className="notification-message">
                  <Link to="/profile">
                    <div className="media d-flex">
                      <span className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          alt=""
                          src={img2}
                        />
                      </span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Brian Johnson</span> paid
                          the invoice{" "}
                          <span className="noti-title">#DF65485</span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">4 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="notification-message">
                  <Link to="/profile">
                    <div className="media d-flex">
                      <span className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          alt=""
                          src={img3}
                        />
                      </span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Marie Canales</span> has
                          accepted your estimate{" "}
                          <span className="noti-title">#GTR458789</span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">6 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="notification-message">
                  <Link to="/profile">
                    <div className="media d-flex">
                      <div className="avatar avatar-sm">
                        <span className="avatar-title rounded-circle bg-primary-light">
                          <i className="far fa-user" />
                        </span>
                      </div>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">
                            New user registered
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">8 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="notification-message">
                  <Link to="/profile">
                    <div className="media d-flex">
                      <span className="avatar avatar-sm">
                        <img
                          className="avatar-img rounded-circle"
                          alt=""
                          src={img4}
                        />
                      </span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Barbara Moore</span>{" "}
                          declined the invoice{" "}
                          <span className="noti-title">#RDW026896</span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">12 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="notification-message">
                  <Link to="/profile">
                    <div className="media d-flex">
                      <div className="avatar avatar-sm">
                        <span className="avatar-title rounded-circle bg-info-light">
                          <i className="far fa-comment" />
                        </span>
                      </div>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">
                            You have received a new message
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">2 days ago</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <Link to="/notifications">View all Notifications</Link>
            </div>
          </div>
        </li> */}
        <li className="nav-item  has-arrow dropdown-heads ">
          <Link to="#" className="win-maximize maximize-icon">
            <FeatherIcon icon="maximize" />
          </Link>
        </li>
        <div className='Dashboard3one-parent-sub'>
          <div className='Dashboard3one-parent-sub2-main'>
            <div className='Dashboard3one-parent-sub2'>
              <div className='serchbar-inputfield'>
                <FaMagnifyingGlass />
                <input type="text" placeholder='Type here ...' />
              </div>
            </div>
            <div class="Dashboard3one-dropdown-container">
              <select class="Dashboard3one-dropdown" name="dashboard-dropdown" id="dashboard-dropdown">
                <option value="">Hirola InfoTech Solutions..</option>
                <option value="Hirola InfoTech Solutions..">Hirola InfoTech Solutions..</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
                <option value="Option 4">Option 4</option>
              </select>
            </div>
            <div className='Dashboard-Header-icons'>
              <IoMdSettings />
              <FaBell />

            </div>
          </div>
        </div>
      </ul>
      {/* /Header Menu */}
    </div>
  );
};
export default Header;