import { GreetingTemplateInterface } from 'interfaces/greeting-template';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface GreetingHistoryInterface {
  id?: string;
  greeting_template_id: string;
  user_id: string;
  sent_at?: any;
  created_at?: any;
  updated_at?: any;

  greeting_template?: GreetingTemplateInterface;
  user?: UserInterface;
  _count?: {};
}

export interface GreetingHistoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  greeting_template_id?: string;
  user_id?: string;
}
