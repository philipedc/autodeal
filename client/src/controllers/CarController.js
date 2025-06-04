import { makeRequest } from '../libs/RequestModule';

const getCar = async (id) => {
    const response = (await makeRequest('GET', `/cars/${id}`))
    return response
}

const getVendor = async (id) => {
    const response = (await makeRequest('GET', `/users/${id}`))
    return response
}

const getAllCars = async () => {
   
    const response = (await makeRequest('GET', '/cars'))
    return response
}

const deleteCar = async (id) => {
    const response = await makeRequest('DELETE', `/cars/${id}`);
    return response;
};

export { getCar, getVendor, getAllCars, deleteCar };

