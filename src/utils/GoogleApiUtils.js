import ajaxUtils from './AjaxUtils';
import { HTTP_METHODS } from '../constants/strings';
import * as env from '../constants/env';

class GoogleApiUtils {
    geocodeAddress = address => {
        const url = `${env.API_URL}?${env.QS_PARAM_ADDRESS}=${address}&${env.QS_PARAM_KEY}=${env.API_KEY}`;
        return ajaxUtils.queryApi(HTTP_METHODS.get, url);
    };
}

const googleApiUtils = new GoogleApiUtils();
export default googleApiUtils;