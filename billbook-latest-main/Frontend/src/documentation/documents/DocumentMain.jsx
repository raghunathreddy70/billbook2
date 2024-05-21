import React from "react";
import { Tabs } from "antd";
import Overview from "./Overview";
const { TabPane } = Tabs;

const DocumentationMain = () => {
  return (
    <Tabs tabPosition="left" style={{ minHeight: 200 }}>
      <TabPane tab="OverView" key="1">
        <Overview/>
      </TabPane>
      <TabPane tab="Customers" key="2">
        Content of Customers
      </TabPane>
      <TabPane tab="Vendors" key="3">
        Content of Vendors
      </TabPane>
      <TabPane tab="Products" key="4">
        Content of Products
      </TabPane>
      <TabPane tab="Units" key="5">
        Content of Units
      </TabPane>
      <TabPane tab="Sales Invoivces" key="6">
        Content of Sales Invoivces
      </TabPane>
      <TabPane tab="Purchases Invoivces" key="7">
        Content of Purchases Invoivces
      </TabPane>
      <TabPane tab="Godown" key="8">
        Content of Godown
      </TabPane>
      <TabPane tab="Reports" key="9">
        Content of Reports
      </TabPane>
      <TabPane tab="Finances " key="10">
        Content of Finances
      </TabPane>
      <TabPane tab="Manage Users" key="11">
        Content of Manage Users
      </TabPane>
      <TabPane tab="Manage Business" key="12">
        Content of Manage Business
      </TabPane>
      <TabPane tab="Manage Settings" key="12">
        Content of Manage Settings
      </TabPane>
      <TabPane tab="Manage Account" key="13">
        Content of Manage Account
      </TabPane>
      <TabPane tab="Manage reminders" key="14">
        Content of Manage reminders
      </TabPane>
      <TabPane tab="Authentication" key="11">
        Content of Authentication
      </TabPane>
    </Tabs>
  );
};

export default DocumentationMain;
