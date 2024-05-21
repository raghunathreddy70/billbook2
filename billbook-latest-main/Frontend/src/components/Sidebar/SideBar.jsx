import React from "react";
import { NavLink } from "react-router-dom";
import {FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./sidebar.css"

import SidebarMenu from "./SidebarMenu";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: '/Homeicon.png',
  },
  {
    path: "/customers",
    name: "Customers",
    icon: '/customersicon.png',
  },
  {
    path: "/Vendors",
    name: "Vendors",
    icon: '/vendors.png',
  },
  {
    name: "Inventory",
    icon: '/inventory1.png',
    subRoutes: [
      {
        path: "/product-list",
        name: "Products ",
        icon: <FaUser />,
      },
      {
        path: "/category-page",
        name: "Category",
        icon: <FaLock />,
      },
      {
        path: "/units",
        name: "Units",
        icon: <FaMoneyBill />,
      },
    ],
  },
  {
    name: "Sales",
    icon: '/sales.png',
    subRoutes: [
      {
        path: "/invoice-list",
        name: "Invoice ",
        icon: <FaUser />,
      },
      {
        path: "/invoice-template",
        name: "Invoice Templates",
        icon: <FaLock />,
      },
      {
        path: "/credit-notes",
        name: "Credit Notes",
        icon: <FaMoneyBill />,
      },
      {
        path: "/sales-return",
        name: "Sales Return",
        icon: <FaMoneyBill />,
      },
      {
        path: "/payment-in",
        name: "Payment In",
        icon: <FaMoneyBill />,
      },
      {
        path: "/proforma-invoice",
        name: "Proforma Invoice",
        icon: <FaMoneyBill />,
      },
      {
        path: "/quotations",
        name: "Quotations",
        icon: <FaMoneyBill />,
      },
      {
        path: "/delivery-challans",
        name: "Delivery Challans",
        icon: <FaMoneyBill />,
      },
    ],
  },
  {
    name: "Purchases",
    icon: '/purchases.png',
    subRoutes: [
      {
        path: "/purchase-invoice",
        name: "Purchase Invoice ",
        icon: <FaUser />,
      },
      {
        path: "/purchase-orders",
        name: "Purchase Orders",
        icon: <FaLock />,
      }
    ],
  },
  {
    path: "/expenses",
    name: "Expenses",
    icon: '/expenses.png',
  },
  {
    name: "Godown",
    icon: '/godown.png',
    subRoutes: [
      {
        path: "/godown-list",
        name: "Godownlist ",
        icon: '/godown.png',
      }
    ],
  },
  {
    path: "/reports",
    name: "Reports",
    icon: '/reports.png',
  },
  {
    path: "/sales-recovery",
    name: "Sales Recovery",
    icon: '/recovery.png',
  },
  {
    name: "Finance & Accounts",
    icon: '/fa.png',
    exact: true,
    subRoutes: [
      {
        path: "/currency-list",
        name: "Currency",
        icon: "/currency.png",
      },
      {
        path: "/cash-bank",
        name: "Bank Details",
        icon: '/bank.png',
      }
    ],
  },
  {
    path: "/profile-settings-account",
    name: "Settings",
    icon: '/settings.png',
    className: "SettingsMenu",
  },
  {
    Heading: "ACCOUNT PAGES",
    path: "/settings",
    name: "Profile",
    icon: '/profile.png',
  },
  {
    path: "/pricingplans",
    name: "Pricing Plan",
    icon: '/pricingplan.png'
  },
];

const SideBar = ({ children, setIncrementor, incrementor }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const history = useHistory()
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "16.5%" : "45px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar`}
        >
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIncrementor={setIncrementor}
                    incrementor={incrementor}
                    onClick={() => setIncrementor(incrementor + 1)}
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                    className={`menu ${route.className || ""}`}
                  />
                );
              }

              return (
                <>
                  {route.Heading && (
                    <p className="AccountsHeading">{route.Heading}</p>
                  )}

                  <NavLink
                    to={route.path}
                    key={index}
                    onClick={() => setIncrementor(incrementor + 1)}
                    className={`link ${route.className || ""}`}
                    activeClassName="active"
                  >
                    <div className="icon">
                      {route.icon ? (
                        <img src={route.icon} alt={route.name} style={{ width: '18px', height: '16px' }} />
                      ) : (
                        route.icon
                      )}
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </>
              );
            })}
            <div className="Documentation-section" style={{ backgroundImage: `url('/needhelp.png')` }}>
              <div className="Documentation-section-content">
                <div className="Documentation-icon">
                  <img src="/documentation.png" alt="" />
                </div>
                <div className="Documentation-text">
                  <h5>Need help?</h5>
                  <p>Please check our docs</p>
                  <button>DOCUMENTATION</button>
                </div>
              </div>
            </div>

          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;