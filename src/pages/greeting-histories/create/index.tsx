import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createGreetingHistory } from 'apiSdk/greeting-histories';
import { Error } from 'components/error';
import { greetingHistoryValidationSchema } from 'validationSchema/greeting-histories';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { GreetingTemplateInterface } from 'interfaces/greeting-template';
import { UserInterface } from 'interfaces/user';
import { getGreetingTemplates } from 'apiSdk/greeting-templates';
import { getUsers } from 'apiSdk/users';
import { GreetingHistoryInterface } from 'interfaces/greeting-history';

function GreetingHistoryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GreetingHistoryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGreetingHistory(values);
      resetForm();
      router.push('/greeting-histories');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GreetingHistoryInterface>({
    initialValues: {
      sent_at: new Date(new Date().toDateString()),
      greeting_template_id: (router.query.greeting_template_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: greetingHistoryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Greeting History
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="sent_at" mb="4">
            <FormLabel>Sent At</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.sent_at ? new Date(formik.values?.sent_at) : null}
                onChange={(value: Date) => formik.setFieldValue('sent_at', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<GreetingTemplateInterface>
            formik={formik}
            name={'greeting_template_id'}
            label={'Select Greeting Template'}
            placeholder={'Select Greeting Template'}
            fetcher={getGreetingTemplates}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'greeting_history',
  operation: AccessOperationEnum.CREATE,
})(GreetingHistoryCreatePage);
