import request from "../utils/request";

export const getDeviceTypes = () => {
  return request({
    url: `/api/merchant/device_type`,
    method: "GET"
  })
}

export const addDeviceType = (data: any) => {
  return request({
    url: `/api/merchant/device_type`,
    method: "POST",
    data
  })
}

export const updateDeviceType = (id: string, data: any) => {
  return request({
    url: `/api/merchant/device_type/${id}`,
    method: "PUT",
    data
  })
}

export const deleteDeviceType = (ids: any) => {
  return request({
    url: `/api/merchant/device_type`,
    method: "DELETE",
    data: {
      ids: ids
    }
  })
}
