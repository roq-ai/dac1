import axios from 'axios';
import queryString from 'query-string';
import { GreetingTemplateInterface, GreetingTemplateGetQueryInterface } from 'interfaces/greeting-template';
import { GetQueryInterface } from '../../interfaces';

export const getGreetingTemplates = async (query?: GreetingTemplateGetQueryInterface) => {
  const response = await axios.get(`/api/greeting-templates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGreetingTemplate = async (greetingTemplate: GreetingTemplateInterface) => {
  const response = await axios.post('/api/greeting-templates', greetingTemplate);
  return response.data;
};

export const updateGreetingTemplateById = async (id: string, greetingTemplate: GreetingTemplateInterface) => {
  const response = await axios.put(`/api/greeting-templates/${id}`, greetingTemplate);
  return response.data;
};

export const getGreetingTemplateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/greeting-templates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGreetingTemplateById = async (id: string) => {
  const response = await axios.delete(`/api/greeting-templates/${id}`);
  return response.data;
};
