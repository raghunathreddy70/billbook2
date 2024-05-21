import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Switch } from "react-router-dom";
// import Indextwo from "./dashboard/Indextwo";
const Indextwo = lazy(() => import("./dashboard/Indextwo"));
const Indexthree = lazy(() => import("./dashboard/Indexthree"));
const Indexfour = lazy(() => import("./dashboard/Indexfour"));
const Indexfive = lazy(() => import("./dashboard/Indexfive"));

// import Customers from "./customers/Index";
const Customers = lazy(() => import('./customers/Index'));
const AddCustomer = lazy(() => import("./customers/AddCustomer"));
const EditCustomer = lazy(() => import("./customers/EditCustomer"));
const Expenses = lazy(() => import("./expenses/Index"));
const AddExpenses = lazy(() => import("./expenses/AddExpenses"));
const EditExpenses = lazy(() => import("./expenses/EditExpenses"));
const Estimates = lazy(() => import("./estimates/Index"));
const AddEstimate = lazy(() => import("./estimates/AddEstimate"));
const EditEstimate = lazy(() => import("./estimates/EditEstimate"));
const ViewEstimate = lazy(() => import("./estimates/ViewEstimate"));
const Invoices = lazy(() => import("./invoices/Index"));
const Invoicedetails = lazy(() => import("./invoices/Invoicedetails"));
const Invoicesettings = lazy(() => import("./invoices/Invoicesettings"));
const Invoicegrid = lazy(() => import("./invoices/Invoicegrid"));
const Taxsettings = lazy(() => import("./invoices/Taxsettings"));
const Invoicerecurring = lazy(() => import("./invoices/Invoicerecurring"));
const Invoicecancelled = lazy(() => import("./invoices/Invoicecancelled"));
const Invoicepaid = lazy(() => import("./invoices/Invoicepaid"));
const Invoiceoverdue = lazy(() => import("./invoices/Invoiceoverdue"));
const Banksettings = lazy(() => import("./invoices/Banksettings"));
const ViewInvoice = lazy(() => import("./invoices/ViewInvoice"));
const AddInvoice = lazy(() => import("./invoices/AddInvoice"));
const EditInvoice = lazy(() => import("./invoices/EditInvoice"));
const Invoicedraft = lazy(() => import("./invoices/Invoicedraft"));
const Payments = lazy(() => import("./payments/Index"));
const AddPayments = lazy(() => import("./payments/AddPayments"));
const ProfileSettings = lazy(() => import("./settings/Profile"));
const Preferences = lazy(() => import("./settings/Preferences"));
const TaxTypes = lazy(() => import("./settings/TaxTypes"));
const ExpenseCategory = lazy(() => import("./settings/ExpenseCategory"));
const Notifications = lazy(() => import("./settings/Notifications"));
const ChangePassword = lazy(() => import("./settings/ChangePassword"));
const Chat = lazy(() => import("./application/Chat"));
const Calendar = lazy(() => import("./application/Calendar"));
const Inbox = lazy(() => import("./application/Inbox"));
const Profile = lazy(() => import("./profile/Index"));
const Login = lazy(() => import("./authentication/Login"));
const Register = lazy(() => import("./authentication/Register"));
const ForgotPassword = lazy(() => import("./authentication/ForgotPassword"));
const LockScreen = lazy(() => import("./authentication/LockScreen"));
const Page404 = lazy(() => import("./errorpages/404"));
const Page500 = lazy(() => import("./errorpages/500"));
const BlankPage = lazy(() => import("./blankpage/Index"));
const Components = lazy(() => import("./components/Index"));
const VectorMaps = lazy(() => import("./vectormaps/Index"));
const BasicTables = lazy(() => import("./tables/BasicTables"));
const DataTables = lazy(() => import("./tables/DataTables"));
const SalesReport = lazy(() => import("./reports/salesreport"));
const ExpenseReport = lazy(() => import("./reports/expense"));
const ProfitlossReport = lazy(() => import("./reports/profitloss"));
const Taxreport = lazy(() => import("./reports/taxreport"));
const StickySidebar = lazy(() => import("./layouts/StickySidebar"));
// const config = lazy(() => import("config"));
import config from "config";
const Invoiceone = lazy(() => import("./invoices/Invoiceone"));
const InvoiceTwo = lazy(() => import("./invoices/InvoiceTwo"));
const InvoiceThree = lazy(() => import("./invoices/InvoiceThree"));
const InvoiceFour = lazy(() => import("./invoices/InvoiceFour"));
const InvoiceFive = lazy(() => import("./invoices/InvoiceFive"));
const BusTicket = lazy(() => import("./invoices/BusTicket"));
const CarBookingInvoice = lazy(() => import("./invoices/CarBookingInvoice"));
const CoffeeShop = lazy(() => import("./invoices/CoffeeShop"));
const CashRecepitOne = lazy(() => import("./invoices/CashRecepit"));
const CashRecepitTwo = lazy(() => import("./invoices/CashRecepitTwo"));
const CashRecepitThree = lazy(() => import("./invoices/CashRecepitThree"));
const CashRecepitFour = lazy(() => import("./invoices/CashRecepitFour"));
const AddProduct = lazy(() => import("./products/addProduct"));
const CustomerDetails = lazy(() => import("./customers/customerDetails"));
const CustomerDetailsPaid = lazy(() => import("./customers/customerDetailsPaid"));
const CustomerDetailsCancel = lazy(() => import("./customers/customerDetailsCancel"));
const Vendors = lazy(() => import("./vendors"));
const AddLedger = lazy(() => import("./vendors/addLedger"));
const ProductList = lazy(() => import("./products/productList"));
const EditProduct = lazy(() => import("./products/editProduct"));
const Category = lazy(() => import("./products/category"));
const Units = lazy(() => import("./products/units"));
const Inventory = lazy(() => import("./inventory"));
const ActiveCustomers = lazy(() => import("./customers/activeCustomers"));
const DeactiveCustomers = lazy(() => import("./customers/deactivateCustomers"));
const InvoiceList = lazy(() => import("./invoices/invoiceList"));
const InvoiceOverdue = lazy(() => import("./invoices/Invoiceoverdue"));
const InvoicePaid = lazy(() => import("./invoices/Invoicepaid"));
const InvoiceTemplate = lazy(() => import("./invoices/invoiceTemplate"));
const GeneralInvoiceOne = lazy(() => import("./invoices/generalInvoiceOne"));
const GeneralInvoiceTwo = lazy(() => import("./invoices/generalInvoiceTwo"));
const GeneralInvoiceFour = lazy(() => import("./invoices/generalInvoiceFour"));
const GeneralInvoiceThree = lazy(() => import("./invoices/generalInvoiceThree"));
const GeneralInvoiceFive = lazy(() => import("./invoices/generalInvoiceFive"));
const DomainHosting = lazy(() => import("./invoices/domainHosting"));
const Ecommerce = lazy(() => import("./invoices/ecommerce"));
const FitnessCenter = lazy(() => import("./invoices/fitnessCenter"));
const TrainTicketBooking = lazy(() => import("./invoices/trainTicketBooking"));
const FlightBookingInvoice = lazy(() => import("./invoices/flightBookingInvoice"));
const HotelBooking = lazy(() => import("./invoices/hotelBooking"));
const InternetBooking = lazy(() => import("./invoices/internetBooking"));
const Medical = lazy(() => import("./invoices/medical"));
const MoneyExchange = lazy(() => import("./invoices/moneyExchange"));
const MovieTicketBooking = lazy(() => import("./invoices/movieTicketBooking"));
const RestuarentBilling = lazy(() => import("./invoices/restuarentBilling"));
const StudentBilling = lazy(() => import("./invoices/studentBilling"));
const RecurringInvoice = lazy(() => import("./recurring"));
const RecurringPaid = lazy(() => import("./recurring/recurringPaid"));
const RecurringPending = lazy(() => import("./recurring/recurringPending"));
const RecurringOverdue = lazy(() => import("./recurring/recurringOverdue"));
const RecurringDraft = lazy(() => import("./recurring/recurringDraft"));
const RecurringCancelled = lazy(() => import("./recurring/recurringCancelled"));
const Recurring = lazy(() => import("./recurring/recurring"));
const CreditNotes = lazy(() => import("./creditNotes"));
const CreditPending = lazy(() => import("./creditNotes/creditPending"));
const CreditOverdue = lazy(() => import("./creditNotes/creditOverdue"));
const CreditDraft = lazy(() => import("./creditNotes/creditDraft"));
const CreditRecurring = lazy(() => import("./creditNotes/creditRecurring"));
const CreditCancelled = lazy(() => import("./creditNotes/creditCancelled"));
const AddCredit = lazy(() => import("./creditNotes/addCredit"));
const CreditDetails = lazy(() => import("./creditNotes/creditDetails"));
const Purchases = lazy(() => import("./purchase"));
const AddPurchases = lazy(() => import("./purchase/addPurchases"));
const EditPurchase = lazy(() => import("./purchase/editPurchase"));
const PurchaseDetails = lazy(() => import("./purchase/purchaseDetails"));
const PurchaseOrders = lazy(() => import("./purchaseOrders"));
const DebitNotes = lazy(() => import("./debitNotes"));
const Quotations = lazy(() => import("./quatations"));
const AddQuotations = lazy(() => import("./quatations/addQuotations"));
const EditQuotations = lazy(() => import("./quatations/editQuotations"));
const DeliveryChallans = lazy(() => import("./deliveryChallans"));
const EditChallans = lazy(() => import("./deliveryChallans/editChallans"));
const AddChallans = lazy(() => import("./deliveryChallans/addChallans"));
const PaymentSummary = lazy(() => import("./paymentSummary"));
const AddUser = lazy(() => import("./manageUser"));
const User = lazy(() => import("./manageUser/user"));
const Users = lazy(() => import("./manageUser/user"));
const EditUser = lazy(() => import("./manageUser/editUser"));
const RolesPermission = lazy(() => import("./rolePermission"));
const Permission = lazy(() => import("./rolePermission/permission"));
const DeleteAccount = lazy(() => import("./deleteAccount"));
const MembershipPlan = lazy(() => import("./membership"));
const MembershipAddons = lazy(() => import("./membership/membershipAddons"));
const Subscribers = lazy(() => import("./membership/subscribers"));
const Transaction = lazy(() => import("./membership/transaction"));
const AddPage = lazy(() => import("./pages"));
const Pages = lazy(() => import("./pages/page"));
const AllBlogs = lazy(() => import("./blog"));
const InactiveBlog = lazy(() => import("./blog/inactiveBlog"));
const AddBlog = lazy(() => import("./blog/addBlog"));
const Categories = lazy(() => import("./blog/categories"));
const AddCategories = lazy(() => import("./blog/addCategories"));
const BlogComments = lazy(() => import("./blog/blogComments"));
const Countries = lazy(() => import("./location"));
const States = lazy(() => import("./location/states"));
const Cities = lazy(() => import("./location/cities"));
const Testimonials = lazy(() => import("./testimonials"));
const AddTestimonials = lazy(() => import("./testimonials/addTestimonials"));
const EditTestimonials = lazy(() => import("./testimonials/editTestimonials"));
const Faq = lazy(() => import("./faq"));
const Tickets = lazy(() => import("./tickets"));
const TicketPending = lazy(() => import("./tickets/ticketPending"));
const TicketOverdue = lazy(() => import("./tickets/ticketOverdue"));
const TicketDraft = lazy(() => import("./tickets/ticketDraft"));
const TicketRecurring = lazy(() => import("./tickets/ticketRecurring"));
const TicketCancelled = lazy(() => import("./tickets/ticketCancelled"));
const TicketList = lazy(() => import("./tickets/ticketlist"));
const TicketListPending = lazy(() => import("./tickets/ticketlist/ticketListPending"));
const TicketListOverdue = lazy(() => import("./tickets/ticketlist/ticketListOverdue"));
const TicketListDraft = lazy(() => import("./tickets/ticketlist/ticketListdraft"));
const TicketListRecurring = lazy(() => import("./tickets/ticketlist/ticketListRecurring"));
const TicketListCancelled = lazy(() => import("./tickets/ticketlist/ticketListCancelled"));
const TicketKanban = lazy(() => import("./tickets/ticketKanban"));
const TicketDetails = lazy(() => import("./tickets/ticketOverview"));
const { FullScreen } = lazy(() => import("react-full-screen"));
const AddMembership = lazy(() => import("./membership/addMembership"));
const FontAwesome = lazy(() => import("./icons/font-awesome"));
const Feather = lazy(() => import("./icons/feather"));
const IconicIcon = lazy(() => import("./icons/iconic"));
const MaterialIcon = lazy(() => import("./icons/material"));
const MaterialIcons = lazy(() => import("./icons/material"));
const Pe7 = lazy(() => import("./icons/pe7"));
const SimpleLine = lazy(() => import("./icons/simpleLine"));
const Themify = lazy(() => import("./icons/themify"));
const apexCharts = lazy(() => import("./charts/apexcharts"));
const ChartJs = lazy(() => import("./charts/chartjs"));
const MorrisCharts = lazy(() => import("./charts/morrisChart"));
const FlotCharts = lazy(() => import("./charts/floatjs"));
const PeityCharts = lazy(() => import("./charts/peityCharts"));
const C3Charts = lazy(() => import("./charts/c3Charts"));
const Flags = lazy(() => import("./icons/flags"));
const WeatherIcons = lazy(() => import("./icons/weather"));
const Accordions = lazy(() => import("./baseUi/accordions"));
const Alert = lazy(() => import("./baseUi/alerts"));
const Avatar = lazy(() => import("./baseUi/avatar"));
const Badges = lazy(() => import("./baseUi/badges"));
const Buttons = lazy(() => import("./baseUi/buttons"));
const Buttongroup = lazy(() => import("./baseUi/button-group"));
const Breadcumbs = lazy(() => import("./baseUi/breadcrumbs"));
const Cards = lazy(() => import("./baseUi/cards"));
const Carousel = lazy(() => import("./baseUi/carousel"));
const Dropdowns = lazy(() => import("./baseUi/dropdowns"));
const Grid = lazy(() => import("./baseUi/grid"));
const Images = lazy(() => import("./baseUi/images"));
const Lightbox = lazy(() => import("./baseUi/lightbox"));
const Media = lazy(() => import("./baseUi/media"));
const Modals = lazy(() => import("./baseUi/modals"));
const Offcanvas = lazy(() => import("./baseUi/offcanvas"));
const Pagination = lazy(() => import("./baseUi/pagination"));
const Popover = lazy(() => import("./baseUi/popover"));
const Progress = lazy(() => import("./baseUi/progress"));
const Placeholder = lazy(() => import("./baseUi/placeholders"));
const Rangeslides = lazy(() => import("./baseUi/rangeslider"));
const Spinners = lazy(() => import("./baseUi/spinners"));
const Sweetalerts = lazy(() => import("./baseUi/sweeetalerts"));
const Tap = lazy(() => import("./baseUi/tab"));
const Toasts = lazy(() => import("./baseUi/toasts"));
const Tooltip = lazy(() => import("./baseUi/tooltip"));
const Typography = lazy(() => import("./baseUi/typography"));
const Videos = lazy(() => import("./baseUi/videos"));
const Error404 = lazy(() => import("./error404"));
const Fileupload = lazy(() => import("./forms/File-upload"));
const Formselect2 = lazy(() => import("./forms/form-select2"));
const BasicInputs = lazy(() => import("./forms/basic-inputs"));
const FormInputGroups = lazy(() => import("./forms/input-groups"));
const HorizontalForm = lazy(() => import("./forms/horizontal-form"));
const VerticalForm = lazy(() => import("./forms/vertical-form"));
const FormMask = lazy(() => import("./forms/FormMask"));
const FormValidation = lazy(() => import("./forms/FormValidation"));
const DeleteAccounts = lazy(() => import("./settings/deleteAccount"));
const Ribbon = lazy(() => import("./elements/ribbon"));
const { Clipboard } = lazy(() => import("./elements/clipboard"));
const Rating = lazy(() => import("./elements/rating"));
const Texteditor = lazy(() => import("./elements/texteditor"));
const Counter = lazy(() => import("./elements/counter"));
const Scrollbar = lazy(() => import("./elements/scrollbar"));
const Notification = lazy(() => import("./elements/notification"));
const Stickynote = lazy(() => import("./elements/stickynote"));
const Timeline = lazy(() => import("./elements/timeline"));
const Horizontaltimeline = lazy(() => import("./elements/horizontaltimeline"));
const Formwizard = lazy(() => import("./elements/formwizard"));
const ContactMessage = lazy(() => import("./contactMessage"));
const DragDrop = lazy(() => import("./elements/drag&drop"));
const TypiconIcons = lazy(() => import("./icons/typicon"));
const GstCalculator = lazy(() => import("./Gst/GstCalculator"));
const GstList = lazy(() => import("./Gst/GstList"));
const CurrencyList = lazy(() => import("./currency/CurrencyList"));
const AddCurrency = lazy(() => import("./currency/AddCurrency"));
const MyComponent = lazy(() => import("./currency/sample"));
const InvoiceOutstanding = lazy(() => import("./invoices/InvoiceOutstanding"));
const CreateGodown = lazy(() => import("./inventory/CreateGodown"));
const EditGodown = lazy(() => import("./inventory/EditGodown"));
const GodownList = lazy(() => import("./inventory/GodownList"));
const StockList = lazy(() => import("./inventory/StockList"));
const AvailableStocks = lazy(() => import("./inventory/AvailableStocks"));
const OutOfStock = lazy(() => import("./inventory/OutOfStock"));
const AccountProfileSettings = lazy(() => import("./settings/AccountProfileSettings"));
const ManageBusinessProfileSettings = lazy(() => import("./settings/ManageBusinessProfileSettings"));
const InvoiceSettingsProfileSettings = lazy(() => import("./settings/InvoiceSettingsProfileSettings"));
const RemindersProfileSettings = lazy(() => import("./settings/RemindersProfileSettings"));
const ItemDetailsProduct = lazy(() => import("./products/ItemDetailsProduct"));
const StockDetailsProducts = lazy(() => import("./products/StockDetailsProducts"));
const PartyWiseReportProduct = lazy(() => import("./products/PartyWiseReportProduct"));
const GodownProducts = lazy(() => import("./products/GodownProducts"));
const CashBank = lazy(() => import("./expenses/CashBank"));
const QuotationDetails = lazy(() => import("./quatations/QuotationDetails"));
const EditCreditnotes = lazy(() => import("./creditNotes/editCreditnotes"));
const DelChallenDetails = lazy(() => import("./deliveryChallans/delChallenDetails"));
const PaymentOut = lazy(() => import("./payments/PaymentOut"));
const PurchaseReturn = lazy(() => import("./purchase/PurchaseReturn"));
const PurchaseInvoice = lazy(() => import("./purchase/PurchaseInvoice"));
const PaymentIn = lazy(() => import("./payments/PaymentIn"));
const AddPaymentIn = lazy(() => import("./payments/AddPaymentIn"));
const AllPurchases = lazy(() => import("./purchase/AllPurchases"));
const PaidPurchases = lazy(() => import("./purchase/PaidPurchases"));
const CancelledPurchases = lazy(() => import("./purchase/CancelledPurchases"));
const OverduePurchases = lazy(() => import("./purchase/OverduePurchases"));
const OutstandingPurchases = lazy(() => import("./purchase/OutstandingPurchases"));
const DraftPurchases = lazy(() => import("./purchase/DraftPurchases"));
const RecurringPurchases = lazy(() => import("./purchase/RecurringPurchases"));

// import DeletedPurchases from "./purchase/DeletedPurchases";
const ReportsDashBoardPage = lazy(() => import("./pages/Reports/ReportsDashBoardPage"));
const BalanceSheetPage = lazy(() => import("./pages/Reports/Individuals/BalanceSheetPage"));
const ProfitAndLossPage = lazy(() => import("./pages/Reports/Individuals/ProfitAndLossPage"));
const SalesSummaryPage = lazy(() => import("./pages/Reports/Individuals/SalesSummaryPage"));
const ItemReportPartyPage = lazy(() => import("./pages/Reports/Individuals/ItemReportPartyPage"));
const ItemSaleAndPurchaasePage = lazy(() => import("./pages/Reports/Individuals/ItemSaleAndPurchaasePage"));
const LowStockPage = lazy(() => import("./pages/Reports/Individuals/LowStockPage"));
const RateListPage = lazy(() => import("./pages/Reports/Individuals/RateListPage"));
const StockDetailPage = lazy(() => import("./pages/Reports/Individuals/StockDetailPage"));
const StockSummaryPage = lazy(() => import("./pages/Reports/Individuals/StockSummaryPage"));
const ReceivableAgencyPage = lazy(() => import("./pages/Reports/Individuals/ReceivableAgencyPage"));
const PartyReportItemPage = lazy(() => import("./pages/Reports/Individuals/PartyReportItemPage"));
const PartyStatementPage = lazy(() => import("./pages/Reports/Individuals/CustomerStatementPage"));
const PartyOutstandingPage = lazy(() => import("./pages/Reports/Individuals/PartyOutstandingPage"));
const SalesSummaryCategoryPage = lazy(() => import("./pages/Reports/Individuals/SalesSummaryCategoryPage"));
const ProformaInvoice = lazy(() => import("./invoices/ProformaInvoice"));
const AddProforma = lazy(() => import("./invoices/AddProforma"));
const AddDebitNotes = lazy(() => import("./debitNotes/AddDebitNotes"));
const DocumentationMain = lazy(() => import("./documentation/documents/DocumentMain"));
const ItemBatchReportPage = lazy(() => import("./pages/Reports/Individuals/ItemBatchReportPage"));
const PurchasesList = lazy(() => import("./purchase/PurchasesList"));
const AddPurchaseList = lazy(() => import("./purchase/AddPurchaseList"));
const FinanceAcPaymentsPage = lazy(() => import("./pages/Payments/FinanceAcPaymentsPage"));
const Sample = lazy(() => import("./customers/Sample"));
const EditProforma = lazy(() => import("./invoices/EditProforma"));
const PerformaDetails = lazy(() => import("./invoices/PerformaDetails"));
const DeletedInvoice = lazy(() => import("./purchase/DeletedInvoice"));
const RevevoredSales = lazy(() => import("./recovery/Sales"));
const PurchaseRecovery = lazy(() => import("./recovery/Purchases"));
const ExpensesRecovery = lazy(() => import("./recovery/ExpensesRecovery"));
const CreatePurchaseReturn = lazy(() => import("./purchase/CreatePurchaseReturn"));
const EditPurchaseReturn = lazy(() => import("./purchase/EditPurchaseReturn"));
const AddPurchaseOrder = lazy(() => import("./purchaseOrders/AddPurchaseOrder"));
const EditPurchaseOrder = lazy(() => import("./purchaseOrders/EditPurchaseOrder"));
const EditDebitNotes = lazy(() => import("./debitNotes/EditDebitNotes"));
const PurchaseReturnView = lazy(() => import("./purchase/PurchaseReturnView"));
const DebitNotesView = lazy(() => import("./debitNotes/DebitNotesView"));
const PurchaseOrderView = lazy(() => import("./purchaseOrders/PurchaseOrderView"));
const VendorDetails = lazy(() => import("./vendors/VendorDetails"));
const ViewExpenses = lazy(() => import("./expenses/ViewExpenses"));
const CreditPaid = lazy(() => import("./creditNotes/CreditPaid"));
const ExpenseProductList = lazy(() => import("./expenses/ExpenseProductList"));
const Country = lazy(() => import("./countries"));
const StateForm = lazy(() => import("./countries/State"));
const CityForm = lazy(() => import("./countries/City"));
const Parties = lazy(() => import("./expenses/Parties"));
const SalesReturn = lazy(() => import("./salesReturn/SalesReturn"));
const AddSalesReturn = lazy(() => import("./salesReturn/AddSalesReturn"));
const SalesReturnView = lazy(() => import("./salesReturn/SalesReturnView"));
const SalesReturnEdit = lazy(() => import("./salesReturn/SalesReturnEdit"));
const PaymentInView = lazy(() => import("./payments/PaymentInView"));
const PaymentoutView = lazy(() => import("./payments/PaymentoutView"));
const ItemReportPartyVendor = lazy(() => import("./pages/Reports/Individuals/ItemReportPartyVendor"));
const CustomerStatementPage = lazy(() => import("./pages/Reports/Individuals/CustomerStatementPage"));
const VendorStatementLedger = lazy(() => import("./_components/Reports/IndividualReports/VendorStatementLedger"));
const VendorsStatementPage = lazy(() => import("./pages/Reports/Individuals/VendorsStatementPage"));
const PurchasesSummaryCategoryPage = lazy(() => import("./pages/Reports/Individuals/PurchasesSummaryCategoryPage"));
const PartyReportItemVendor = lazy(() => import("./pages/Reports/Individuals/PartyReportItemVendor"));
const ExpensesCategoryReport = lazy(() => import("./pages/Reports/Individuals/ExpensesCategoryReport"));
const ExpensesTransitionReport = lazy(() => import("./pages/Reports/Individuals/ExpensesTransitionReport"));

const CashAndBankPaymentIn = lazy(() => import("./pages/Reports/Individuals/CashAndBankPaymentIn"));
const CashAndBankPaymentOut = lazy(() => import("./pages/Reports/Individuals/CashAndBankPaymentOut"));
const ViewOnlyInvoice = lazy(() => import("./invoices/ViewOnlyInvoice"));
const ViewCreditNoteInvoice = lazy(() => import("./creditNotes/ViewCreditNoteInvoice"));
const ViewSalesInvoice = lazy(() => import("./salesReturn/ViewSalesInvoice"));
const ViewOnlyProformaInvoice = lazy(() => import("./invoices/ViewOnlyProformaInvoice"));
const ViewPurchaseInvoice = lazy(() => import("./purchase/ViewPurchaseInvoice"));
const ViewPurchaseReturnInvoice = lazy(() => import("./purchase/ViewPurchaseReturnInvoice"));
const ViewDebitNotesInvoice = lazy(() => import("./debitNotes/ViewDebitNotesInvoice"));
const ViewPaymentInInvoice = lazy(() => import("./payments/ViewPaymentInInvoice"));
const ViewPaymentOutInvoice = lazy(() => import("./payments/ViewPaymentOutInvoice"));
const Middleware = lazy(() => import("./_components/Middleware"));
const GeneralInvoicesix = lazy(() => import("./invoices/generalInvoicesix"));
const GeneralInvoiceseven = lazy(() => import("./invoices/generalInvoiceseven"));
const GeneralInvoiceeight = lazy(() => import("./invoices/generalnvoiceeight"));
const GeneralInvoicenine = lazy(() => import("./invoices/generalInvoicenine"));
const GeneralInvoiceten = lazy(() => import("./invoices/generalInvoiceten"));
const GeneralInvoice11 = lazy(() => import("./invoices/generalInvoice11"));
const GeneralInvoice12 = lazy(() => import("./invoices/generalInvoice12"));
const GeneralInvoice13 = lazy(() => import("./invoices/generalInvoice13"));
const GeneralInvoice14 = lazy(() => import("./invoices/generalInvoice14"));
const GeneralInvoice15 = lazy(() => import("./invoices/generalInvoice15"));
const GeneralInvoicesixteen = lazy(() => import("./invoices/generalInvoicesixteen"));
const GeneralInvoiceseventeen = lazy(() => import("./invoices/generalInvoiceseventeen"));
const GeneralInvoice18 = lazy(() => import("./invoices/generalInvoice18"));
const Number = lazy(() => import("./pages/PhoneNumber.jsx/Number"));
const LocationSelector = lazy(() => import("./countries/LocationSelector"));
import { useDispatch } from "react-redux";
import { VerifyUser } from "./reducers/userReducer"
import { ImPriceTags } from "react-icons/im";
// import Sidebar from "./layouts/Sidebar";
import SideBar from "./components/Sidebar/SideBar";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Dashboard from "./dashboard/Index";
import Header from "./layouts/Header";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { MdAccountBalance, MdArrowBack, MdCurrencyExchange, MdDashboard, MdInventory, MdOutlineSettings } from "react-icons/md";
import { FaBusinessTime, FaCartPlus, FaMoneyCheck, FaRecycle, FaRegClock, FaStoreAlt, FaUserCog, FaUserFriends, FaUsers } from "react-icons/fa";
import { PiNotePencilBold } from "react-icons/pi";
import { RiAccountPinCircleFill, RiLogoutBoxRLine } from "react-icons/ri";
import Godowns from "./inventory/Godowns";
import PricingPlan1 from "./PricingPlan/PricingPlan1";
import { IoMdPricetags } from "react-icons/io";
import SettingsSidebar from "./components/Sidebar/SettingsSidebar";

// import Dashboard3 from "./dashboard/Dashboard3";
const Dashboard3 = lazy(() => import("./dashboard/Dashboard3"));


const { Sider } = Layout;

const items = [
  { key: '/index', icon: <MdDashboard />, label: 'Dashboard' },
  { key: '/customers', icon: <FaUsers />, label: 'Customers' },
  { key: '/vendors', icon: <FaUserFriends />, label: 'Vendors' },
  {
    key: 'sub1',
    label: 'Inventory',
    icon: <MdInventory />,
    children: [
      { key: '/product-list', label: 'Products' },
      { key: '/category-page', label: 'Category' },
      { key: '/units', label: 'Units' }
    ],
  },
  {
    key: 'sub2',
    label: 'Sales',
    icon: <MdCurrencyExchange />,
    children: [
      { key: '/invoice-list', label: 'Invoices' },
      { key: '/invoice-template', label: 'Invoices Template' },
      { key: '/credit-notes', label: 'Credit Notes' },
      { key: '/sales-return', label: ' Sales Return' },
      { key: '/payment-in', label: 'Payment In' },
      { key: '/proforma-invoice', label: 'Proforma Invoice' },
      { key: '/quotations', label: 'Quotations' },
      { key: '/delivery-challans', label: 'Delivery Challans' },
    ],
  },
  {
    key: 'sub3',
    label: 'Purchases',
    icon: <FaCartPlus />,
    children: [
      { key: '/purchase-invoice', label: 'Purchase Invoice' },
      { key: '/purchase-orders', label: 'Purchase Orders' },
    ],
  },
  { key: '/expenses', icon: <FaMoneyCheck />, label: 'Expenses' },
  {
    key: 'sub4',
    label: 'Godown',
    icon: <FaStoreAlt />,
    children: [
      { key: '/godown-view', label: 'godown-list' },
    ],
  },
  { key: '/reports', icon: <PiNotePencilBold />, label: 'reports' },
  { key: '/pricingplans', icon: <ImPriceTags />, label: 'Pricing Plan' },
  { key: '/sales-recovery', icon: <FaRecycle />, label: 'Sales Recovery' },
  {
    key: 'sub5',
    label: 'Finance & Accounts',
    icon: <MdAccountBalance />,
    children: [
      // { key: '/payments', label: 'Payment' },
      { key: '/gst-list', label: 'GST' },
      { key: '/currency-list', label: 'Currency' },
      { key: '/cash-bank', label: 'Bank Details' },
    ],
  },
  { key: '/profile-settings-account', icon: <MdOutlineSettings />, label: 'Settings' },
];
const BusinessItems = [
  { key: '/index', icon: <MdArrowBack />, label: 'Dashboard' },
  { key: '/profile-settings-account', icon: <RiAccountPinCircleFill />, label: 'Account' },
  { key: '/profile-settings-manage-business', icon: <FaBusinessTime />, label: 'Manage Business' },
  {
    key: 'sub1',
    label: 'Manage Users',
    icon: <FaUserCog />,
    children: [
      { key: '/users', label: ' Add Users' },
      { key: '/roles-permission', label: 'Roles & Permissions' },
      { key: '/delete-account-request', label: ' Delete Account Request' }
    ],
  },
  { key: '/profile-settings-reminders', icon: <FaRegClock />, label: 'Reminders' },
  { key: '/login', icon: <RiLogoutBoxRLine />, label: 'Logout' },


]
const AppContainer = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [reRender, setreRender] = useState(false)
  const [LoginRegister, setLoginRegister] = useState(false)
  useEffect(() => {
    dispatch(VerifyUser());
  }, [dispatch]);



  useEffect(() => {
    let isDashboardPath = BusinessItems.some(item => {
      if ((item.key === location.pathname || location.pathname === '/settings') && item.key !== "/index") {
        return true;
      } else if (item.children) {
        return item.children.some(child => child.key === location.pathname);
      }
      return false;
    });

    if (isDashboardPath) {
      setDashboardShift(true);
    } else {
      setDashboardShift(false);
    }
  }, [location.pathname]);



  function handleClick(key) {
    console.log("KEY MAIN", key)
    if (key === "/settings") {
      setDashboardShift(true)
    }
    history.push(key);
    setreRender(!reRender);
  }



  useEffect(() => {
    const value = location.pathname;
    console.log("value", value)
    if (value === "/login" || value === "/register" || value === "/documentation") {
      setLoginRegister(true)
    } else {
      setLoginRegister(false)
    }
  }, [location.pathname])


  function handleBusinessClick(key) {
    console.log("KEY MAIN", key)
    if (key === "/index") {
      setDashboardShift(false)
    }
    history.push(key);
    setreRender(!reRender);
  }

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  console.log(items, "items");

  const [dashboardShift, setDashboardShift] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  const [incrementor, setIncrementor] = useState(0)

  const onOpenChange = (keys) => {
    setOpenKeys([keys.pop()]);
  };


  const routes = [
    {
      path: "/profile-settings-manage-business",
      name: "Manage Business",
      icon: '/Homeicon.png',
    },
    {
      path: "/profile-settings-account",
      name: "Account",
      icon: '/customersicon.png',
    },
    {
      path: "/profile-settings-reminders",
      name: "Remainders",
      icon: '/vendors.png',
    },
    {
      path: "/logout",
      name: "Logout",
      icon: '/logout.png',
    }
  ];

  console.log("LOCATION PATHNAME", routes.some(route => location.pathname.includes(route.path)))
  return (
    <>
      {!LoginRegister &&
        <Header />
      }
      <Layout hasSider
      >
        {/* {!LoginRegister &&
        <Sider style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: '-2px',
        }}>
          {!dashboardShift &&
            <Menu 
              onClick={({ key }) => {
                handleClick(key)
              }}
              // defaultSelectedKeys={['/index']}
              // defaultOpenKeys={['sub1']}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
              items={items}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            />
          }
          {dashboardShift &&
            <Menu 
              onClick={({ key }) => {
                handleBusinessClick(key)
              }}
              // defaultSelectedKeys={['/index']}
              // defaultOpenKeys={['sub1']}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
              items={BusinessItems}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            />
          }
        </Sider>
} */}
        <>
          {!routes.some(route => location.pathname.includes(route.path)) ? (
            <SideBar setIncrementor={setIncrementor} incrementor={incrementor}>
              <Layout key={incrementor}>


                <Suspense fallback={<div className="h-[80vh] flex justify-center items-center">loading...</div>}>
                  <Router basename={`${config.publicPath}`}>

                    {/* <StickySidebar /> */}
                    <Route path="/domain-hosting" component={DomainHosting} />
                    <Route path="/ecommerce" component={Ecommerce} />
                    <Route path="/fitness-center" component={FitnessCenter} />
                    <Route path="/train-ticket-booking" component={TrainTicketBooking} />
                    <Route
                      path="/flight-booking-invoice"
                      component={FlightBookingInvoice}
                    />
                    <Route path="/hotel-booking" component={HotelBooking} />
                    <Route path="/pricingplans" component={PricingPlan1} />
                    <Route path="/internet-billing" component={InternetBooking} />
                    <Route path="/medical" component={Medical} />
                    <Route path="/moneyexchange" component={MoneyExchange} />
                    <Route path="/movie-ticket-booking" component={MovieTicketBooking} />
                    <Route path="/restuarent-billing" component={RestuarentBilling} />
                    <Route path="/student-billing" component={StudentBilling} />
                    <Route path="/cashreceipt-1" component={CashRecepitOne} />
                    <Route path="/cashreceipt-2" component={CashRecepitTwo} />
                    <Route path="/cashreceipt-3" component={CashRecepitThree} />
                    <Route path="/cashreceipt-4" component={CashRecepitFour} />
                    <Route path="/recurring-invoices" component={RecurringInvoice} />
                    <Route path="/recurring-paid" component={RecurringPaid} />
                    <Route path="/recurring-pending" component={RecurringPending} />
                    <Route path="/recurring-overdue" component={RecurringOverdue} />
                    <Route path="/recurring-draft" component={RecurringDraft} />
                    <Route path="/recurring-cancelled" component={RecurringCancelled} />
                    <Route path="/recurring" component={Recurring} />
                    <Route path="/credit-notes" component={CreditNotes} />
                    <Route path="/credit-notes-paid" component={CreditPaid} />
                    <Route path="/credit-notes-outstanding" component={CreditPending} />
                    <Route path="/credit-notes-overdue" component={CreditOverdue} />
                    <Route path="/credit-notes-draft" component={CreditDraft} />
                    <Route path="/credit-notes-recurring" component={CreditRecurring} />
                    <Route path="/credit-notes-cancelled" component={CreditCancelled} />
                    <Route path="/credit-notes-cancelled" component={CreditCancelled} />
                    <Route path="/add-credit-notes" component={AddCredit} />
                    <Route path="/add-debit-notes" component={AddDebitNotes} />
                    <Route path="/edit-debit-notes/:id" component={EditDebitNotes} />
                    <Route path="/credit-notes-details/:id" component={CreditDetails} />
                    <Route path="/credit-edit/:id" component={EditCreditnotes} />
                    <Route path="/purchases" component={Purchases} />
                    <Route path="/purchase-orders" component={PurchaseOrders} />
                    <Route path="/purchase-order-view/:id" component={PurchaseOrderView} />
                    <Route path="/purchases-list" component={PurchasesList} />
                    <Route path="/all-purchases" component={AllPurchases} />
                    <Route path="/paid-purchases" component={PaidPurchases} />
                    <Route path="/overdue-purchases" component={OverduePurchases} />
                    <Route path="/outstanding-purchases" component={OutstandingPurchases} />
                    <Route path="/draft-purchases" component={DraftPurchases} />
                    <Route path="/recurring-purchases" component={RecurringPurchases} />
                    <Route path="/cancelled-purchases" component={CancelledPurchases} />
                    <Route path="/purchase-return" component={PurchaseReturn} />
                    <Route
                      path="/create-purchase-return"
                      component={CreatePurchaseReturn}
                    />
                    <Route
                      path="/edit-purchase-return/:id"
                      component={EditPurchaseReturn}
                    />
                    <Route path="/purchase-invoice" component={PurchaseInvoice} />
                    <Route path="/deleted-invoice" component={DeletedInvoice} />
                    <Route path="/edit-purchases/:id" component={EditPurchase} />
                    <Route path="/add-purchase-order" component={AddPurchaseOrder} />
                    <Route
                      path="/purchase-return-view/:id"
                      component={PurchaseReturnView}
                    />
                    <Route path="/debit-notes" component={DebitNotes} />
                    <Route path="/debit-notes-view/:id" component={DebitNotesView} />
                    <Route path="/quotations" component={Quotations} />
                    <Route path="/add-quotations" component={AddQuotations} />
                    <Route path="/edit-quotations/:id" component={EditQuotations} />
                    <Route path="/quotation-details/:id" component={QuotationDetails} />
                    <Route path="/delivery-challans" component={DeliveryChallans} />
                    <Route path="/delchalen-details/:id" component={DelChallenDetails} />
                    <Route path="/edit-delivery-challans/:id" component={EditChallans} />
                    <Route path="/add-delivery-challans" component={AddChallans} />
                    <Route path="/payment-summary" component={PaymentSummary} />
                    <Route path="/add-user" component={AddUser} />

                    <Route path="/edit-users" component={EditUser} />
                    <Route path="/permission" component={Permission} />
                    <Route path="/membership-plans" component={MembershipPlan} />
                    <Route path="/membership-addons" component={MembershipAddons} />
                    <Route path="/subscribers" component={Subscribers} />
                    <Route path="/transactions" component={Transaction} />
                    <Route path="/add-page" component={AddPage} />
                    <Route path="/pages" component={Pages} />
                    <Route path="/all-blogs" component={AllBlogs} />
                    <Route path="/inactive-blog" component={InactiveBlog} />
                    <Route path="/add-blog" component={AddBlog} />
                    <Route path="/categories" component={Categories} />
                    <Route path="/add-categories" component={AddCategories} />
                    <Route path="/blog-comments" component={BlogComments} />
                    <Route path="/countries" component={Countries} />
                    <Route path="/states" component={States} />
                    <Route path="/cities" component={Cities} />
                    <Route path="/testimonials" component={Testimonials} />
                    <Route path="/add-testimonials" component={AddTestimonials} />
                    <Route path="/edit-testimonials" component={EditTestimonials} />
                    <Route path="/faq" component={Faq} />
                    <Route path="/tickets" component={Tickets} />
                    <Route path="/tickets-list-pending" component={TicketPending} />
                    <Route path="/tickets-list-overdue" component={TicketOverdue} />
                    <Route path="/tickets-list-draft" component={TicketDraft} />
                    <Route path="/tickets-list-recurring" component={TicketRecurring} />
                    <Route path="/tickets-list-cancelled" component={TicketCancelled} />
                    <Route path="/tickets-list" component={TicketList} />
                    <Route path="/tickets-pending" component={TicketListPending} />
                    <Route path="/tickets-overdue" component={TicketListOverdue} />
                    <Route path="/tickets-draft" component={TicketListDraft} />
                    <Route path="/tickets-recurring" component={TicketListRecurring} />
                    <Route path="/tickets-cancelled" component={TicketListCancelled} />
                    <Route path="/tickets-kanban" component={TicketKanban} />
                    <Route path="/tickets-overview" component={TicketDetails} />
                    <Route path="/add-membership" component={AddMembership} />
                    <Route path="/add-membership" component={AddMembership} />
                    <Route path="/fontawesome-icons" component={FontAwesome} />
                    <Route path="/feather-icons" component={Feather} />
                    <Route path="/ionic-icons" component={IconicIcon} />
                    <Route path="/material-icons" component={MaterialIcons} />
                    <Route path="/pe7-icons" component={Pe7} />
                    <Route path="/typicon-icons" component={TypiconIcons} />
                    <Route path="/simpleline-icons" component={SimpleLine} />
                    <Route path="/themify-icons" component={Themify} />
                    <Route path="/weather-icons" component={WeatherIcons} />
                    <Route path="/flag-icons" component={Flags} />
                    <Route path="/apex-charts" component={apexCharts} />
                    <Route path="/chart-js" component={ChartJs} />
                    <Route path="/morris-charts" component={MorrisCharts} />
                    <Route path="/float-charts" component={FlotCharts} />
                    <Route path="/peity-charts" component={PeityCharts} />
                    <Route path="/c3-charts" component={C3Charts} />

                    <Switch >
                      <Route path="/category-page" component={Category} />
                      <Route path="/login" component={Login} />
                      <Route path="/index" component={Dashboard3} />
                      <Route path="/indextwo" component={Indextwo} />
                      <Route path="/indexthree" component={Indexthree} />
                      <Route path="/indexfour" component={Indexfour} />
                      <Route path="/indexfive" component={Indexfive} />
                      <Route path="/customers" component={Customers} />
                      <Route path="/add-customer" component={AddCustomer} />
                      <Route path="/edit-customer/:id" component={EditCustomer} />
                      <Route path="/expenses" component={Expenses} />
                      <Route path="/expense-product-list" component={ExpenseProductList} />
                      <Route path="/add-expenses" component={AddExpenses} />
                      <Route path="/edit-expenses/:id" component={EditExpenses} />
                      <Route path="/view-expenses/:id" component={ViewExpenses} />
                      <Route path="/estimates" component={Estimates} />
                      <Route path="/add-estimate" component={AddEstimate} />
                      <Route path="/edit-estimate" component={EditEstimate} />
                      <Route path="/view-estimate" component={ViewEstimate} />
                      <Route path="/invoices" component={Invoices} />
                      <Route path="/invoice-details/:id" component={Invoicedetails} />
                      <Route path="/invoice-grid" component={Invoicegrid} />
                      <Route path="/view-invoice" component={ViewInvoice} />
                      <Route path="/add-invoice" component={AddInvoice} />
                      <Route path="/add-Proforma" component={AddProforma} />
                      <Route path="/add-purchase-list" component={AddPurchaseList} />
                      <Route path="/edit-invoice/:id" component={EditInvoice} />
                      <Route path="/tax-settings" component={Taxsettings} />
                      <Route path="/invoice-paid" component={InvoicePaid} />
                      <Route path="/invoice-overdue" component={InvoiceOverdue} />
                      <Route path="/bank-settings" component={Banksettings} />
                      <Route path="/invoices-settings" component={Invoicesettings} />
                      <Route path="/invoice-draft" component={Invoicedraft} />
                      <Route path="/invoice-recurring" component={Invoicerecurring} />
                      <Route path="/invoice-cancelled" component={Invoicecancelled} />
                      <Route path="/invoice-outstanding" component={InvoiceOutstanding} />
                      <Route path="/invoice-one" component={Invoiceone} />
                      <Route path="/invoice-two" component={InvoiceTwo} />
                      <Route path="/invoice-three" component={InvoiceThree} />
                      <Route path="/invoice-four" component={InvoiceFour} />
                      <Route path="/invoice-five" component={InvoiceFive} />
                      <Route path="/payments" component={FinanceAcPaymentsPage} />
                      <Route path="/payment-out" component={PaymentOut} />
                      <Route path="/add-payments" component={AddPayments} />
                      <Route path="/add-payments-in" component={AddPaymentIn} />
                      <Route path="/payment-in" component={PaymentIn} />
                      <Route path="/proforma-invoice" component={ProformaInvoice} />
                      <Route path="/edit-proforma/:id" component={EditProforma} />
                      <Route path="/proforma-details/:id" component={PerformaDetails} />
                      <Route path="/settings" component={ProfileSettings} />
                      <Route
                        path="/profile-settings-account"
                        component={AccountProfileSettings}
                      />
              <Route path="/components" component={Components} />

              <Route path="/basic-inputs" component={BasicInputs} />
              <Route path="/input-groups" component={FormInputGroups} />
              <Route path="/horizontal-form" component={HorizontalForm} />
              <Route path="/vertical-form" component={VerticalForm} />
              <Route path="/form-mask" component={FormMask} />
              <Route path="/form-validation" component={FormValidation} />
              <Route path="/File-upload" component={Fileupload} />
              <Route path="/form-select2" component={Formselect2} />

              <Route path="/basic-table" component={BasicTables} />
              <Route path="/data-tables" component={DataTables} />
              <Route path="/register" component={Register} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/lock-screen" component={LockScreen} />
              <Route path="/bus-ticket" component={BusTicket} />
              <Route path="/car-booking-invoice" component={CarBookingInvoice} />
              <Route path="/coffee-shop" component={CoffeeShop} />
              <Route path="/add-product" component={AddProduct} />
              <Route path="/view-product" component={EditProduct} />
              <Route path="/item-details/:id" component={ItemDetailsProduct} />
              <Route path="/stock-details/:id" component={StockDetailsProducts} />
              <Route
                path="/party-wise-report/:id"
                component={PartyWiseReportProduct}
              />
              <Route path="/godown" component={GodownProducts} />
              <Route path="/active-customers" component={ActiveCustomers} />
              <Route path="/deactive-customers" component={DeactiveCustomers} />
              <Route path="/customer-details/:id" component={CustomerDetails} />
              <Route path="/customer-details-paid" component={CustomerDetailsPaid} />
              <Route
                path="/customer-details-cancel"
                component={CustomerDetailsCancel}
              />
              <Route path="/vendors" component={Vendors} />
              <Route path="/vendor-details/:id" component={VendorDetails} />
              <Route path="/add-ledger" component={AddLedger} />
              <Route path="/product-list" component={ProductList} />
              {/* <Route path="/category" component={Category} /> */}
              <Route path="/units" component={Units} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/stock-list" component={StockList} />
              <Route path="/available-stock" component={AvailableStocks} />
              <Route path="/out-of-stock" component={OutOfStock} />
              <Route path="/create-godown" component={CreateGodown} />
              <Route path="/godown-view" component={GodownList} />
              <Route path="/edit-godown" component={EditGodown} />
              <Route path="/invoice-list" component={InvoiceList} />
              <Route path="/invoice-template" component={InvoiceTemplate} />
              <Route path="/general-invoice-1" component={GeneralInvoiceOne} />
              <Route path="/general-invoice-2" component={GeneralInvoiceTwo} />
              <Route path="/general-invoice-3" component={GeneralInvoiceThree} />
              <Route path="/general-invoice-4" component={GeneralInvoiceFour} />
              <Route path="/general-invoice-5" component={GeneralInvoiceFive} />
              <Route path="/general-invoice-six" component={GeneralInvoicesix} />
              <Route path="/general-invoice-seven" component={GeneralInvoiceseven} />
              <Route path="/general-invoice-eight" component={GeneralInvoiceeight} />
              <Route path="/general-invoice-nine" component={GeneralInvoicenine} />
              <Route path="/general-invoice-ten" component={GeneralInvoiceten} />
              <Route path="/general-invoice-11" component={GeneralInvoice11} />
              <Route path="/general-invoice-12" component={GeneralInvoice12} />
              <Route path="/general-invoice-13" component={GeneralInvoice13} />
              <Route path="/general-invoice-14" component={GeneralInvoice14} />
              <Route path="/general-invoice-15" component={GeneralInvoice15} />
              <Route
                path="/general-invoice-sixteen"
                component={GeneralInvoicesixteen}
              />
              <Route
                path="/general-invoice-seventeen"
                component={GeneralInvoiceseventeen}
              />
              <Route path="/general-invoice-18" component={GeneralInvoice18} />
              <Route
                path="/create-purchase-return"
                component={CreatePurchaseReturn}
              />
              <Route
                path="/edit-purchase-return/:id"
                component={EditPurchaseReturn}
              />
              <Route path="/add-purchases" component={AddPurchases} />
              <Route path="/purchases-details/:id" component={PurchaseDetails} />
              <Route path="/edit-purchase-order/:id" component={EditPurchaseOrder} />
              

              
              <Route path="/users" component={Users} />
              <Route path="/edit-users/:id" component={EditUser} />
              <Route path="/permission/:id" component={Permission} />
              <Route path="/delete-account-request" component={DeleteAccount} />
              <Route path="/membership-plans" component={MembershipPlan} />
              <Route path="/membership-addons" component={MembershipAddons} />
              <Route path="/subscribers" component={Subscribers} />
              <Route path="/transactions" component={Transaction} />
              <Route path="/add-page" component={AddPage} />
              <Route path="/pages" component={Pages} />
              <Route path="/all-blogs" component={AllBlogs} />
              <Route path="/inactive-blog" component={InactiveBlog} />
              <Route path="/add-blog" component={AddBlog} />
              <Route path="/categories" component={Categories} />
              <Route path="/add-categories" component={AddCategories} />
              <Route path="/blog-comments" component={BlogComments} />
              <Route path="/countries" component={Countries} />
              <Route path="/states" component={States} />
              <Route path="/cities" component={Cities} />
              <Route path="/testimonials" component={Testimonials} />
              <Route path="/add-testimonials" component={AddTestimonials} />
              <Route path="/edit-testimonials" component={EditTestimonials} />
              <Route path="/faq" component={Faq} />
              <Route path="/tickets" component={Tickets} />
              <Route path="/tickets-list-pending" component={TicketPending} />
              <Route path="/tickets-list-overdue" component={TicketOverdue} />
              <Route path="/tickets-list-draft" component={TicketDraft} />
              <Route path="/tickets-list-recurring" component={TicketRecurring} />
              <Route path="/tickets-list-cancelled" component={TicketCancelled} />
              <Route path="/tickets-list" component={TicketList} />
              <Route path="/tickets-pending" component={TicketListPending} />
              <Route path="/tickets-overdue" component={TicketListOverdue} />
              <Route path="/tickets-draft" component={TicketListDraft} />
              <Route path="/tickets-recurring" component={TicketListRecurring} />
              <Route path="/tickets-cancelled" component={TicketListCancelled} />
              <Route path="/tickets-kanban" component={TicketKanban} />
              <Route path="/tickets-overview" component={TicketDetails} />
              <Route path="/add-membership" component={AddMembership} />
              <Route path="/add-membership" component={AddMembership} />
              <Route path="/fontawesome-icons" component={FontAwesome} />
              <Route path="/feather-icons" component={Feather} />
              <Route path="/ionic-icons" component={IconicIcon} />
              <Route path="/material-icons" component={MaterialIcons} />
              <Route path="/pe7-icons" component={Pe7} />
              <Route path="/typicon-icons" component={TypiconIcons} />
              <Route path="/simpleline-icons" component={SimpleLine} />
              <Route path="/themify-icons" component={Themify} />
              <Route path="/weather-icons" component={WeatherIcons} />
              <Route path="/flag-icons" component={Flags} />
              <Route path="/apex-charts" component={apexCharts} />
              <Route path="/chart-js" component={ChartJs} />
              <Route path="/morris-charts" component={MorrisCharts} />
              <Route path="/float-charts" component={FlotCharts} />
              <Route path="/peity-charts" component={PeityCharts} />
              <Route path="/c3-charts" component={C3Charts} />

              <Route path="/alerts" component={Alert} />
              <Route path="/accordions" component={Accordions} />
              <Route path="/avatar" component={Avatar} />
              <Route path="/badges" component={Badges} />
              <Route path="/buttons" component={Buttons} />
              <Route path="/button-group" component={Buttongroup} />
              <Route path="/breadcrumbs" component={Breadcumbs} />
              <Route path="/cards" component={Cards} />
              <Route path="/carousel" component={Carousel} />
              <Route path="/dropdowns" component={Dropdowns} />
              <Route path="/grid" component={Grid} />
              <Route path="/images" component={Images} />
              <Route path="/lightbox" component={Lightbox} />
              <Route path="/media" component={Media} />
              <Route path="/modals" component={Modals} />
              <Route path="/offcanvas" component={Offcanvas} />
              <Route path="/pagination" component={Pagination} />
              <Route path="/popover" component={Popover} />
              <Route path="/progress" component={Progress} />
              <Route path="/placeholders" component={Placeholder} />
              <Route path="/rangeslides" component={Rangeslides} />
              <Route path="/spinners" component={Spinners} />
              <Route path="/sweetalerts" component={Sweetalerts} />
              <Route path="/tab" component={Tap} />
              <Route path="/toasts" component={Toasts} />
              <Route path="/tooltip" component={Tooltip} />
              <Route path="/typography" component={Typography} />
              <Route path="/video" component={Videos} />
              <Route path="/vector-map" component={VectorMaps} />
              <Route path="/error-404" component={Error404} />
              <Route path="/delete-accounts" component={DeleteAccounts} />

              <Route path="/ribbon" component={Ribbon} />
              <Route path="/clipboard" component={Clipboard} />
              <Route path="/drag-drop" component={DragDrop} />
              <Route path="/rating" component={Rating} />
              <Route path="/text-editor" component={Texteditor} />
              <Route path="/counter" component={Counter} />
              <Route path="/scrollbar" component={Scrollbar} />
              <Route path="/notification" component={Notification} />
              <Route path="/sticky-note" component={Stickynote} />
              <Route path="/timeline" component={Timeline} />
              <Route path="/horizontal-timeline" component={Horizontaltimeline} />
              <Route path="/form-wizard" component={Formwizard} />
              <Route path="/contact-messages" component={ContactMessage} />
              <Route path="/gst" component={GstCalculator} />
              <Route path="/gst-list" component={GstList} />
              {/* <Route path="/Payment" component={Payment} /> */}
              <Route path="/currency-list" component={CurrencyList} />
              <Route path="/add-currency" component={AddCurrency} />
              <Route path="/sample" component={MyComponent} />
              <Route path="/cash-bank" component={CashBank} />
              <Route path="/documentation" component={DocumentationMain} />
              <Route path="/editcustomer" component={Sample} />
              {/* <Route path="/country" component={CountrySelector} /> */}

              {/* // Reports starts */}
              <Route path="/reports" component={ReportsDashBoardPage} />
              <Route path="/report/balance-sheet" component={BalanceSheetPage} />
              <Route
                path="/report/profit-and-loss-report"
                component={ProfitAndLossPage}
              />
              <Route path="/report/sales-summary" component={SalesSummaryPage} />
              <Route
                path="/report/item-report-by-party"
                component={ItemReportPartyPage}
              />
              <Route
                path="/report/purchase-order-report"
                component={ItemReportPartyVendor}
              />
              <Route
                path="/report/item-sales-and-purchase-summary"
                component={ItemSaleAndPurchaasePage}
              />
              <Route path="/report/low-stock-summary" component={LowStockPage} />
              <Route path="/report/rate-list" component={RateListPage} />
              <Route path="/report/stock-detail-report" component={StockDetailPage} />
              <Route path="/report/stock-summary" component={StockSummaryPage} />
              <Route
                path="/report/receivable-ageing-report"
                component={ReceivableAgencyPage}
              />
              <Route
                path="/report/party-report-by-item"
                component={PartyReportItemPage}
              />
              <Route
                path="/report/customer-statement-ledger"
                component={CustomerStatementPage}
              />
              <Route
                path="/report/vendor-statement-ledger"
                component={VendorsStatementPage}
              />
              <Route
                path="/report/party-wise-outstanding"
                component={PartyOutstandingPage}
              />
              <Route
                path="/report/sales-summary-category-wise"
                component={SalesSummaryCategoryPage}
              />
              <Route
                path="/report/item-batch-report"
                component={ItemBatchReportPage}
              />

              {/* recovery invoice routes */}
              <Route path="/sales-recovery" component={RevevoredSales} />
              <Route path="/purchase-recovery" component={PurchaseRecovery} />
              <Route path="/expenses-recovery" component={ExpensesRecovery} />
              <Route path="/create-country" component={Country} />
              <Route path="/create-state" component={StateForm} />
              <Route path="/create-city" component={CityForm} />
              <Route path="/expenses-parties" component={Parties} />

              {/* recovery invoice routes */}

              {/* // Reports starts */}
              <Route path="/reports" component={ReportsDashBoardPage} />
              <Route path="/report/balance-sheet" component={BalanceSheetPage} />
              <Route
                path="/report/profit-and-loss-report"
                component={ProfitAndLossPage}
              />
              <Route path="/report/sales-summary" component={SalesSummaryPage} />
              <Route
                path="/report/item-report-by-party"
                component={ItemReportPartyPage}
              />
              <Route
                path="/report/item-report-by-vendor"
                component={ItemReportPartyVendor}
              />
              <Route
                path="/report/item-sales-and-purchase-summary"
                component={ItemSaleAndPurchaasePage}
              />
              <Route path="/report/low-stock-summary" component={LowStockPage} />
              <Route path="/report/rate-list" component={RateListPage} />
              <Route path="/report/stock-detail-report" component={StockDetailPage} />
              <Route path="/report/stock-summary" component={StockSummaryPage} />
              <Route
                path="/report/receivable-ageing-report"
                component={ReceivableAgencyPage}
              />
              <Route
                path="/report/party-report-by-customer"
                component={PartyReportItemPage}
              />
              <Route
                path="/report/party-report-by-vendor"
                component={PartyReportItemVendor}
              />
              <Route
                path="/report/customer-statement-ledger"
                component={CustomerStatementPage}
              />
              <Route
                path="/report/vendor-statement-ledger"
                component={VendorsStatementPage}
              />
              <Route
                path="/report/party-wise-outstanding"
                component={PartyOutstandingPage}
              />
              <Route
                path="/report/sales-summary-category-wise"
                component={SalesSummaryCategoryPage}
              />
              <Route
                path="/report/purchases-summary-category-wise"
                component={PurchasesSummaryCategoryPage}
              />
              <Route
                path="/report/item-batch-report"
                component={ItemBatchReportPage}
              />
              <Route
                path="/report/expenses-category-report"
                component={ExpensesCategoryReport}
              />
              <Route
                path="/report/expenses-transcation-report"
                component={ExpensesTransitionReport}
              />
              <Route
                path="/report/cash-bank-payment-in"
                component={CashAndBankPaymentIn}
              />
              <Route
                path="/report/cash-bank-payment-out"
                component={CashAndBankPaymentOut}
              />

              {/* recovery invoice routes */}
              <Route path="/sales-recovery" component={RevevoredSales} />
              <Route path="/purchase-recovery" component={PurchaseRecovery} />
              <Route path="/expenses-recovery" component={ExpensesRecovery} />
              <Route path="/create-country" component={Country} />
              <Route path="/create-state" component={StateForm} />
              <Route path="/create-city" component={CityForm} />
              <Route path="/expenses-parties" component={Parties} />

              {/* recovery invoice routes */}

              <Route path="/sales-return" component={SalesReturn} />
              <Route path="/add-sales-return" component={AddSalesReturn} />
              <Route path="/sales-return-view/:id" component={SalesReturnView} />
              <Route path="/sales-return-edit/:id" component={SalesReturnEdit} />

              {/* // Reports ends */}
              <Route path="/paymetin-view/:id" component={PaymentInView} />
              <Route path="/payment-out-view/:id" component={PaymentoutView} />
              <Route path="/paymetin-view/:id" component={PaymentInView} />
              <Route path="/payment-out-view/:id" component={PaymentoutView} />
              <Route
                path="/view-only-paymetin-invoice/:id"
                component={ViewPaymentInInvoice}
              />
              <Route
                path="/view-only-paymetOut-invoice/:id"
                component={ViewPaymentOutInvoice}
              />
              <Route
                path="/view-only-sales-Invoice/:id"
                component={ViewSalesInvoice}
              />
              <Route
                path="/view-only-debit-notes-invoice/:id"
                component={ViewDebitNotesInvoice}
              />
              <Route
                path="/view-only-purchase-return-invoice/:id"
                component={ViewPurchaseReturnInvoice}
              />
              <Route
                path="/view-only-purchases-invoice/:id"
                component={ViewPurchaseInvoice}
              />
              <Route
                path="/view-only-credit-note-invoice/:id"
                component={ViewCreditNoteInvoice}
              />
              <Route
                path="/view-only-proforma-invoice/:id"
                component={ViewOnlyProformaInvoice}
              />
              <Route
                path="/view-only-invoice/:controller/:endpoint/:id"
                component={ViewOnlyInvoice}
              />
              <Route path="/invoice-temp" component={Middleware} />
              <Route path="/numberinput" component={Number} />
              <Route path="/LocationSelector" component={LocationSelector} />
              <Route path="/sample-customer/:name" component={Sample} />
            </Switch>

          </Router>
          </Suspense>



                      <Route path="/sales-report" component={SalesReport} />
                      <Route path="/expenses-report" component={ExpenseReport} />
                      <Route path="/profit-loss-report" component={ProfitlossReport} />
                      <Route path="/taxs-report" component={Taxreport} />
                      <Route path="/preferences" component={Preferences} />
                      <Route path="/tax-types" component={TaxTypes} />
                      <Route path="/expense-category" component={ExpenseCategory} />
                      <Route path="/notifications" component={Notifications} />
                      <Route path="/change-password" component={ChangePassword} />
                      <Route path="/chat" component={Chat} />
                      <Route path="/calendar" component={Calendar} />
                      <Route path="/inbox" component={Inbox} />
                      <Route path="/profile" component={Profile} />
                      <Route path="/error-404" component={Page404} />
                      <Route path="/error-500" component={Page500} />
                      <Route path="/blank-page" component={BlankPage} />

                      <Route path="/components" component={Components} />

                      <Route path="/basic-inputs" component={BasicInputs} />
                      <Route path="/input-groups" component={FormInputGroups} />
                      <Route path="/horizontal-form" component={HorizontalForm} />
                      <Route path="/vertical-form" component={VerticalForm} />
                      <Route path="/form-mask" component={FormMask} />
                      <Route path="/form-validation" component={FormValidation} />
                      <Route path="/File-upload" component={Fileupload} />
                      <Route path="/form-select2" component={Formselect2} />

                      <Route path="/basic-table" component={BasicTables} />
                      <Route path="/data-tables" component={DataTables} />
                      <Route path="/register" component={Register} />
                      <Route path="/forgot-password" component={ForgotPassword} />
                      <Route path="/lock-screen" component={LockScreen} />
                      <Route path="/bus-ticket" component={BusTicket} />
                      <Route path="/car-booking-invoice" component={CarBookingInvoice} />
                      <Route path="/coffee-shop" component={CoffeeShop} />
                      <Route path="/add-product" component={AddProduct} />
                      <Route path="/view-product" component={EditProduct} />
                      <Route path="/item-details/:id" component={ItemDetailsProduct} />
                      <Route path="/stock-details/:id" component={StockDetailsProducts} />
                      <Route
                        path="/party-wise-report/:id"
                        component={PartyWiseReportProduct}
                      />
                      <Route path="/godown" component={GodownProducts} />
                      <Route path="/active-customers" component={ActiveCustomers} />
                      <Route path="/deactive-customers" component={DeactiveCustomers} />
                      <Route path="/customer-details/:id" component={CustomerDetails} />
                      <Route path="/customer-details-paid" component={CustomerDetailsPaid} />
                      <Route
                        path="/customer-details-cancel"
                        component={CustomerDetailsCancel}
                      />
                      <Route path="/vendors" component={Vendors} />
                      <Route path="/vendor-details/:id" component={VendorDetails} />
                      <Route path="/add-ledger" component={AddLedger} />
                      <Route path="/product-list" component={ProductList} />
                      {/* <Route path="/category" component={Category} /> */}
                      <Route path="/units" component={Units} />
                      <Route path="/inventory" component={Inventory} />
                      <Route path="/stock-list" component={StockList} />
                      <Route path="/available-stock" component={AvailableStocks} />
                      <Route path="/out-of-stock" component={OutOfStock} />
                      <Route path="/create-godown" component={CreateGodown} />
                      <Route path="/godown-view/:id" component={GodownList} />
                      <Route path="/godown-list" component={Godowns} />

                      <Route path="/edit-godown" component={EditGodown} />
                      <Route path="/invoice-list" component={InvoiceList} />
                      <Route path="/invoice-template" component={InvoiceTemplate} />
                      <Route path="/general-invoice-1" component={GeneralInvoiceOne} />
                      <Route path="/general-invoice-2" component={GeneralInvoiceTwo} />
                      <Route path="/general-invoice-3" component={GeneralInvoiceThree} />
                      <Route path="/general-invoice-4" component={GeneralInvoiceFour} />
                      <Route path="/general-invoice-5" component={GeneralInvoiceFive} />
                      <Route path="/general-invoice-six" component={GeneralInvoicesix} />
                      <Route path="/general-invoice-seven" component={GeneralInvoiceseven} />
                      <Route path="/general-invoice-eight" component={GeneralInvoiceeight} />
                      <Route path="/general-invoice-nine" component={GeneralInvoicenine} />
                      <Route path="/general-invoice-ten" component={GeneralInvoiceten} />
                      <Route path="/general-invoice-11" component={GeneralInvoice11} />
                      <Route path="/general-invoice-12" component={GeneralInvoice12} />
                      <Route path="/general-invoice-13" component={GeneralInvoice13} />
                      <Route path="/general-invoice-14" component={GeneralInvoice14} />
                      <Route path="/general-invoice-15" component={GeneralInvoice15} />
                      <Route
                        path="/general-invoice-sixteen"
                        component={GeneralInvoicesixteen}
                      />
                      <Route
                        path="/general-invoice-seventeen"
                        component={GeneralInvoiceseventeen}
                      />
                      <Route path="/general-invoice-18" component={GeneralInvoice18} />
                      <Route
                        path="/create-purchase-return"
                        component={CreatePurchaseReturn}
                      />
                      <Route
                        path="/edit-purchase-return/:id"
                        component={EditPurchaseReturn}
                      />
                      <Route path="/add-purchases" component={AddPurchases} />
                      <Route path="/purchases-details/:id" component={PurchaseDetails} />
                      <Route path="/edit-purchase-order/:id" component={EditPurchaseOrder} />



                      <Route path="/users" component={Users} />
                      <Route path="/edit-users/:id" component={EditUser} />
                      <Route path="/permission/:id" component={Permission} />
                      <Route path="/delete-account-request" component={DeleteAccount} />
                      <Route path="/membership-plans" component={MembershipPlan} />
                      <Route path="/membership-addons" component={MembershipAddons} />
                      <Route path="/subscribers" component={Subscribers} />
                      <Route path="/transactions" component={Transaction} />
                      <Route path="/add-page" component={AddPage} />
                      <Route path="/pages" component={Pages} />
                      <Route path="/all-blogs" component={AllBlogs} />
                      <Route path="/inactive-blog" component={InactiveBlog} />
                      <Route path="/add-blog" component={AddBlog} />
                      <Route path="/categories" component={Categories} />
                      <Route path="/add-categories" component={AddCategories} />
                      <Route path="/blog-comments" component={BlogComments} />
                      <Route path="/countries" component={Countries} />
                      <Route path="/states" component={States} />
                      <Route path="/cities" component={Cities} />
                      <Route path="/testimonials" component={Testimonials} />
                      <Route path="/add-testimonials" component={AddTestimonials} />
                      <Route path="/edit-testimonials" component={EditTestimonials} />
                      <Route path="/faq" component={Faq} />
                      <Route path="/tickets" component={Tickets} />
                      <Route path="/tickets-list-pending" component={TicketPending} />
                      <Route path="/tickets-list-overdue" component={TicketOverdue} />
                      <Route path="/tickets-list-draft" component={TicketDraft} />
                      <Route path="/tickets-list-recurring" component={TicketRecurring} />
                      <Route path="/tickets-list-cancelled" component={TicketCancelled} />
                      <Route path="/tickets-list" component={TicketList} />
                      <Route path="/tickets-pending" component={TicketListPending} />
                      <Route path="/tickets-overdue" component={TicketListOverdue} />
                      <Route path="/tickets-draft" component={TicketListDraft} />
                      <Route path="/tickets-recurring" component={TicketListRecurring} />
                      <Route path="/tickets-cancelled" component={TicketListCancelled} />
                      <Route path="/tickets-kanban" component={TicketKanban} />
                      <Route path="/tickets-overview" component={TicketDetails} />
                      <Route path="/add-membership" component={AddMembership} />
                      <Route path="/add-membership" component={AddMembership} />
                      <Route path="/fontawesome-icons" component={FontAwesome} />
                      <Route path="/feather-icons" component={Feather} />
                      <Route path="/ionic-icons" component={IconicIcon} />
                      <Route path="/material-icons" component={MaterialIcons} />
                      <Route path="/pe7-icons" component={Pe7} />
                      <Route path="/typicon-icons" component={TypiconIcons} />
                      <Route path="/simpleline-icons" component={SimpleLine} />
                      <Route path="/themify-icons" component={Themify} />
                      <Route path="/weather-icons" component={WeatherIcons} />
                      <Route path="/flag-icons" component={Flags} />
                      <Route path="/apex-charts" component={apexCharts} />
                      <Route path="/chart-js" component={ChartJs} />
                      <Route path="/morris-charts" component={MorrisCharts} />
                      <Route path="/float-charts" component={FlotCharts} />
                      <Route path="/peity-charts" component={PeityCharts} />
                      <Route path="/c3-charts" component={C3Charts} />

                      <Route path="/alerts" component={Alert} />
                      <Route path="/accordions" component={Accordions} />
                      <Route path="/avatar" component={Avatar} />
                      <Route path="/badges" component={Badges} />
                      <Route path="/buttons" component={Buttons} />
                      <Route path="/button-group" component={Buttongroup} />
                      <Route path="/breadcrumbs" component={Breadcumbs} />
                      <Route path="/cards" component={Cards} />
                      <Route path="/carousel" component={Carousel} />
                      <Route path="/dropdowns" component={Dropdowns} />
                      <Route path="/grid" component={Grid} />
                      <Route path="/images" component={Images} />
                      <Route path="/lightbox" component={Lightbox} />
                      <Route path="/media" component={Media} />
                      <Route path="/modals" component={Modals} />
                      <Route path="/offcanvas" component={Offcanvas} />
                      <Route path="/pagination" component={Pagination} />
                      <Route path="/popover" component={Popover} />
                      <Route path="/progress" component={Progress} />
                      <Route path="/placeholders" component={Placeholder} />
                      <Route path="/rangeslides" component={Rangeslides} />
                      <Route path="/spinners" component={Spinners} />
                      <Route path="/sweetalerts" component={Sweetalerts} />
                      <Route path="/tab" component={Tap} />
                      <Route path="/toasts" component={Toasts} />
                      <Route path="/tooltip" component={Tooltip} />
                      <Route path="/typography" component={Typography} />
                      <Route path="/video" component={Videos} />
                      <Route path="/vector-map" component={VectorMaps} />
                      <Route path="/error-404" component={Error404} />
                      <Route path="/delete-accounts" component={DeleteAccounts} />

                      <Route path="/ribbon" component={Ribbon} />
                      <Route path="/clipboard" component={Clipboard} />
                      <Route path="/drag-drop" component={DragDrop} />
                      <Route path="/rating" component={Rating} />
                      <Route path="/text-editor" component={Texteditor} />
                      <Route path="/counter" component={Counter} />
                      <Route path="/scrollbar" component={Scrollbar} />
                      <Route path="/notification" component={Notification} />
                      <Route path="/sticky-note" component={Stickynote} />
                      <Route path="/timeline" component={Timeline} />
                      <Route path="/horizontal-timeline" component={Horizontaltimeline} />
                      <Route path="/form-wizard" component={Formwizard} />
                      <Route path="/contact-messages" component={ContactMessage} />
                      <Route path="/gst" component={GstCalculator} />
                      <Route path="/gst-list" component={GstList} />
                      {/* <Route path="/Payment" component={Payment} /> */}
                      <Route path="/currency-list" component={CurrencyList} />
                      <Route path="/add-currency" component={AddCurrency} />
                      <Route path="/sample" component={MyComponent} />
                      <Route path="/cash-bank" component={CashBank} />
                      <Route path="/documentation" component={DocumentationMain} />
                      <Route path="/editcustomer" component={Sample} />
                      {/* <Route path="/country" component={CountrySelector} /> */}

                      {/* // Reports starts */}
                      <Route path="/reports" component={ReportsDashBoardPage} />
                      <Route path="/report/balance-sheet" component={BalanceSheetPage} />
                      <Route
                        path="/report/profit-and-loss-report"
                        component={ProfitAndLossPage}
                      />
                      <Route path="/report/sales-summary" component={SalesSummaryPage} />
                      <Route
                        path="/report/item-report-by-party"
                        component={ItemReportPartyPage}
                      />
                      <Route
                        path="/report/purchase-order-report"
                        component={ItemReportPartyVendor}
                      />
                      <Route
                        path="/report/item-sales-and-purchase-summary"
                        component={ItemSaleAndPurchaasePage}
                      />
                      <Route path="/report/low-stock-summary" component={LowStockPage} />
                      <Route path="/report/rate-list" component={RateListPage} />
                      <Route path="/report/stock-detail-report" component={StockDetailPage} />
                      <Route path="/report/stock-summary" component={StockSummaryPage} />
                      <Route
                        path="/report/receivable-ageing-report"
                        component={ReceivableAgencyPage}
                      />
                      <Route
                        path="/report/party-report-by-item"
                        component={PartyReportItemPage}
                      />
                      <Route
                        path="/report/customer-statement-ledger"
                        component={CustomerStatementPage}
                      />
                      <Route
                        path="/report/vendor-statement-ledger"
                        component={VendorsStatementPage}
                      />
                      <Route
                        path="/report/party-wise-outstanding"
                        component={PartyOutstandingPage}
                      />
                      <Route
                        path="/report/sales-summary-category-wise"
                        component={SalesSummaryCategoryPage}
                      />
                      <Route
                        path="/report/item-batch-report"
                        component={ItemBatchReportPage}
                      />

                      {/* recovery invoice routes */}
                      <Route path="/sales-recovery" component={RevevoredSales} />
                      <Route path="/purchase-recovery" component={PurchaseRecovery} />
                      <Route path="/expenses-recovery" component={ExpensesRecovery} />
                      <Route path="/create-country" component={Country} />
                      <Route path="/create-state" component={StateForm} />
                      <Route path="/create-city" component={CityForm} />
                      <Route path="/expenses-parties" component={Parties} />

                      {/* recovery invoice routes */}

                      {/* // Reports starts */}
                      <Route path="/reports" component={ReportsDashBoardPage} />
                      <Route path="/report/balance-sheet" component={BalanceSheetPage} />
                      <Route
                        path="/report/profit-and-loss-report"
                        component={ProfitAndLossPage}
                      />
                      <Route path="/report/sales-summary" component={SalesSummaryPage} />
                      <Route
                        path="/report/item-report-by-party"
                        component={ItemReportPartyPage}
                      />
                      <Route
                        path="/report/item-report-by-vendor"
                        component={ItemReportPartyVendor}
                      />
                      <Route
                        path="/report/item-sales-and-purchase-summary"
                        component={ItemSaleAndPurchaasePage}
                      />
                      <Route path="/report/low-stock-summary" component={LowStockPage} />
                      <Route path="/report/rate-list" component={RateListPage} />
                      <Route path="/report/stock-detail-report" component={StockDetailPage} />
                      <Route path="/report/stock-summary" component={StockSummaryPage} />
                      <Route
                        path="/report/receivable-ageing-report"
                        component={ReceivableAgencyPage}
                      />
                      <Route
                        path="/report/party-report-by-customer"
                        component={PartyReportItemPage}
                      />
                      <Route
                        path="/report/party-report-by-vendor"
                        component={PartyReportItemVendor}
                      />
                      <Route
                        path="/report/customer-statement-ledger"
                        component={CustomerStatementPage}
                      />
                      <Route
                        path="/report/vendor-statement-ledger"
                        component={VendorsStatementPage}
                      />
                      <Route
                        path="/report/party-wise-outstanding"
                        component={PartyOutstandingPage}
                      />
                      <Route
                        path="/report/sales-summary-category-wise"
                        component={SalesSummaryCategoryPage}
                      />
                      <Route
                        path="/report/purchases-summary-category-wise"
                        component={PurchasesSummaryCategoryPage}
                      />
                      <Route
                        path="/report/item-batch-report"
                        component={ItemBatchReportPage}
                      />
                      <Route
                        path="/report/expenses-category-report"
                        component={ExpensesCategoryReport}
                      />
                      <Route
                        path="/report/expenses-transcation-report"
                        component={ExpensesTransitionReport}
                      />
                      <Route
                        path="/report/cash-bank-payment-in"
                        component={CashAndBankPaymentIn}
                      />
                      <Route
                        path="/report/cash-bank-payment-out"
                        component={CashAndBankPaymentOut}
                      />

                      {/* recovery invoice routes */}
                      <Route path="/sales-recovery" component={RevevoredSales} />
                      <Route path="/purchase-recovery" component={PurchaseRecovery} />
                      <Route path="/expenses-recovery" component={ExpensesRecovery} />
                      <Route path="/create-country" component={Country} />
                      <Route path="/create-state" component={StateForm} />
                      <Route path="/create-city" component={CityForm} />
                      <Route path="/expenses-parties" component={Parties} />

                      {/* recovery invoice routes */}

                      <Route path="/sales-return" component={SalesReturn} />
                      <Route path="/add-sales-return" component={AddSalesReturn} />
                      <Route path="/sales-return-view/:id" component={SalesReturnView} />
                      <Route path="/sales-return-edit/:id" component={SalesReturnEdit} />

                      {/* // Reports ends */}
                      <Route path="/paymetin-view/:id" component={PaymentInView} />
                      <Route path="/payment-out-view/:id" component={PaymentoutView} />
                      <Route path="/paymetin-view/:id" component={PaymentInView} />
                      <Route path="/payment-out-view/:id" component={PaymentoutView} />
                      <Route
                        path="/view-only-paymetin-invoice/:id"
                        component={ViewPaymentInInvoice}
                      />
                      <Route
                        path="/view-only-paymetOut-invoice/:id"
                        component={ViewPaymentOutInvoice}
                      />
                      <Route
                        path="/view-only-sales-Invoice/:id"
                        component={ViewSalesInvoice}
                      />
                      <Route
                        path="/view-only-debit-notes-invoice/:id"
                        component={ViewDebitNotesInvoice}
                      />
                      <Route
                        path="/view-only-purchase-return-invoice/:id"
                        component={ViewPurchaseReturnInvoice}
                      />
                      <Route
                        path="/view-only-purchases-invoice/:id"
                        component={ViewPurchaseInvoice}
                      />
                      <Route
                        path="/view-only-credit-note-invoice/:id"
                        component={ViewCreditNoteInvoice}
                      />
                      <Route
                        path="/view-only-proforma-invoice/:id"
                        component={ViewOnlyProformaInvoice}
                      />
                      <Route
                        path="/view-only-invoice/:controller/:endpoint/:id"
                        component={ViewOnlyInvoice}
                      />
                      <Route path="/invoice-temp" component={Middleware} />
                      <Route path="/numberinput" component={Number} />
                      <Route path="/LocationSelector" component={LocationSelector} />
                      <Route path="/sample-customer/:name" component={Sample} />
                    </Switch>

                  </Router>

                </Suspense>



              </Layout>
            </SideBar>
          ) : (
            <SettingsSidebar setIncrementor={setIncrementor} incrementor={incrementor}>
              <Layout key={incrementor}>


                <Suspense fallback={<div className="h-[80vh] flex justify-center items-center">loading...</div>}>
                  <Router basename={`${config.publicPath}`}>
                    <Route
                      path="/profile-settings-invoice-settings"
                      component={InvoiceSettingsProfileSettings}
                    />
                    <Route
                      path="/profile-settings-reminders"
                      component={RemindersProfileSettings}
                    />
                    <Route
                      path="/profile-settings-manage-business"
                      component={ManageBusinessProfileSettings}
                    />

                    <Route path="/roles-permission" component={RolesPermission} />

                  </Router>
                </Suspense>
              </Layout>

            </SettingsSidebar>
          )}
        </>
      </Layout >
    </>
  );
};

export default AppContainer;
