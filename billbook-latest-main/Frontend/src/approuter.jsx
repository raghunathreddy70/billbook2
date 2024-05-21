import React from "react";
import AppContainer from "./appcontainer.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import config from "config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "../src/store.js";

const AppRouter = (props) => {
  return (
    <>
      <Provider store={store}>
        <Router basename={`${config.publicPath}`}>
          <Route render={(props) => <AppContainer {...props} />} />
        </Router>
        <ToastContainer />
      </Provider>
    </>
  );
};

export default AppRouter;
