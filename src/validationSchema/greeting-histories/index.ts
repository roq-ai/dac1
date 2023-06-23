import * as yup from 'yup';

export const greetingHistoryValidationSchema = yup.object().shape({
  sent_at: yup.date().required(),
  greeting_template_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
