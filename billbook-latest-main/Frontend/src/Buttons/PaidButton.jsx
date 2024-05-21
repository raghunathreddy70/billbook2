import React from 'react'

const PaidButton = () => {

    const getTextColor = (text) => {
        switch (text) {
          case "PAID":
            return "#389e0d";
          case "UNPAID":
            return "#d4380d";
          case "PARTIALLY PAID":
            return "#f9dc0b";
          default:
            return "white";
        }
      }
      const getBorderColor = (border) => {
        switch (border) {
          case "PAID":
            return "#389e0d";
          case "UNPAID":
            return "#d4380d";
          case "PARTIALLY PAID":
            return "#f9dc0b";
          default:
            return "white";
        }
      }
      const getStatusColor = (status) => {
        switch (status) {
          case "PAID":
            return "#d9f7be";
          case "UNPAID":
            return "#fff2e8";
          case "PARTIALLY PAID":
            return "#f9dc0b";
          default:
            return "white";
        }
      };
    const invoiceDetailsLink = (record) => {
        const { _id, invoiceDate, invoiceName, invoiceNumber, customerName } = record;
    
        const customerPhone = customerName?.phone;
        const customerGSTNo = customerName?.GSTNo;
        const email = customerName?.email;
        const billingAddress = customerName?.billingAddress || {};
        const { addressLine1, addressLine2, country, state, city, pincode } = billingAddress;
    
        const link = `/invoice-details/${_id}?` +
          `date=${invoiceDate}` +
          `&Name=${invoiceName}` +
          `&Number=${invoiceNumber}` +
          `&name=${customerName?.name}` +
          `&phone=${customerPhone}` +
          `&GSTNo=${customerGSTNo}` +
          `&email=${email}` +
          `&addressLine1=${addressLine1}` +
          `&addressLine2=${addressLine2}` +
          `&country=${country}` +
          `&state=${state}` +
          `&city=${city}` +
          `&pincode=${pincode}`;
    
        return link;
      };
  return (
    <>
     <span
          style={{
            backgroundColor: getStatusColor(text),
            color: getTextColor(text),
            border: `1px solid ${getBorderColor(text)}`,
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          <Link to={invoiceDetailsLink(record)}>{text}</Link>

        </span>
    </>
  )
}

export default PaidButton