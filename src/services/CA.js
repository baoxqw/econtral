import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchCA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectcloseout/onaudit/query`,{
    method:'POST',
    body: str,
  });
}

export async function addCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/add`,{
    method:'POST',
    body: str,
  });
}

export async function updateCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/update`,{
    method:'POST',
    body: str,
  });
}
export async function deleteCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/delete`,{
    method:'POST',
    body: str,
  });
}
//提交意见
export async function result(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/agree`,{
    method:'POST',
    body:str
  })
}

export async function subrefuse(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/reject`,{
    method:'POST',
    body:str
  })
}

export async function checkstatus(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/queryprocessbyid`,{
    method:'POST',
    body: str,
  });
}
