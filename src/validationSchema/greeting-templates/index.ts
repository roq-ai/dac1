import * as yup from 'yup';

export const greetingTemplateValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
