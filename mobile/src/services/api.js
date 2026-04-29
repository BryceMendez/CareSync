import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.56.1/api', 
});

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};