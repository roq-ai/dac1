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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getGreetingHistoryById, updateGreetingHistoryById } from 'apiSdk/greeting-histories';
import { Error } from 'components/error';
import { greetingHistoryValidationSchema } from 'validationSchema/greeting-histories';
import { GreetingHistoryInterface } from 'interfaces/greeting-history';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { GreetingTemplateInterface } from 'interfaces/greeting-template';
import { UserInterface } from 'interfaces/user';
import { getGreetingTemplates } from 'apiSdk/greeting-templates';
import { getUsers } from 'apiSdk/users';

function GreetingHistoryEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GreetingHistoryInterface>(
    () => (id ? `/greeting-histories/${id}` : null),
    () => getGreetingHistoryById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: GreetingHistoryInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateGreetingHistoryById(id, values);
      mutate(updated);
      resetForm();
      router.push('/greeting-histories');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<GreetingHistoryInterface>({
    initialValues: data,
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
            Edit Greeting History
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'greeting_history',
  operation: AccessOperationEnum.UPDATE,
})(GreetingHistoryEditPage);
