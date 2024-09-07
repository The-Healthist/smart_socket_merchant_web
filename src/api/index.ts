import request from '../utils/request';

export const adminLogin = (data: any) => {
  return request({
    url: `/auth/admin`,
    method: 'post',
    data: data,
  });
};

export const adminProfile = () => {
  return request({
    url: '/auth/admin/profile',
    method: 'get'
  });
};

export const adminChangePwd = (data: any) => {
  return request({
    url: '/auth/admin/change_pwd',
    method: 'post',
    data: data,
  });
};

export const fetchUsers = (query: any) => {
  return request({
    url: '/user',
    method: 'get',
    params: query
  });
};

export const fetchUserById = (id: number) => {
  return request({
    url: `/user/${id}`,
    method: 'get'
  });
};

export const blockUser = (id: number, data: any) => {
  return request({
    url: `/user/${id}/block`,
    method: 'post',
    data: data,
  });
};

export const unblockUser = (id: number) => {
  return request({
    url: `/user/${id}/unblock`,
    method: 'post'
  });
};

export const resetUser = (id: number) => {
  return request({
    url: `/user/${id}/reset`,
    method: 'post'
  });
};

export const createAdminUser = (data: any) => {
  return request({
    url: '/adminuser',
    method: 'post',
    data
  });
};

export const fetchAdminUsers = (query: any) => {
  return request({
    url: '/adminuser',
    method: 'get',
    params: query,
  });
};

export const resetAdminUser = (id: number) => {
  return request({
    url: `/adminuser/${id}/reset`,
    method: 'post'
  });
};

export const deleteAdminUser = (data: any) => {
  return request({
    url: '/adminuser',
    method: 'delete',
    data: data,
  });
};

export const fetchVotes = (query: any) => {
  return request({
    url: '/vote',
    method: 'get',
    params: query,
  });
};

export const deleteVotes = (data: any) => {
  return request({
    url: '/vote',
    method: 'delete',
    data: data,
  });
};

export const blockVote = (id: number) => {
  return request({
    url: `/vote/${id}/block`,
    method: 'post'
  });
};

export const unblockVote = (data: any) => {
  return request({
    url: '/vote/unblock',
    method: 'post',
    data: data,
  });
};

export const fetchBlockVotes = (query: any) => {
  return request({
    url: '/vote/block',
    method: 'get',
    params: query,
  });
};

export const fetchManuscripts = (query: any) => {
  return request({
    url: '/manuscript',
    method: 'get',
    params: query,
  });
};

export const fetchManuscriptById = (id: number) => {
  return request({
    url: `/manuscript/${id}`,
    method: 'get'
  });
};

export const updateManuscript = (data: any) => {
  return request({
    url: '/manuscript',
    method: 'put',
    data
  });
};

export const deleteManuscript = (data: any) => {
  return request({
    url: '/manuscript',
    method: 'delete',
    data: data
  });
};

export const auditPassManuscript = (id: number) => {
  return request({
    url: `/manuscript/${id}/audit/pass`,
    method: 'post'
  });
};

export const auditRejectManuscript = (id: number, data: any) => {
  return request({
    url: `/manuscript/${id}/audit/reject`,
    method: 'post',
    data: data,
  });
};

export const createQuestion = (data: any) => {
  return request({
    url: '/question_answer',
    method: 'post',
    data
  });
};

export const fetchQuestions = (query: any) => {
  return request({
    url: '/question_answer',
    method: 'get',
    params: query,
  });
};

export const updateQuestion = (data: any) => {
  return request({
    url: '/question_answer',
    method: 'put',
    data
  });
};

export const publishQuestion = (id: number) => {
  return request({
    url: `/question_answer/${id}/publish`,
    method: 'post'
  });
};

export const recallQuestion = (id: number) => {
  return request({
    url: `/question_answer/${id}/recall`,
    method: 'post'
  });
};

export const deleteQuestions = (data: any) => {
  return request({
    url: `/question_answer`,
    method: 'delete',
    data: data,
  });
};

export const fetchEvents = () => {
  return request({
    url: '/event',
    method: 'get'
  });
}

export const createEvent = (data: any) => {
  return request({
    url: '/event',
    method: 'post',
    data
  });
}

export const updateEvent = (eventId: Number, data: any) => {
  return request({
    url: `/event/${eventId}`,
    method: 'put',
    data
  });
}

export const getUploadPolicy = () => {
  return request({
      url: '/file/policy',
      method: 'get'
  });
};

export const fetchWorldviews = (query: any) => {
  return request({
    url:'/worldview',
    method: 'get',
    params: query,
  })
}

export const createWorldview = (data: any) => {
  return request({
    url: '/worldview',
    method: 'post',
    data: data,
  })
}

export const updateWorldview = (data: any) => {
  return request({
    url: '/worldview',
    method: 'put',
    data: data,
  })
}

export const deleteWorldview = (data: any) => {
  return request({
    url: '/worldview',
    method: 'delete',
    data: data,
  })
}

export const fetchPVs = (query: any) => {
  return request({
    url: '/pv',
    method: 'get',
    params: query,
  })
}

export const createPV = (data: any) => {
  return request({
    url: '/pv',
    method: 'post',
    data: data,
  })
}

export const updatePV = (id:any, data: any) => {
  return request({
    url: `/pv/${id}`,
    method: 'put',
    data: data,
  })
}

export const deletePVs = (data: any) => {
  return request({
    url: '/pv',
    method: 'delete',
    data: data,
  })
}

export const fetchPartners = (query: any) => {
  return request({
    url: '/partner',
    method: 'get',
    params: query,
  })
}

export const createPartner = (data: any) => {
  return request({
    url: '/partner',
    method: 'post',
    data: data,
  })
}

export const updatePartner = (id:any, data: any) => {
  return request({
    url: `/partner/${id}`,
    method: 'put',
    data: data,
  })
}

export const deletePartners = (data: any) => {
  return request({
    url: '/partner',
    method: 'delete',
    data: data,
  })
}

export const fetchSpecialGuests = (query: any) => {
  return request({
    url: '/special_guest',
    method: 'get',
    params: query,
  })
}

export const createSpecialGuest = (data: any) => {
  return request({
    url: '/special_guest',
    method: 'post',
    data: data,
  })
}

export const updateSpecialGuest = (id:any, data: any) => {
  return request({
    url: `/special_guest/${id}`,
    method: 'put',
    data: data,
  })
}

export const deleteSpecialGuests = (data: any) => {
  return request({
    url: '/special_guest',
    method: 'delete',
    data: data,
  })
}

export const fetchSponsors = (query: any) => {
  return request({
    url: '/sponsor',
    method: 'get',
    params: query,
  })
}

export const createSponsor = (data: any) => {
  return request({
    url: '/sponsor',
    method: 'post',
    data: data,
  })
}

export const updateSponsor = (id:any, data: any) => {
  return request({
    url: `/sponsor/${id}`,
    method: 'put',
    data: data,
  })
}

export const deleteSponsors = (data: any) => {
  return request({
    url: '/sponsor',
    method: 'delete',
    data: data,
  })
}

