import { FormEvent, useState, type RefObject } from 'react';
import {
  BoxLayout,
  Button,
  CloseIcon,
  Dialog,
  IconButton,
  NumberField,
  Separator,
  StackLayout,
  Text,
  TextField,
  useTheme
} from '@damynas/harusame-ui';

type FormField = 'firstName' | 'lastName' | 'age';

type FormFieldReferences = {
  [Key in FormField]: RefObject<HTMLInputElement>;
};

type FormFieldErrors = {
  [Key in FormField]: string;
};

type FormFieldError = {
  id: string;
  errorMessage: string;
};

const initialErrorState: FormFieldErrors = {
  firstName: '',
  lastName: '',
  age: ''
};

type UserFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  confirmButtonText?: string;
  confirmButtonLoading?: boolean;
  onConfirmButtonClick?: () => void;
  formFieldReferences: FormFieldReferences;
};

const UserFormDialog = (props: UserFormDialogProps) => {
  const {
    isOpen,
    onClose,
    title,
    confirmButtonText,
    confirmButtonLoading,
    onConfirmButtonClick,
    formFieldReferences
  } = props;

  const [errors, setErrors] = useState<FormFieldErrors>(initialErrorState);

  const getErrors = () => {
    const errors: FormFieldError[] = [];

    const firstNameField = formFieldReferences.firstName.current;
    if (firstNameField) {
      if (!firstNameField.value) {
        errors.push({
          id: firstNameField.id,
          errorMessage: 'Required'
        });
      } else if (firstNameField.value.length > 20) {
        errors.push({
          id: firstNameField.id,
          errorMessage: 'Must not exceed 20 characters'
        });
      }
    }

    const lastNameField = formFieldReferences.lastName.current;
    if (lastNameField) {
      if (!lastNameField.value) {
        errors.push({
          id: lastNameField.id,
          errorMessage: 'Required'
        });
      } else if (lastNameField.value.length > 20) {
        errors.push({
          id: lastNameField.id,
          errorMessage: 'Must not exceed 20 characters'
        });
      }
    }

    const ageField = formFieldReferences.age.current;
    if (ageField) {
      if (!ageField.value) {
        errors.push({
          id: ageField.id,
          errorMessage: 'Required'
        });
      } else if (Number(ageField.value) > 100) {
        errors.push({
          id: ageField.id,
          errorMessage: 'Must not be larger than 100'
        });
      }
    }

    return errors;
  };

  const hasErrors = () => {
    const errors = getErrors();
    if (errors.length > 0) {
      setErrors((prevState) => ({
        ...prevState,
        ...errors.reduce((accumulator, error) => {
          accumulator[error.id as FormField] = error.errorMessage;
          return accumulator;
        }, {} as FormFieldErrors)
      }));
      return true;
    }
    return false;
  };

  const handleConfirmButtonClick = () => {
    if (hasErrors()) return;

    if (onConfirmButtonClick) {
      onConfirmButtonClick();
    }
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setErrors((prevState) => ({
      ...prevState,
      ...(errors[inputTarget.id as FormField] && {
        [inputTarget.id]: ''
      })
    }));
  };

  const handleClose = () => {
    setErrors(initialErrorState);
    onClose();
  };

  const theme = useTheme();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
    >
      <StackLayout orientation='vertical'>
        <StackLayout
          height='3.125rem'
          orientation='horizontal'
          horizontalAlignment='spaceBetween'
          verticalAlignment='center'
          padding='0 0 0 0.5rem'
          style={{ flex: 'none' }}
        >
          <Text
            variant='heading3'
            fontWeight='bold'
            truncate={true}
          >
            {title ?? 'User'}
          </Text>
          <IconButton
            icon={<CloseIcon />}
            onClick={handleClose}
            size='small'
            variant='text'
            iconColor={theme?.colors.black}
          />
        </StackLayout>
        <Separator style={{ flex: 'none' }} />
        <StackLayout
          orientation='vertical'
          verticalAlignment='top'
          padding='0.5rem'
          gap='0.5rem'
        >
          <StackLayout
            orientation='horizontal'
            horizontalAlignment='left'
            verticalAlignment='top'
            gap='0.5rem'
          >
            <TextField
              ref={formFieldReferences.firstName}
              disabled={confirmButtonLoading}
              errorMessage={errors.firstName}
              id='firstName'
              label='First Name'
              placeholder='Enter first name'
              size='medium'
              onChange={handleChange}
              required
              autoFocus
            />
            <TextField
              ref={formFieldReferences.lastName}
              disabled={confirmButtonLoading}
              errorMessage={errors.lastName}
              id='lastName'
              label='Last Name'
              placeholder='Enter last name'
              size='medium'
              onChange={handleChange}
              required
            />
          </StackLayout>
          <BoxLayout
            horizontalAlignment='left'
            verticalAlignment='top'
          >
            <NumberField
              ref={formFieldReferences.age}
              disabled={confirmButtonLoading}
              errorMessage={errors.age}
              id='age'
              label='Age'
              placeholder='Enter age'
              size='small'
              onChange={handleChange}
              required
            />
          </BoxLayout>
        </StackLayout>
        <Separator style={{ flex: 'none' }} />
        <StackLayout
          orientation='horizontal'
          horizontalAlignment='right'
          verticalAlignment='center'
          padding='0.25rem'
          height='3.125rem'
          style={{ flex: 'none' }}
        >
          <Button
            text={confirmButtonText ?? 'Confirm'}
            variant='contained'
            loading={confirmButtonLoading}
            onClick={handleConfirmButtonClick}
          />
          <Button
            text='Cancel'
            variant='outlined'
            onClick={handleClose}
          />
        </StackLayout>
      </StackLayout>
    </Dialog>
  );
};

export { UserFormDialog };
export type { UserFormDialogProps };
