const constant = {
  //App Constants
  socketIP: '192.34.60.217',
  socketPort: '1233',
  // qa BaseUrl
  baseURL: 'https://press-link-web-api.qa.retrocubedev.com/api/',
  baseImageURL: 'https://press-link-web-api.qa.retrocubedev.com/api/',


  applicationToken: 'api.Pd*!(5675',
  publishableKey: 'pk_test_51KnfwuEvhcleeM1QnTAEfks7dIYqfyP9tshcPdoNb3Pw7dp0PIjxl9CabCnbLKEUsN0gFusLDsOInbgbjgQ8Ngea005E6zldF0',
  //Services Constants
  login: 'user/login',
  existingUser: 'user/check-exists',
  user: 'user',
  cashout: 'cash-out',
  myearnings: 'my-earnings',
  changePassword: 'user/change-password',
  forgotPassword: 'user/forgot-password',
  categoryList: 'category',
  service: 'service',
  faq: 'faq',
  order: 'order',
  review: 'review',
  notification: 'notification',
  bankDetail: 'bank-detail',
  userCard: 'user-card',
  makeCardDefault: 'make-card-default',
  defaultCard: 'default-card',
  //Socket Constants
  //     failure: { action: "failure", packet_code: 9900 },
  //Location Constants
  LOCATION_TIME_OUT: 10000,
  LOCATION_MAX_AGE: 1000,
  LOCATION_HIGH_ACCURACY: false,
  // Get method here

  // Post method here
  GOOGLE_PLACES_API_KEY: '',
  serviceTypes: {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
  },
};



export default constant;
