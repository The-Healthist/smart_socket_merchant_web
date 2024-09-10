import request from "@/utils/request";

export const getUploadPolicy = () => {
  return request({
    url: "/api/merchant/file/upload_policy",
    method: "GET",
  });
};
