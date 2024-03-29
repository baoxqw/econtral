import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformH/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchDept(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function fetchProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}

export async function addRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformH/add`,{
    method:'POST',
    body: str,
  });
}

export async function findId(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformB/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchCostsubj(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdCostsubj/query`,{
    method:'POST',
    body: str,
  });
}

export async function childadd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformB/add`,{
    method:'POST',
    body: str,
  });
}

export async function deleteRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformH/delete`,{
    method:'POST',
    body: str,
  });
}

export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformB/delete`,{
    method:'POST',
    body: str,
  });
}

export async function checkRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/agree`,{
    method:'POST',
    body: str,
  });
}

export async function refuseRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/reject`,{
    method:'POST',
    body: str,
  });
}

export async function returnRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/return`,{
    method:'POST',
    body: str,
  });
}


export async function uploadFile(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/attachment/upload`,{
    method:'POST',
    body: params,
  });
}
export async function submitRR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: str,
  });
}

export async function uploadFileList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/attachment/queryByTypeandId`,{
    method:'POST',
    body: str,
  });
}

export async function uploadDelete(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/delattachment`,{
    method:'POST',
    body: str,
  });
}

export async function fetchProjectType(params) {
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: params,
  });
}
export async function fetchProjectTypeFind(params) {
  return request(`${baseUrl}/rest/projectmilestone/query`,{
    method:'POST',
    body: params,
  });
}
