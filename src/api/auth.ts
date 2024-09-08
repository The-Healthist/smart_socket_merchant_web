import request from '../utils/request';

export const MerchantLogin = (data:any) => {
  return request({
    url: '/api/merchant/login',
    method: 'post',
    data,
  });
};
