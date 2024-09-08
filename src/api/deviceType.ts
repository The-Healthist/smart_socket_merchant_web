import request from "../utils/request";

export const getDeviceTypes = () => {
  return request({
    url: `/api/merchant/device-type`,
    method: "GET"
  })
}

export const addDeviceType = (data: any) => {
  return request({
    url: `/api/merchant/device-type`,
    method: "POST",
    data
  })
}

export const updateDeviceType = (id: string, data: any) => {
  return request({
    url: `/api/merchant/device-type/${id}`,
    method: "PUT",
    data
  })
}

export const deleteDeviceType = (id: string) => {
  return request({
    url: `/api/merchant/device-type/${id}`,
    method: "DELETE"
  })
}
