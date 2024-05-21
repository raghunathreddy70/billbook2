const { validationResult } = require('express-validator');
// const Role = require('../models/Role'); 
const BusinessSchema = require("../models/businessModel")



const createUserRole = async (req, res) => {

  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  
  const { role } = req.body;
  const businessId = req.params.bid;
  
  if(role.trim().length === 0 ){
    return res.status(400).json({msg: "Empty String Passed"})
  }

  try {
    const business = await BusinessSchema.findById(businessId)


    const existingRoles = business?.roleAccess || {}
    console.log("existingRoles",existingRoles)

    let count = Object.keys(existingRoles).length || 0;
    let obj = {...existingRoles}

    function addItem(item) {
      obj[count++] = item
    }
    addItem(
      { [role] :[
        {
          "customers-create": false,
          "customers-read": false,
          "customers-update": false,
          "customers-delete": false,
        },
        {
          "vendors-create": false,
          "vendors-read": false,
          "vendors-update": false,
          "vendors-delete": false,
        },
        {
          "inventory-create": false,
          "inventory-read": false,
          "inventory-update": false,
          "inventory-delete": false,
        },
        {
          "sales-create": false,
          "sales-read": false,
          "sales-update": false,
          "sales-delete": false,
        },
        {
          "purchases-create": false,
          "purchases-read": false,
          "purchases-update": false,
          "purchases-delete": false,
        },
        {
          "godown-create": false,
          "godown-read": false,
          "godown-update": false,
          "godown-delete": false,
        },
        {
          "reports-create": false,
          "reports-read": false,
          "reports-update": false,
          "reports-delete": false,
        },
        {
          "recovery-create": false,
          "recovery-read": false,
          "recovery-update": false,
          "recovery-delete": false,
        },
        {
          "finance-create": false,
          "finance-read": false,
          "finance-update": false,
          "finance-delete": false,
        },
        {
          "expenses-create": false,
          "expenses-read": false,
          "expenses-update": false,
          "expenses-delete": false,
        },
      ]})

   
   
    await BusinessSchema.findByIdAndUpdate(businessId, { roleAccess: obj })

    res.status(201).json({ msg: count-1 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateUserRole = async (req, res) => {

  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  
  const { editRoleKey, editRoleText } = req.body;
  const businessId = req.params.bid;
  
  if(editRoleText.trim().length === 0 ){
    return res.status(400).json({msg: "Empty String Passed"})
  }



  
  try {

    const business = await BusinessSchema.findById(businessId)


    const existingRoles = business?.roleAccess || {}
    console.log("existingRoles",existingRoles)

    let count = Object.keys(existingRoles).length || 0;
    let obj = {...existingRoles}

    console.log("Object is",obj[editRoleKey])

    const roleAccess = obj[editRoleKey];

    function updateKeyName(roleAccessData, oldKeyName, newKeyName) {
      if (!roleAccessData.hasOwnProperty(oldKeyName)) {
        return roleAccessData;
      }
      const updatedRoleAccessData = {
        [newKeyName]: roleAccessData[oldKeyName],
        ...roleAccessData
      };
      delete updatedRoleAccessData[oldKeyName];
      return updatedRoleAccessData;
    }
    
    const updatedRoleAccess = updateKeyName(roleAccess, Object.keys(roleAccess), editRoleText);


    obj = {...existingRoles,[editRoleKey]:updatedRoleAccess}


       
    await BusinessSchema.findByIdAndUpdate(businessId, { roleAccess: obj })

    res.status(201).json({ data: editRoleKey  });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const updateRolePermission = async (req, res) => {
  const businessId = req.params.bid;
  const { RoleId, Role, tableData } = req.body;



  try {
    const business = await BusinessSchema.findById(businessId);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const existingRoles = business.roleAccess || {};

    const updatedRoles = { ...existingRoles, [RoleId]: { [Role]: tableData } };

    await BusinessSchema.findByIdAndUpdate(businessId, { roleAccess: updatedRoles });

    res.status(200).json({ message: 'Role permission updated successfully' });
  } catch (error) {
    console.error('Error updating role permission:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


module.exports = {
  createUserRole,
  updateUserRole,
  updateRolePermission
};
