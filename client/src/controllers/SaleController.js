import { makeRequest } from '../libs/RequestModule';

const performSale = async (idCarro, idVendedor, idComprador) => {
    const response = (await makeRequest('POST', '/sales', { idCarro, idVendedor, idComprador }))
    return response
}

export { performSale }