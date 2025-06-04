import { makeRequest } from '../libs/RequestModule';

const getCar = async (id) => {
    const response = (await makeRequest('GET', `/car/${id}`))
    return response
}

const getVendor = async (id) => {
    const response = (await makeRequest('GET', `/users/${id}`))
    return response
}

const getAllCars = async () => {
   
    const response = (await makeRequest('GET', '/car'))
    return response
}

export { getCar, getVendor, getAllCars }