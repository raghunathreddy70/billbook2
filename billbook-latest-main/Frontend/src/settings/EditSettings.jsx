import React, { useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import EditProfile from './EditProfile';
import EditPreferences from './EditPreferences';

const { TabPane } = Tabs;

const EditSettings = ({ visible, onCancel }) => {

  const [activeTab, setActiveTab] = useState('tab1');
  const [open, setOpen] = useState(false)

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <>
      <button className='btn btn-primary me-2' type="primary" onClick={() => setOpen(true)}>
        Edit Profile
      </button>
      <Modal
        title="Edit Settings "
        className='EditSettings-modal'
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={null}
      >
        <Tabs
          tabPosition="left"
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          <TabPane tab="Profile Settings" key="tab1">
            <EditProfile />
          </TabPane>
          <TabPane tab="Preferences" key="tab2" >
            <EditPreferences />
          </TabPane>
        </Tabs>
      </Modal>

    </>
  );
};

export default EditSettings;