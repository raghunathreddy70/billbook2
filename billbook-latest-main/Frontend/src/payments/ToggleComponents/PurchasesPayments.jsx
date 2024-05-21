import React, { useState } from "react";
import AllPurchases from "../PurchasesToggleComponents/AllPurchases";
import PaidPurchases from "../PurchasesToggleComponents/PaidPurchases";
import OverDuePurchases from "../PurchasesToggleComponents/OverDuePurchases";
import OutStandingPurchases from "../PurchasesToggleComponents/OutStandingPurchases";
import PurchaseInvoice from "../../purchase/PurchaseInvoice";

const PurchasesPayments = () => {
    const [active, setActive] = useState(0);

    return (
        <div className="w-full">
            <PurchaseInvoice active={true} />
            {/* {active === 0 && <AllPurchases active={active} setActive={setActive} />}
            {active === 1 && <PaidPurchases active={active} setActive={setActive} />}
            {active === 2 && <OverDuePurchases active={active} setActive={setActive} />}
            {active === 3 && <OutStandingPurchases active={active} setActive={setActive} />} */}
            {/* {active === 1 && <PaidInvoices active={active} setActive={setActive} />}
            {active === 2 && <OutStanding active={active} setActive={setActive} />}
            {active === 3 && <OverDue active={active} setActive={setActive} />} */}

        </div>
    );

}

export default PurchasesPayments