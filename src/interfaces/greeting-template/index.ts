import { GreetingHistoryInterface } from 'interfaces/greeting-history';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface GreetingTemplateInterface {
  id?: string;
  title: string;
  content: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  greeting_history?: GreetingHistoryInterface[];
  company?: CompanyInterface;
  _count?: {
    greeting_history?: number;
  };
}

export interface GreetingTemplateGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  content?: string;
  company_id?: string;
}
