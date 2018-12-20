import axios from 'axios';

import { HTTP_METHODS, AJAX_ERROR } from '../constants/strings';

class AjaxUtils {
    /**
     * Handle ajax calls centrally
     * @param {String} method The chosen HTTP method
     * @param {String} url The url to request
     * @param {Object} body The body of the request, optional
     */
    queryApi = async (method, url, body) => {
        let response;
        try {
            switch (method) {
                case HTTP_METHODS.get:
                    response = await axios.get(url);
                    break;
                case HTTP_METHODS.post:
                    response = await axios.post(url, body);
                    break;
                case HTTP_METHODS.put:
                    response = await axios.put(url, body);
                    break;
                case HTTP_METHODS.delete:
                    response = await axios.delete(url);
                    break;
                default:
                    throw new Error(`${AJAX_ERROR}${method}`);
            }
            return response.data;
        }
        catch (error) { throw error; }
    };
}

const ajaxUtils = new AjaxUtils();
export default ajaxUtils;