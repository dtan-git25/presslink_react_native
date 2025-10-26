import { combineReducers } from 'redux';
import serviceReducer from './serviceReducer';
import userLocation from './userLocation';
import IsFirstRunReducer from './IsFirstRunReducer';
import generalServices from './generalServices';
import {
  USER,
  LOGOUT,
  USER_LOCATION,
  DUMP,
  SOCKET_INFO,
  SOCKET_DUMP,
  CATEGORY,
  SERVICE,
  SERVICE_DETAIL,
  PROVIDER_LIST,
  FILTERED_PROVIDERS,
  PENDING_ORDERS,
  ACCEPTED_ORDERS,
  COMPLETED_ORDERS,
  REJECTED_ORDERS,
  RECOMMENDATION,
  MY_EARNINGS,
  REVIEW,
  NOTIFICATION,
  DEFAULT_CARD,
  BANK_DETAILS,
  USER_CARDS
} from '../actions/ActionTypes';

const appReducer = combineReducers({
  userReducer: serviceReducer(USER),
  categoryReducer: serviceReducer(CATEGORY),
  providerServiceReducer: serviceReducer(SERVICE),
  pendingOrderReducer: serviceReducer(PENDING_ORDERS),
  acceptedOrderReducer: serviceReducer(ACCEPTED_ORDERS),
  completedOrderReducer: serviceReducer(COMPLETED_ORDERS),
  rejectedOrderReducer: serviceReducer(REJECTED_ORDERS),
  providersReducer: serviceReducer(PROVIDER_LIST),
  filteredProviderReducer: serviceReducer(FILTERED_PROVIDERS),
  recommendationReducer: serviceReducer(RECOMMENDATION),
  reviewReducer: serviceReducer(REVIEW),
  myEarningsReducer: serviceReducer(MY_EARNINGS),
  notificationReducer: serviceReducer(NOTIFICATION),
  bankDetailsReducer: serviceReducer(BANK_DETAILS),
  userCardReducer: serviceReducer(USER_CARDS),
  defaultCardReducer: serviceReducer(DEFAULT_CARD),

  isFirstRun: IsFirstRunReducer,
  userLocation,
  generalServices,
});

// const rootReducer = (state: any, action: any) => {
//   if (action.type === LOGOUT) {
//     const { userReducer, ...rest } = state;
//     state = {
//       ...rest,
//       userReducer: { ...userReducer, data: [] },
//     };
//   }
//   console.log('state , action', state, action)
//   return appReducer(state, action);
// };
const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    let newState = {};
    for (let key of Object.keys(state)) {
      newState[key] = {
        ...state[key],
        data: [],
        added: [],
        meta: { current_page: 0, last_page: 0 },
      };
    }
    state = {
      ...newState,
    };
  }
  return appReducer(state, action);
};

export default rootReducer;
