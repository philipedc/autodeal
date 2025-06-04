import { makeRequest } from '../libs/RequestModule';
import store from '@/store/index.js'

const getUserCars = async (id) => {
    // gets the logged in user
    const response = (await makeRequest('GET', `/users/${id}/cars`))
    return response
}

const addUserCar = async (formData) => {
    // gets the logged in user
    const response = (await makeRequest('POST', `/cars`, formData, true))
    return response
}

export { getUserCars, addUserCar }