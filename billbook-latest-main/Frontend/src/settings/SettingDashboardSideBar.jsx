import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import { LogoImg, LogoSmallImg } from "../_components/imagepath";

const SettingDashboardSideBar = (props) => {
    const [isSideMenu, setSideMenu] = useState("");

    const toggleSidebar = (value) => {
        console.log(value);
        setSideMenu(value);
    };

    useEffect(() => {
        function handleMouseOver(e) {
            e.stopPropagation();
            if (
                document.body.classList.contains("mini-sidebar") &&
                document.querySelector("#toggle_btn").offsetParent !== null
            ) {
                var targ = e.target.closest(".sidebar");
                if (targ) {
                    document.body.classList.add("expand-menu");
                    document
                        .querySelectorAll(".subdrop + ul")
                        .forEach((ul) => (ul.style.display = "block"));
                } else {
                    document.body.classList.remove("expand-menu");
                    document
                        .querySelectorAll(".subdrop + ul")
                        .forEach((ul) => (ul.style.display = "none"));
                }
                return false;
            }
        }

        document.addEventListener("mouseover", handleMouseOver);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    useEffect(() => {
        $(document).on("change", ".sidebar-type-four input", function () {
            if ($(this).is(":checked")) {
                $(".sidebar").addClass("sidebar-eight");
                $(".sidebar-menu").addClass("sidebar-menu-eight");
                $(".menu-title").addClass("menu-title-eight");
                $(".header").addClass("header-eight");
                $(".header-left-two").addClass("header-left-eight");
                $(".user-menu").addClass("user-menu-eight");
                $(".dropdown-toggle").addClass("dropdown-toggle-eight");
                $(".white-logo").addClass("show-logo");
                $(
                    ".header-one .header-left-one .logo:not(.logo-small), .header-five .header-left-five .logo:not(.logo-small)"
                ).addClass("hide-logo");
                $(".header-two .header-left-two .logo:not(.logo-small)").removeClass(
                    "hide-logo"
                );
                $(".header-two .header-left-two .dark-logo").removeClass("show-logo");
            } else {
                $(".sidebar").removeClass("sidebar-eight");
                $(".sidebar-menu").removeClass("sidebar-menu-eight");
                $(".menu-title").removeClass("menu-title-eight");
                $(".header").removeClass("header-eight");
                $(".header-left-two").removeClass("header-left-eight");
                $(".user-menu").removeClass("user-menu-eight");
                $(".dropdown-toggle").removeClass("dropdown-toggle-eight");
                $(".white-logo").removeClass("show-logo");
                $(
                    ".header-one .header-left-one .logo:not(.logo-small), .header-five .header-left-five .logo:not(.logo-small)"
                ).removeClass("hide-logo");
            }
        });
    }, []);

    let pathName = props.location.pathname;

    console.log("Working", pathName);

    return (
        <>
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Link to="/index">
                            <img src={LogoImg} className="img-fluid logo" alt="" />
                        </Link>
                        <Link to="index.html">
                            <img src={LogoSmallImg} className="img-fluid logo-small" alt="" />
                        </Link>
                    </div>
                </div>
                <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    autoHeight
                    autoHeightMin={0}
                    autoHeightMax="95vh"
                    thumbMinSize={30}
                    universal={false}
                    hideTracksWhenNotNeeded={true}
                >
                    <div className="sidebar-inner slimscroll">
                        <div id="sidebar-menu" className="sidebar-menu">
                            {/* Back to dashboard */}
                            <ul>
                                <li
                                    className={`${"/index" === pathName || "/index" === pathName
                                        ? "active"
                                        : ""
                                        }backtodashboard`}
                                >
                                    <Link to="/index" className="backtodashboard-link">
                                        <FeatherIcon icon="arrow-left" className="settings-arrow-left" /> <span>Dashboard</span>
                                    </Link>
                                </li>
                            </ul>
                            {/* /Back to dashboard */}

                            {/* Customers */}
                            <ul>
                                <li
                                    className={`${"/profile-settings-account" === pathName
                                        ? "active"
                                        : ""
                                        }`}
                                >
                                    <Link to="/profile-settings-account">
                                        <FeatherIcon icon="users" className={`${props?.active === 16 ? "imgFilterActive submenu" : "submenu"
                                            }`} alt="" />
                                        <span>Account</span>
                                    </Link>
                                </li>
                                <li
                                    className={`${props?.active ===  15
                                        ? "active"
                                        : ""
                                        }`}
                                >
                                    <Link to="/profile-settings-manage-business">
                                        <FeatherIcon icon="file" className={`${props?.active === 15 ? "imgFilterActive submenu" : "submenu"
                                            }`} alt="" /> <span>Manage Business</span>
                                    </Link>
                                </li>
                                <li
                                    className={`${props?.active === pathName ||
                                        "/roles-permission" === pathName ||
                                        "/delete-account-request" === pathName ||
                                        "/add-user" === pathName ||
                                        "/permission" === pathName ||
                                        "/users" === pathName
                                        ? "active submenu"
                                        : "submenu"
                                        }`}
                                >
                                    <Link
                                        to="#"
                                        className={isSideMenu == "manage-user" ? "subdrop" : ""}
                                        onClick={() =>
                                            toggleSidebar(
                                                isSideMenu == "manage-user" ? "" : "manage-user"
                                            )
                                        }
                                    >
                                        <FeatherIcon icon="user" className={`${props?.active === 17 ? "imgFilterActive submenu" : "submenu"
                                            }`} alt="" /> <span>Manage Users </span>
                                        <span className="menu-arrow"></span>
                                    </Link>
                                    {isSideMenu == "manage-user" ? (
                                        <ul
                                            style={{
                                                display: isSideMenu == "manage-user" ? "block" : "none",
                                            }}
                                        >
                                            {/* <li>
                                                <Link
                                                    to="/add-user"
                                                    className={`${"/add-user" === pathName ? "active" : ""
                                                        }`}
                                                >
                                                    Add User
                                                </Link>
                                            </li> */}
                                            <li>
                                                <Link
                                                    to="/users"
                                                    className={`${"/users" === pathName ? "active" : ""}`}
                                                >
                                                    Add Users
                                                </Link>
                                            </li>
                                            <li
                                               
                                            >
                                                <Link to="/roles-permission"
                                                 className={`${"/roles-permission" === pathName ||
                                                 "/permission" === pathName
                                                 ? "active"
                                                 : ""
                                                 }`}>
                                                    Roles & Permissions
                                                </Link>
                                            </li>
                                            <li
                                               
                                            >
                                                <Link to="/delete-account-request"
                                                 className={`${"/delete-account-request" === pathName ? "active" : ""
                                                }`}>
                                                    Delete Account Request
                                                </Link>
                                            </li>
                                        </ul>
                                    ) : (
                                        ""
                                    )}
                                </li>
                                <li
                                    className={`${"/profile-settings-reminders" === pathName || "/profile-settings-reminders" === pathName
                                        ? "active"
                                        : ""
                                        }`}
                                >
                                    <Link to="/profile-settings-reminders">
                                        <FeatherIcon icon="clock" className={`${props.active === 18 ? "imgFilterActive submenu" : "submenu"}`} alt="" /> <span>Reminders</span>
                                    </Link>
                                </li>
                            </ul>

                            {/* documentation */}
                            <div className="dashboard-sidebar-image-parent">
                                <div className="dashboard-sidebar-image">
                                    <img src="/images/sidebarbottomimage.png" alt="" />
                                </div>
                                <div className="dashboard-sidebar-image-parent-sub">
                                    <h5>Need help?</h5>
                                    <p>Please check our docs</p>
                                </div>
                                <div className="dashboard-sidebar-image-parent-sub-button">
                                    <Link className='document-btn' to='/documentation'>Documentation</Link>
                                </div>
                            </div>
                            {/* documentation */}
                        </div>
                    </div>
                </Scrollbars>

                <div className="dashboard-settings-logout">
                    {/* Settings */}
                    <div className="dashboard-sidebar-settings">
                        <ul>
                            <div className="Sidebar-settings-link">
                                <li className={`${"/settings" === pathName ? "active" : ""}`}>
                                    <Link to="/settings" className="flex-a align-items-center">
                                        <FeatherIcon icon="settings" className={`${props?.active === 12 ? "imgFilterActive submenu" : "submenu"}`} /> <span>Settings</span>
                                    </Link>
                                </li>
                            </div>
                        </ul>
                    </div>
                    {/* Settings */}
                    {/* Logout */}
                    <ul>
                        <div className="sidebar-dashboard-logoutbutton">
                            <li className={`${"/login" === pathName ? "active" : ""}`}>
                                <Link to="/login" className="flex-a align-items-center">
                                    <FeatherIcon icon="power" /> <span className="sidebar-logout">Logout</span>
                                </Link>
                            </li>
                        </div>
                    </ul>
                    {/* Logout */}
                </div>
            </div>
        </>
    );
};
export default withRouter(SettingDashboardSideBar);
