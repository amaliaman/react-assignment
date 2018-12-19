import ajaxUtils from './AjaxUtils';

class GoogleApiUtils {
    key = 'AIzaSyBDgy2yW_NWIkjA9IkIx2Z1VpSu8AUSGV0'; // REMOVE////////////

    geocodeAddress = address => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.key}`;
        return ajaxUtils.queryApi('get', url);
    };
}

const googleApiUtils = new GoogleApiUtils();
export default googleApiUtils;