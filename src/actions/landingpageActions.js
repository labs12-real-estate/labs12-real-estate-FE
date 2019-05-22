import { GET_VALUATION_FETCH, GET_VALUATION_SUCCESS, GET_VALUATION_FAIL, CLEAR_ERROR } from './index';
import axios from 'axios';

export const getValuationv2 = (address, history) => dispatch => {
  dispatch({ type: GET_VALUATION_FETCH });
  const key = 'AIzaSyBQG-Y3BtowkEvTBq3dPPROa-GuMm1Rfpk';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
  return axios
    .get(url)
    .then(data => {
      let complete_address = data.data.results[0].formatted_address;
      complete_address = complete_address.slice(0, -5); // remove 5 characters ", USA" at the end
      axios
        .post(
          // 'http://testing1-env.q5yaggzwbs.us-east-2.elasticbeanstalk.com/api',
          'http://valuate.us-east-1.elasticbeanstalk.com',
          { address: complete_address }
        )
        .then(data => {
          if (!data.data.address) {
            dispatch({ type: GET_VALUATION_FAIL, payload: "This address isn't in our database, please try another one." });
          } else {
            dispatch({ type: GET_VALUATION_SUCCESS });
            localStorage.setItem('initialData', JSON.stringify(data));
            history.push('/wizard-form');
          }
        })
        .catch(error => {
          dispatch({ type: GET_VALUATION_FAIL, payload: "This address isn't in our database, please try another one." });
        });
    })
    .catch(error => {
      dispatch({ type: GET_VALUATION_FAIL, payload: error });
    });
};

export const getValuation = (address, history) => dispatch => {
  dispatch({ type: GET_VALUATION_FETCH });
  const key = 'AIzaSyBQG-Y3BtowkEvTBq3dPPROa-GuMm1Rfpk';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
  return axios
    .get(url)
    .then(data => {
      let complete_address = data.data.results[0].formatted_address;
      complete_address = complete_address.slice(0, -5); // remove 5 characters ", USA" at the end
      axios
        .post('https://myhouse-be.herokuapp.com/api/houses/getvalue', {
          complete_address
        })
        .then(data => {
          if (!data.address) {
            dispatch({ type: GET_VALUATION_FAIL, payload: "This address isn't in our database, please try another one." });
          } else {
            dispatch({ type: GET_VALUATION_SUCCESS });
            localStorage.setItem('initialData', JSON.stringify(data));
            history.push('/wizard-form');
          }
        })
        .catch(error => {
          dispatch({ type: GET_VALUATION_FAIL, payload: "This address isn't in our database, please try another one." });
        });
    })
    .catch(error => {
      dispatch({ type: GET_VALUATION_FAIL, payload: error });
    });
};

export const clearError = () => {
  return { type: CLEAR_ERROR };
};
