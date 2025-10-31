import axios from 'axios';

const API_BASE_URL = 'https://ofc-test-01.tspb.su/test-task/vehicles';

const carsApi = {
  getCars: () => axios.get(`${API_BASE_URL}`),
//   getCar: (id) => axios.get(`${API_BASE_URL}/cars/${id}`),
//   createCar: (carData) => axios.post(`${API_BASE_URL}/cars`, carData),
//   updateCar: (id, carData) => axios.put(`${API_BASE_URL}/cars/${id}`, carData),
//   deleteCar: (id) => axios.delete(`${API_BASE_URL}/cars/${id}`),
};

export default carsApi;