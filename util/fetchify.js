import 'isomorphic-unfetch';
import { HOST_URL } from '../helpers';
import qs from 'querystringify';

export const fetchify = {
  get(url, query = {}) {
    const href = HOST_URL + url + qs.stringify(query, true);
    return fetch(href);
  },
  async post(url) {

  }
}