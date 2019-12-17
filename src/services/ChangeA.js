import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchAA(params) {
  const str = JSON.stringify(params);
  console.log('提交的数据',str)
  return request(`${baseUrl}/rest/pmContractH/queryaudittaskbyuserid`,{
    method:'POST',
    body: str,
  });
}

