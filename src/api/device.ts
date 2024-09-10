import request from  "../utils/request"

//DEVICE CRUD

export const getDevices = () => {
  return request({
    url: `/api/merchant/device`,
    method: "GET"
  })
}

export const getDevice = (id: string) => {
   return request({
    url: `/api/merchant/device/${id}`,
    method: "GET"
  })
}

export const addDevice = (data: any) => {
  return request({
    url: `/api/merchant/device`,
    method: "POST",
    data
  })
}

export const updateDevice = (id: string, data: any) => {
  return request({
    url: `/api/merchant/device/${id}`,
    method: "PUT",
    data
  })
}

export const deleteDevice = (uuids: any) => {
  return request({
    url: `/api/merchant/device`,
    method: "DELETE",
    data: {
      uuids: uuids
    }
  })
}