//
//  ActionTypes.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:06:43 AM.
//  Copyright © 2019 Retrocube. All rights reserved.

//
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const CANCEL = 'CANCEL';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';
const ADD = 'ADD';

function createRequestTypes(base) {
  const res = {};
  [ADD, REQUEST, SUCCESS, FAILURE, CANCEL, CREATE, UPDATE, DELETE].forEach(
    type => {
      res[type] = `${base}_${type}`;
    },
  );
  return res;
}
//DEFAULT ACTIONS
export const GENERAL_ACTION = 'GENERAL_ACTION';
export const GENERAL_ACTION_MULTIPLE_REQUEST =
  'GENERAL_ACTION_MULTIPLE_REQUEST';
export const NO_INTERNET = 'NO_INTERNET';
//SOCKET DEFAULT ACTIONS
export const SOCKET_INFO = createRequestTypes('SOCKET_INFO');
export const SOCKET_DUMP = createRequestTypes('SOCKET_DUMP');
export const SOCKET_WRITE = 'SOCKET_WRITE';
//NETWORK DEFAULT ACTION
export const NETWORK_INFO = 'NETWORK_INFO';
//LOCATION ACTIONS
export const USER_LOCATION = createRequestTypes('USER_LOCATION');
//APP GENERAL ACTIONS

export const DUMP = createRequestTypes('DUMP');
export const USER = createRequestTypes('USER');
export const LOGIN = createRequestTypes('LOGIN');
export const SIGNUP = createRequestTypes('SIGNUP');
export const FORGOT_PASSWORD = createRequestTypes('FORGOT_PASSWORD');
export const CHANGE_PASSWORD = createRequestTypes('CHANGE_PASSWORD');
export const LOGOUT = 'LOGOUT';

// Service
export const SERVICE = createRequestTypes('SERVICE');
export const CATEGORY = createRequestTypes('CATEGORY');
export const SERVICE_DETAIL = createRequestTypes('SERVICE_DETAIL');
export const PENDING_ORDERS = createRequestTypes('PENDING_ORDERS');
export const ACCEPTED_ORDERS = createRequestTypes('ACCEPTED_ORDERS');
export const COMPLETED_ORDERS = createRequestTypes('COMPLETED_ORDERS');
export const REJECTED_ORDERS = createRequestTypes('REJECTED_ORDERS');
export const PROVIDER_LIST = createRequestTypes('PROVIDER_LIST');
export const FILTERED_PROVIDERS = createRequestTypes('FILTERED_PROVIDERS');
export const MY_EARNINGS = createRequestTypes('MY_EARNINGS');
export const RECOMMENDATION = createRequestTypes('RECOMMENDATION')
export const REVIEW = createRequestTypes('REVIEW')
export const NOTIFICATION = createRequestTypes('NOTIFICATION')
export const BANK_DETAILS = createRequestTypes('BANK_DETAILS')
export const USER_CARDS = createRequestTypes('USER_CARDS')
export const DEFAULT_CARD = createRequestTypes('DEFAULT_CARD')

// export const PROVIDER_SERVICE = createRequestTypes('PROVIDER_SERVICE');

// SERVIES ACTIONS
export const NORMALIZE_SERVICES = 'NORMALIZE_SERVICES';
export const GENERAL_SERVICES = 'GENERAL_SERVICES';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const ADD_DELETE_SERVICE = 'ADD_DELETE_SERVICE';
