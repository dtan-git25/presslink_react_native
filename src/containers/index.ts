import Tabs from './Tabs';
import Categories from './Categories';
import OrdersGrid from './OrdersGrid';
import EditProfile from './EditProfile';
import Search from './Search';
import Notifications from './Notifications';
import ServiceDetail from './ServiceDetail';
import PackageDetail from './PackageDetail';
import ScheduleDetail from './ScheduleDetail';
import ServiceCheckout from './ServiceCheckout';

export * from './Auth';

// Service Provider
import ProviderLogin from './ProviderAuth/ProviderLogin';
import ProviderForgotPassword from './ProviderAuth/ProviderForgotPassword';
import ProviderSignUp from './ProviderAuth/ProviderSignUp';
import ProviderDetailedSignUp from './ProviderAuth/ProviderDetailedSignUp';
import Home from './ProviderTabs/Home';
import MyOrders from './ProviderTabs/MyOrders';
import MyProfile from './ProviderTabs/MyProfile';
import More from './ProviderTabs/More';
import ChatScreen from '../modules/chat/chat';
import Chat from '../modules/chat/inbox';
import RateReview from './RateReview';
import ProviderTabs from './ProviderTabs';
import MenuDetail from './ProviderMenuDetail';
import OrderDetail from './ProviderOrderDetail';
import ProviderMyEarnings from './ProviderMyEarnings';
import ProviderBankDetails from './ProviderBankDetails';
import ProviderChangePassword from './ProviderChangePassword';
import ProviderCreateService from './ProviderCreateService';
import ProviderEditProfile from './ProviderEditProfile';
import ProviderMoreReviews from './ProviderMoreReviews';
import MoreServices from './MoreServices';

//Settings
import ContentPage from './ContentPage';
import PaymentMethod from './PaymentMethod';
import AddPaymentMethod from './AddPaymentMethod';

export {
  Tabs,
  Categories,
  Home,
  MyOrders,
  MyProfile,
  More,
  ChatScreen,
  OrdersGrid,
  EditProfile,
  Search,
  Notifications,
  ServiceDetail,
  ScheduleDetail,
  ServiceCheckout,
  ProviderLogin,
  ProviderForgotPassword,
  ProviderSignUp,
  ProviderDetailedSignUp,
  ProviderTabs,
  ProviderMoreReviews,
  MoreServices,
  MenuDetail,
  OrderDetail,
  Chat,
  RateReview,
  ContentPage,
  ProviderMyEarnings,
  PaymentMethod,
  AddPaymentMethod,
  PackageDetail,
  ProviderBankDetails,
  ProviderChangePassword,
  ProviderCreateService,
  ProviderEditProfile,
};
