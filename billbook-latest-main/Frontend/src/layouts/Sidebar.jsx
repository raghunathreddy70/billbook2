// import React, { useEffect, useState } from "react";
// import { Link, withRouter } from "react-router-dom";
// import FeatherIcon from "feather-icons-react";
// import { Scrollbars } from "react-custom-scrollbars";
// import {
//   LogoImg,
//   LogoSmallImg,
//   logo,
//   logo1,
//   logoblack,
//   dashboard,
//   salesicon,
//   inventoryicon,
//   reporticon,
//   financeicon,
//   vendorsicon,
//   purchasesicon,
// } from "../_components/imagepath";
// import "./sidebar.css";

// const Sidebar = (props) => {
//   const [isSideMenu, setSideMenu] = useState("");

//   const toggleSidebar = (value) => {
//     console.log(value);
//     setSideMenu(value);
//   };

//   console.log("isSideMenu", isSideMenu);

//   useEffect(() => {
//     function handleMouseOver(e) {
//       e.stopPropagation();
//       if (
//         document.body.classList.contains("mini-sidebar") &&
//         document.querySelector("#toggle_btn").offsetParent !== null
//       ) {
//         var targ = e.target.closest(".sidebar");
//         if (targ) {
//           document.body.classList.add("expand-menu");
//           document
//             .querySelectorAll(".subdrop + ul")
//             .forEach((ul) => (ul.style.display = "block"));
//         } else {
//           document.body.classList.remove("expand-menu");
//           document
//             .querySelectorAll(".subdrop + ul")
//             .forEach((ul) => (ul.style.display = "none"));
//         }
//         return false;
//       }
//     }

//     document.addEventListener("mouseover", handleMouseOver);

//     return () => {
//       document.removeEventListener("mouseover", handleMouseOver);
//     };
//   }, []);

//   useEffect(() => {
//     $(document).on("change", ".sidebar-type-four input", function () {
//       if ($(this).is(":checked")) {
//         $(".sidebar").addClass("sidebar-eight");
//         $(".sidebar-menu").addClass("sidebar-menu-eight");
//         $(".menu-title").addClass("menu-title-eight");
//         $(".header").addClass("header-eight");
//         $(".header-left-two").addClass("header-left-eight");
//         $(".user-menu").addClass("user-menu-eight");
//         $(".dropdown-toggle").addClass("dropdown-toggle-eight");
//         $(".white-logo").addClass("show-logo");
//         $(
//           ".header-one .header-left-one .logo:not(.logo-small), .header-five .header-left-five .logo:not(.logo-small)"
//         ).addClass("hide-logo");
//         $(".header-two .header-left-two .logo:not(.logo-small)").removeClass(
//           "hide-logo"
//         );
//         $(".header-two .header-left-two .dark-logo").removeClass("show-logo");
//       } else {
//         $(".sidebar").removeClass("sidebar-eight");
//         $(".sidebar-menu").removeClass("sidebar-menu-eight");
//         $(".menu-title").removeClass("menu-title-eight");
//         $(".header").removeClass("header-eight");
//         $(".header-left-two").removeClass("header-left-eight");
//         $(".user-menu").removeClass("user-menu-eight");
//         $(".dropdown-toggle").removeClass("dropdown-toggle-eight");
//         $(".white-logo").removeClass("show-logo");
//         $(
//           ".header-one .header-left-one .logo:not(.logo-small), .header-five .header-left-five .logo:not(.logo-small)"
//         ).removeClass("hide-logo");
//       }
//     });
//   }, []);

//   let pathName = props.location.pathname;

//   useEffect(() => {
//     const menuMappings = {
//       4: { menu: "product-service", paths: ["/product-list", "/category-page", "/units"] },
//       5: { menu: "invoice-list", paths: ["/invoice-list", "/invoice-template", "/credit-notes", "/sales-return", "/payment-in", "/proforma-invoice", "/quotations", "/delivery-challans"] },
//       14: { menu: "purchase-invoice", paths: ["/purchase-invoice", "/payment-out", "/purchase-return", "/debit-notes", "/purchase-orders"] },
//       0: { menu: "godown-list", paths: ["/godown-list"] },
//       20: { menu: "recovery", paths: ["/purchase-recovery", "/sales-recovery"] },
//       9: { menu: "finance-accounts", paths: ["/gst-list", "/currency-list", "/cash-bank", "/create-country", "/create-state", "/create-city"] },
//       false: { menu: "finance-accounts", paths: ["/payments", "/gst-list"] },
//       7: { menu: "expenses-products", paths: ["/expenses", "/expense-product-list", "/expenses-parties"] }
//     };

//     const menuMapping = menuMappings[props?.active];

//     if (menuMapping && menuMapping.paths.includes(pathName)) {
//       setSideMenu(menuMapping.menu);
//     } else {
//       setSideMenu("");
//     }
//   }, [props?.active, pathName]);


//   console.log("Working", props?.active);

//   const [sidebarVisible, setsidebarVisible] = useState(false);

//   const toggleSidebarcontent = () => {
//     setsidebarVisible(!sidebarVisible);
//   };

//   return (
//     <>
//       <div className="sidebar" id="sidebar">
//         <div className="sidebar-header">
//           <div className="sidebar-logo">
//             <Link to="/index">
//               <img src={logoblack} className="img-fluid logo" alt="" />
//             </Link>
//             <Link to="index.html">
//               <img src={logo} className="img-fluid logo-small" alt="" />
//             </Link>
//           </div>
//         </div>
//         <Scrollbars
//           autoHide
//           autoHideTimeout={1000}
//           autoHideDuration={200}
//           autoHeight
//           autoHeightMin={0}
//           autoHeightMax="95vh"
//           thumbMinSize={30}
//           universal={false}
//           hideTracksWhenNotNeeded={true}
//         >
//           <div className="sidebar-inner slimscroll">
//             <div id="sidebar-menu" className="sidebar-menu">
//               <ul>
//                 <li className="menu-title">
//                   <span>General</span>
//                 </li>
//                 <li
//                   className={`${
//                     "/index" === pathName ? "active submenu" : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="/index"
//                     className={isSideMenu == "index" ? "subdrop" : ""}
//                     onClick={() =>
//                       toggleSidebar(isSideMenu == "index" ? "" : "index")
//                     }
//                   >
//                     <img
//                       src={dashboard}
//                       className={`${
//                         props?.active === 1
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />{" "}
//                     <span>Dashboard</span>{" "}
//                   </Link>
//                 </li>
//               </ul>
//               {/* /Main */}

//               {/* Customers */}
//               <ul>
//                 <li
//                   className={`${
//                     props?.active === 2 ||
//                     "/active-customers" === pathName ||
//                     "/deactive-customers" === pathName ||
//                     "/edit-customer" === pathName ||
//                     "/add-customer" === pathName ||
//                     "/customer-details" === pathName
//                       ? "active"
//                       : ""
//                   }`}
//                 >
//                   <Link to="/customers">
//                     <FeatherIcon
//                       icon="users"
//                       className={
//                         props?.active === 2
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }
//                     />
//                     <span>Customers</span>
//                   </Link>
//                 </li>

//                 <li
//                   className={`${
//                     props?.active === 3 ||
//                     "/add-ledger" === pathName ||
//                     "/vendor-details" === pathName
//                       ? "active"
//                       : ""
//                   }`}
//                 >
//                   <Link to="/vendors">
//                     <img
//                       src={vendorsicon}
//                       className={`${
//                         props?.active === 3
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />
//                     <span>Vendors</span>
//                   </Link>
//                 </li>
//               </ul>
//               {/* /Customers */}

//               {/* Inventory */}
//               <ul>
//                 <li
//                   className={`${
//                     props?.active === 4 ||
//                     "/add-product" === pathName ||
//                     "/edit-product" === pathName ||
//                     "/add-category" === pathName ||
//                     "/item-details" === pathName
//                       ? "active submenu"
//                       : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={isSideMenu == "product-service" ? "subdrop" : ""}
//                     onClick={() =>
//                       toggleSidebar(
//                         isSideMenu == "product-service" ? "" : "product-service"
//                       )
//                     }
//                   >
//                     <FeatherIcon
//                       icon="package"
//                       className={`${
//                         props?.active === 4
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />{" "}
//                     <span>Inventory</span> <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu == "product-service" ? (
//                     <ul
//                       style={{
//                         display:
//                           isSideMenu == "product-service" ? "block" : "none",
//                       }}
//                     >
//                       <li>
//                         <Link
//                           to="/product-list"
//                           className={`${
//                             "/product-list" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Items
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/category-page"
//                           className={`${
//                             "/category-page" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Category
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/units"
//                           className={`${"/units" === pathName ? "active" : ""}`}
//                         >
//                           Units
//                         </Link>
//                       </li>
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>
//               </ul>
//               {/* sales  */}

//               {/* invoice  */}
//               <ul>
//                 <li
//                   className={`${
//                     (props?.active === 5 ||
//                       "/invoice-details" === pathName ||
//                       "/invoice-paid" === pathName ||
//                       "/invoice-overdue" === pathName ||
//                       "/invoice-template" === pathName ||
//                       "/invoice-draft" === pathName ||
//                       "/invoices" === pathName ||
//                       "/recurring-invoices" === pathName ||
//                       "/credit-notes" === pathName ||
//                       "/quotations" === pathName ||
//                       "/delivery-challans" === pathName ||
//                       "/payment-in" === pathName ||
//                       "/invoice-recurring" === pathName ||
//                       "/invoice-cancelled" === pathName ||
//                       "/invoice-grid" === pathName ||
//                       "/add-invoice" === pathName ||
//                       "/invoice-outstanding" === pathName ||
//                       "/proforma-invoice" === pathName ||
//                       // "/add-proforma" === pathName ||
//                       "/edit-invoice" === pathName) &&
//                     isSideMenu !== "payment"
//                       ? "active submenu"
//                       : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={isSideMenu === "invoice-list" ? "subdrop" : ""}
//                     onClick={() =>
//                       toggleSidebar(
//                         isSideMenu === "invoice-list" ? "" : "invoice-list"
//                       )
//                     }
//                   >
//                     <img
//                       src={salesicon}
//                       className={`${
//                         props?.active === 5
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />
//                     <span> Sales</span>
//                     <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu === "invoice-list" ? (
//                     <ul
//                       style={{
//                         display:
//                           isSideMenu === "invoice-list" ? "block" : "none",
//                       }}
//                     >
//                       <li>
//                         <Link
//                           to="/invoice-list?activeTab=0"
//                           className={`${
//                             "/invoice-list" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Invoices
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/invoice-template"
//                           className={`${
//                             "/invoice-template" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Invoices Template
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/credit-notes"
//                           className={`${
//                             "/credit-notes" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Credit Notes
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/sales-return"
//                           className={`${
//                             "/sales-return" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Sales Return
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/payment-in" // Path for your Payment component
//                           className={`${
//                             "/payment-in" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Payment In
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/proforma-invoice" // Path for your Payment component
//                           className={`${
//                             "/proforma-invoice" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Proforma Invoice
//                         </Link>
//                       </li>
//                       <li
//                         className={`${
//                           "/quotations" === pathName ||
//                           "/add-quotations" === pathName ||
//                           "/edit-quotations" === pathName
//                             ? "active"
//                             : ""
//                         }`}
//                       >
//                         <Link
//                           to="/quotations" // Path for your Payment component
//                           className={`${
//                             "/quotations" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Quotations
//                         </Link>
//                       </li>
//                       <li
//                         className={`${
//                           "/delivery-challans" === pathName ||
//                           "/add-delivery-challans" === pathName ||
//                           "/edit-delivery-challans" === pathName
//                             ? "active"
//                             : ""
//                         }`}
//                       >
//                         <Link
//                           to="/delivery-challans"
//                           className={`${
//                             "/delivery-challans" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Delivery Challans
//                         </Link>
//                       </li>
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>

//                 <li
//                   className={`${
//                     props?.active === 14 ||
//                     "/purchase-invoice" === pathName ||
//                     "/purchase-invoice" === pathName ||
//                     "/payment-out" === pathName ||
//                     "/purchase-return" === pathName ||
//                     "/debit-notes" === pathName ||
//                     "/purchase-orders" === pathName
//                       ? "active submenu"
//                       : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={
//                       isSideMenu == "purchase-invoice" ? "subdrop" : ""
//                     }
//                     onClick={() =>
//                       toggleSidebar(
//                         isSideMenu == "purchase-invoice"
//                           ? ""
//                           : "purchase-invoice"
//                       )
//                     }
//                   >
//                     <FeatherIcon
//                       icon="package"
//                       className={`${
//                         props?.active === 14
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />{" "}
//                     <span> Purchases</span> <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu == "purchase-invoice" ? (
//                     <ul
//                       style={{
//                         display:
//                           isSideMenu == "purchase-invoice" ? "block" : "none",
//                       }}
//                     >
//                       <li>
//                         <Link
//                           to="/purchase-invoice?activeTab=0"
//                           className={`${
//                             "/purchase-invoice" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Purchase Invoice
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/payment-out"
//                           className={`${
//                             "/payment-out" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Payment Out
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/purchase-return"
//                           className={`${
//                             "/purchase-return" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Purchase Return
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/debit-notes"
//                           className={`${
//                             "/debit-notes" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Debit Note
//                         </Link>
//                       </li>

//                       <li>
//                         <Link
//                           to="/purchase-orders"
//                           className={`${
//                             "/purchase-orders" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Purchase Orders
//                         </Link>
//                       </li>
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>

//                 <li
//                   className={`${
//                     "/godown-list" === pathName ? "active submenu" : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={isSideMenu == "godown-list" ? "subdrop" : ""}
//                     onClick={() =>
//                       toggleSidebar(
//                         isSideMenu == "godown-list" ? "" : "godown-list"
//                       )
//                     }
//                   >
//                     <FeatherIcon
//                       icon="package"
//                       className={`${
//                         props?.active === 0
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />{" "}
//                     <span> Godown</span> <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu == "godown-list" ? (
//                     <ul
//                       style={{
//                         display: isSideMenu == "godown-list" ? "block" : "none",
//                       }}
//                     >
//                       <li>
//                         <Link
//                           to="/godown-list"
//                           className={`${
//                             "/godown-list" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Godown List
//                         </Link>
//                       </li>
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>

//                 <li
//                   className={`${
//                     "/recurring-invoices" === pathName ||
//                     "/recurring-paid" === pathName ||
//                     "/recurring-pending" === pathName ||
//                     "/recurring-overdue" === pathName ||
//                     "/recurring-draft" === pathName ||
//                     "/recurring-cancelled" === pathName
//                       ? "active submenu"
//                       : "submenu"
//                   }`}
//                 ></li>
//                 <li
//                   className={`${
//                     "/credit-notes" === pathName ||
//                     "/add-credit-notes" === pathName ||
//                     "/credit-notes-outstanding" === pathName ||
//                     "/credit-notes-overdue" === pathName ||
//                     "/credit-notes-draft" === pathName ||
//                     "/credit-notes-recurring" === pathName ||
//                     "/credit-notes-cancelled" === pathName
//                       ? "active"
//                       : ""
//                   }`}
//                 ></li>
//               </ul>
//               {/* Customers */}
//               <ul>
//                 <li className={`${props?.active === 8 ? "active" : ""}`}>
//                   <Link to="/reports">
//                     <FeatherIcon
//                       icon="file-minus"
//                       className={
//                         props?.active === 8
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }
//                     />
//                     <span>Reports</span>
//                   </Link>
//                 </li>
//               </ul>
//               {/* <ul>
//                 <li className={`${props?.active === 9 ? "active" : ""}`}>
//                   <Link to="/invoice-temp">
//                     <FeatherIcon icon="file-minus" />
//                     <span>Invoice Templates</span>
//                   </Link>
//                 </li>
//               </ul> */}
//               {/* recovery invoices starts here*/}

//               <ul>
//                 <li
//                   className={`${
//                     props?.active === 20 ? "active submenu" : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={isSideMenu == "recovery" ? "subdrop" : ""}
//                     onClick={() =>
//                       toggleSidebar(isSideMenu == "recovery" ? "" : "recovery")
//                     }
//                   >
//                     <FeatherIcon
//                       icon="arrow-left-circle"
//                       className={`${
//                         props?.active === 20
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />{" "}
//                     <span>Recovery Invoices</span>{" "}
//                     <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu == "recovery" ? (
//                     <ul
//                       style={{
//                         display: isSideMenu == "recovery" ? "block" : "none",
//                       }}
//                     >
//                       {/* <li>
//                         <Link to="/expenses-recovery" className={`${"/expenses-recovery" === pathName ? "active" : ""}`}>
//                           Expenses
//                         </Link>
//                       </li> */}
//                       <li>
//                         <Link
//                           to="/purchase-recovery"
//                           className={`${
//                             "/purchase-recovery" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Purchases
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/sales-recovery"
//                           className={`${
//                             "/sales-recovery" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Sales
//                         </Link>
//                       </li>
//                       {/* <li>
//                         <Link
//                           to="/deleted-invoice"
//                           className={`${"/deleted-invoice" === pathName ? "active" : ""
//                             }`}
//                         >
//                           Deleted Invoice
//                         </Link>
//                       </li> */}
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>
//               </ul>
//               {/* recovery invoices ends here*/}

//               {/* /Customers */}
//               <ul></ul>
//               {/* Finance & Accounts */}
//               <ul>
//                 <li className="menu-title">
//                   <span>ACCOUNTING SOLUTIONS</span>
//                 </li>
//                 <li
//                   className={`${
//                     props?.active === 9 ||
//                     "/payments" === pathName ||
//                     "/gst-list" === pathName ||
//                     "/currency-list" === pathName ||
//                     "/cash-bank" === pathName
//                       ? "active submenu"
//                       : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={
//                       isSideMenu == "finance-accounts" ? "subdrop" : ""
//                     }
//                     onClick={() =>
//                       toggleSidebar(
//                         isSideMenu == "finance-accounts"
//                           ? ""
//                           : "finance-accounts"
//                       )
//                     }
//                   >
//                     <img
//                       src={financeicon}
//                       className={`${
//                         props?.active === 9
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />
//                     <span>Finance &amp; Accounts</span>{" "}
//                     <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu == "finance-accounts" ? (
//                     <ul
//                       style={{
//                         display:
//                           isSideMenu == "finance-accounts" ? "block" : "none",
//                       }}
//                     >
//                       <li>
//                         <Link
//                           to="/payments"
//                           className={`${
//                             "/payments" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Payment
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/gst-list"
//                           className={`${
//                             "/gst-list" === pathName ? "active" : ""
//                           }`}
//                         >
//                           GST
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="currency-list"
//                           className={`${
//                             "/currency-list" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Currency
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="cash-bank"
//                           className={`${
//                             "/cash-bank" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Bank Details
//                         </Link>
//                       </li>
//                       {/* <li
//                       >
//                         <Link to="/payment-summary" className={`${"/payment-summary" === pathName ? "active" : ""
//                           }`}>
//                           Payment Summary
//                         </Link>
//                       </li> */}
//                       {/* <li>
//                         <Link
//                           to="/create-country"
//                           className={`${
//                             "/create-country" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Country
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/create-state"
//                           className={`${
//                             "/create-state" === pathName ? "active" : ""
//                           }`}
//                         >
//                           State
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/create-city"
//                           className={`${
//                             "/create-city" === pathName ? "active" : ""
//                           }`}
//                         >
//                           City
//                         </Link>
//                       </li> */}
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>
//               </ul>

//               {/* expenses*/}
//               <ul>
//                 <li
//                   className={`${
//                     props?.active === 7 ||
//                     "/expense-product-list" === pathName ||
//                     "/expenses-parties" === pathName
//                       ? "active submenu"
//                       : "submenu"
//                   }`}
//                 >
//                   <Link
//                     to="#"
//                     className={
//                       isSideMenu == "expenses-products" ? "subdrop" : ""
//                     }
//                     onClick={() =>
//                       toggleSidebar(
//                         isSideMenu == "expenses-products"
//                           ? ""
//                           : "expenses-products"
//                       )
//                     }
//                   >
//                     <FeatherIcon
//                       icon="package"
//                       className={`${
//                         props?.active === 7
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                       alt=""
//                     />{" "}
//                     <span> Expenses </span>{" "}
//                     <span className="menu-arrow"></span>
//                   </Link>
//                   {isSideMenu == "expenses-products" ? (
//                     <ul
//                       style={{
//                         display:
//                           isSideMenu == "expenses-products" ? "block" : "none",
//                       }}
//                     >
//                       <li>
//                         <Link
//                           to="/expenses?activeTab=0"
//                           className={`${
//                             "/expenses" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Expenses
//                         </Link>
//                       </li>
//                       {/* <li>
//                         <Link
//                           to="/expense-product-list"
//                           className={`${
//                             "/expense-product-list" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Expense Product List
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/expenses-parties"
//                           className={`${
//                             "/expenses-parties" === pathName ? "active" : ""
//                           }`}
//                         >
//                           Parties
//                         </Link>
//                       </li> */}
//                     </ul>
//                   ) : (
//                     ""
//                   )}
//                 </li>
//               </ul>
//               {/* expenses*/}

//               {/* documentation */}
//               <div className="dashboard-sidebar-image-parent">
//                 <div className="dashboard-sidebar-image">
//                   <img src="/images/sidebarbottomimage.png" alt="" />
//                 </div>
//                 <div className="dashboard-sidebar-image-parent-sub">
//                   <h5>Need help?</h5>
//                   <p>Please check our docs</p>
//                 </div>
//                 <div className="dashboard-sidebar-image-parent-sub-button">
//                   <Link className="document-btn" to="/documentation">
//                     Documentation
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Scrollbars>

//         {/* newly added content ends here */}
//         <div className="dashboard-settings-logout">
//           {/* Settings */}
//           <div className="dashboard-sidebar-settings">
//             <ul>
//               <div className="Sidebar-settings-link">
//                 <li className={`${"/settings" === pathName ? "active" : ""}`}>
//                   <Link to="/settings" className="flex-a align-items-center">
//                     <FeatherIcon
//                       icon="settings"
//                       className={`${
//                         props?.active === 12
//                           ? "imgFilterActive submenu"
//                           : "submenu"
//                       }`}
//                     />{" "}
//                     <span>Settings</span>
//                   </Link>
//                 </li>
//               </div>
//             </ul>
//           </div>
//           {/* Logout */}
//           <ul>
//             <div className="sidebar-dashboard-logoutbutton">
//               <li className={`${"/login" === pathName ? "active" : ""}`}>
//                 <Link to="/login" className="flex-a align-items-center">
//                   <FeatherIcon icon="power" />{" "}
//                   <span className="sidebar-logout">Logout</span>
//                 </Link>
//               </li>
//             </div>
//           </ul>
//           {/* Logout */}
//         </div>
//       </div>
//     </>
//   );
// };
// export default withRouter(Sidebar);


import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Content, Footer, Header } from "antd/es/layout/layout";
import Dashboard from "../dashboard/Index";
const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', '1'),
  getItem('Customer', '2'),
  getItem('Vendors', '2'),
  getItem('Inventory', 'sub1', <UserOutlined />, [
    getItem('Products', '3'),
    getItem('Category', '4'),
    getItem('Units', '5'),
  ]),
  getItem('Sales', 'sub1', <UserOutlined />, [
    getItem('Invoice', '3'),
    getItem('Invoices Template', '4'),
    getItem('Credit Notes', '5'),
    getItem('Sales Return', '3'),
    getItem('Payment In', '4'),
    getItem('Proforma Invoice', '5'),
    getItem('Quotations', '4'),
    getItem('Delivery Challans', '5'),
  ]),
  getItem('Inventory', 'sub1', <UserOutlined />, [
    getItem('Products', '3'),
    getItem('Category', '4'),
    getItem('Units', '5'),
  ]),
  getItem('Inventory', 'sub1', <UserOutlined />, [
    getItem('Products', '3'),
    getItem('Category', '4'),
    getItem('Units', '5'),
  ]),

  getItem('Inventory', 'sub1', <UserOutlined />, [
    getItem('Products', '3'),
    getItem('Category', '4'),
    getItem('Units', '5'),
  ]),
  getItem('Inventory', 'sub1', <UserOutlined />, [
    getItem('Products', '3'),
    getItem('Category', '4'),
    getItem('Units', '5'),
  ]),
  getItem('Inventory', 'sub1', <UserOutlined />, [
    getItem('Products', '3'),
    getItem('Category', '4'),
    getItem('Units', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

console.log('items',items);
const Sidebar = (props) => {
  // const navigate=useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick = (e) => {
    console.log('click ', e);
  };
  return (
    <>
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
         
        {/* <Dashboard /> */}
       

        </Layout>
      </Layout>
    </>
  )
}
export default withRouter(Sidebar);