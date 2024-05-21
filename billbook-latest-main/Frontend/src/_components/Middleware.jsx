import React, { useState, useEffect, useRef } from "react";
import GeneralInvoiceOne from "../invoices/generalInvoiceOne";
import GeneralInvoiceTwo from "../invoices/generalInvoiceTwo";
import GeneralInvoiceThree from "../invoices/generalInvoiceThree";
import GeneralInvoiceFour from "../invoices/generalInvoiceFour";
import GeneralInvoiceFive from "../invoices/generalInvoiceFive";
import axios from "axios";
import GeneralInvoicesix from "../invoices/generalInvoicesix";
import GeneralInvoiceseven from "../invoices/generalInvoiceseven";
import GeneralInvoiceeight from "../invoices/generalnvoiceeight";
import GeneralInvoicenine from "../invoices/generalInvoicenine";
import GeneralInvoiceten from "../invoices/generalInvoiceten";
import GeneralInvoice11 from "../invoices/generalInvoice11";
import GeneralInvoice12 from "../invoices/generalInvoice12";
import GeneralInvoice15 from "../invoices/generalInvoice15";
import GeneralInvoice13 from "../invoices/generalInvoice13";
import GeneralInvoice14 from "../invoices/generalInvoice14";
import GeneralInvoicesixteen from "../invoices/generalInvoicesixteen";
import GeneralInvoiceseventeen from "../invoices/generalInvoiceseventeen";
import GeneralInvoice18 from "../invoices/generalInvoice18";
import { backendUrl } from "../backendUrl";
import { useSelector } from "react-redux";

const Middleware = ({
  invoiceDetails,
  creditNotesDetails,
  salesReturnDetails,
  proformaDetails,
  quotationDetails,
  delChallenDetail,
  // purchaseDetails,
  // purchaseReturnDetails,
  // debitNotesDetails,
  // purchaseOrderDetails,
}) => {
  
 

  const [template, setTemplate] = useState("");

  const userData = useSelector(state=> state?.user?.userData);
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        if(userData?.data?.template){

          // const response = await axios.get(
          //   `${backendUrl}/api/templates/invoiceTemplatesfordetails/${userData?.data?._id}`
          // );
          // console.log("templateIIIIII:", response.data);
          setTemplate([{template: userData?.data?.template}]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTemplates();
  }, [userData]);
  console.log("template", template);

  return (
    <>
      {template[0]?.template === 1 ? (
        <GeneralInvoiceOne
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 2 ? (
        <GeneralInvoiceTwo
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 3 ? (
        <GeneralInvoiceThree
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 4 ? (
        <GeneralInvoiceFour
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 5 ? (
        <GeneralInvoiceFive
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 6 ? (
        <GeneralInvoicesix
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 7 ? (
        <GeneralInvoiceseven
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 8 ? (
        <GeneralInvoiceeight
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 9 ? (
        <GeneralInvoicenine
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 10 ? (
        <GeneralInvoiceten
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 11 ? (
        <GeneralInvoice11
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 12 ? (
        <GeneralInvoice12
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 13 ? (
        <GeneralInvoice13
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 14 ? (
        <GeneralInvoice14
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 15 ? (
        <GeneralInvoice15
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 16 ? (
        <GeneralInvoicesixteen
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 17 ? (
        <GeneralInvoiceseventeen
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : template[0]?.template === 18 ? (
        <GeneralInvoice18
          invoiceDetails={{
            ...invoiceDetails,
            ...creditNotesDetails,
            ...salesReturnDetails,
            ...proformaDetails,
            ...quotationDetails,
            ...delChallenDetail,
            // ...purchaseDetails,
            // ...purchaseReturnDetails,
            // ...debitNotesDetails,
            // ...purchaseOrderDetails,
          }}
        />
      ) : (
        <GeneralInvoiceOne 
        invoiceDetails={{
          ...invoiceDetails,
          ...creditNotesDetails,
          ...salesReturnDetails,
          ...proformaDetails,
          ...quotationDetails,
          ...delChallenDetail,
          // ...purchaseDetails,
          // ...purchaseReturnDetails,
          // ...debitNotesDetails,
          // ...purchaseOrderDetails,
        }}
        />
      )}
    </>
  );

};

export default Middleware;
