// import React from 'react'

// const SettingsSidebar = () => {
//   return (
//     <div>SEttingsSidebar</div>
//   )
// }

// export default SettingsSidebar;
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
  },,
  {
    path: "/profile-settings-manage-business",
    name: "Manage Business",
    icon: '/Homeicon.png',
  },
  {
    path: "/profile-settings-account",
    name: "Account",
    icon: '/profile.png',
  },
//   {
//     path: "/profile-settings-reminders",
//     name: "Remainders",
//     icon: '/reminders.png',
//   },
  {
    path: "/logout",
    name: "Logout",
    icon: '/logout.png',
  }
];

const SettingsSidebar = ({ children, setIncrementor, incrementor }) => {
    const [isOpen, setIsOpen] = useState(true);
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
            width:  "16.5%",
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
            <br /><br /><br /><br />
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

export default SettingsSidebar;