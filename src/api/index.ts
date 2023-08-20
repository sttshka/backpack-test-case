export const API_URL =
  "https://us-central1-seven-seven-bit-inhouse-helper.cloudfunctions.net/vueDevTestTask-getInventoryState";

export const getData = async (endpoint: string, params: string) => {
  const response = await fetch(`${API_URL}/${endpoint}?${params}`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const getInventoryState = async (params) => {
  return await getData("vueDevTestTask-getInventoryState", params);
};
