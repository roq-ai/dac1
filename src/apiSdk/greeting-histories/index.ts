import axios from 'axios';
import queryString from 'query-string';
import { GreetingHistoryInterface, GreetingHistoryGetQueryInterface } from 'interfaces/greeting-history';
import { GetQueryInterface } from '../../interfaces';

export const getGreetingHistories = async (query?: GreetingHistoryGetQueryInterface) => {
  const response = await axios.get(`/api/greeting-histories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGreetingHistory = async (greetingHistory: GreetingHistoryInterface) => {
  const response = await axios.post('/api/greeting-histories', greetingHistory);
  return response.data;
};

export const updateGreetingHistoryById = async (id: string, greetingHistory: GreetingHistoryInterface) => {
  const response = await axios.put(`/api/greeting-histories/${id}`, greetingHistory);
  return response.data;
};

export const getGreetingHistoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/greeting-histories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGreetingHistoryById = async (id: string) => {
  const response = await axios.delete(`/api/greeting-histories/${id}`);
  return response.data;
};
