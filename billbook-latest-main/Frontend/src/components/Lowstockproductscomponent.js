// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../actions/lowstockproductactions";
// import { Modal } from "antd";

// const Lowstockproductscomponent = () => {
//   const dispatch = useDispatch();
//   const { products, loading } = useSelector((state) => state.persistReducer);
//   const hasLowStockProducts =
//     products.lowStockProducts && products.lowStockProducts.length > 0;

//   useEffect(() => {
//     // Fetch products and check stock on component mount
//     dispatch(fetchProducts());

//     // Set up a 10-minute interval to periodically check for low stock products
//     const checkLowStockInterval = setInterval(() => {
//       dispatch(fetchProducts());
//       //   setOpen(true);
//     }, 10 * 30 * 1000);

//     // Clean up the interval when the component unmounts
//     return () => {
//       clearInterval(checkLowStockInterval);
//     };
//   }, [dispatch]);

//   if (!hasLowStockProducts) {
//     // No low stock products, don't render the component
//     return null;
//   }

//   const [isCustomerDetailsModalOpen, setisCustomerDetailsModalOpen] = useState(true);

//   const openCustomerDetailsModal = () => {
//     setisCustomerDetailsModalOpen(true);
//   };

//   const closeCustomerDetailsModal = () => {
//     setisCustomerDetailsModalOpen(false);
//   };

//   return (
//     <>
//       <Modal
//         className="add-invoice-add-customer-page"
//         title="stocks are low Please Purchase It"
//         open={isCustomerDetailsModalOpen}
//         onCancel={closeCustomerDetailsModal}
//         footer={null}
//       >
//         <ul>
//           {products.lowStockProducts.map((product) => (
//             <li key={product._id}>
//               {product.itemName} - Stock: {product.openingStock}
//             </li>
//           ))}
//         </ul>
//       </Modal>
//     </>
//   );
// };

// export default Lowstockproductscomponent;



import React from 'react'

const Lowstockproductscomponent = () => {
  return (
    <div>Lowstockproductscomponent</div>
  )
}

export default Lowstockproductscomponent