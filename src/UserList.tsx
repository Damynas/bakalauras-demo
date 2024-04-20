import { useEffect, useRef, useState } from 'react';
import {
  BoxLayout,
  Button,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeader,
  DataTableRow,
  DeleteIcon,
  EditIcon,
  IconButton,
  StackLayout,
  useDialog,
  type NumberFieldElement,
  type TextFieldElement
} from '@damynas/harusame-ui';
import { UserFormDialog, type UserFormDialogProps } from './UserFormDialog';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    firstName: 'Testy',
    lastName: 'McTesty',
    age: '25'
  },
  {
    id: 2,
    firstName: 'Rupert',
    lastName: 'Brown',
    age: '55'
  },
  {
    id: 3,
    firstName: 'Jacob',
    lastName: 'Ironside',
    age: '15'
  }
];

type UserListProps = {
  openSnackbar: (
    message: string,
    variant?: 'info' | 'success' | 'warning' | 'error' | 'default',
    duration?: number
  ) => void;
};

const UserList = (props: UserListProps) => {
  const { openSnackbar } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);

  const formFieldReferences = {
    firstNameFieldRef: useRef<TextFieldElement>(null),
    lastNameFieldRef: useRef<TextFieldElement>(null),
    ageFieldRef: useRef<NumberFieldElement>(null)
  };

  const [userFormDialogState, setUserFormDialogState] = useState<
    Omit<UserFormDialogProps, 'isOpen' | 'onClose'>
  >({
    formFieldReferences: {
      firstName: formFieldReferences.firstNameFieldRef,
      lastName: formFieldReferences.lastNameFieldRef,
      age: formFieldReferences.ageFieldRef
    }
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const { renderDialog, openDialog, closeDialog } = useDialog({
    variant: 'confirm'
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleAddButtonClick = () => {
    if (formFieldReferences.firstNameFieldRef.current)
      formFieldReferences.firstNameFieldRef.current.value = '';

    if (formFieldReferences.lastNameFieldRef.current)
      formFieldReferences.lastNameFieldRef.current.value = '';

    if (formFieldReferences.ageFieldRef.current)
      formFieldReferences.ageFieldRef.current.value = '';

    setUserFormDialogState((prevState) => ({
      ...prevState,
      title: 'Add User',
      confirmButtonText: 'Add',
      onConfirmButtonClick: handleUserCreation
    }));

    setFormDialogOpen(true);
  };

  const handleEditButtonClick = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (!user) return;

    if (formFieldReferences.firstNameFieldRef.current)
      formFieldReferences.firstNameFieldRef.current.value = user.firstName;

    if (formFieldReferences.lastNameFieldRef.current)
      formFieldReferences.lastNameFieldRef.current.value = user.lastName;

    if (formFieldReferences.ageFieldRef.current)
      formFieldReferences.ageFieldRef.current.value = user.age;

    setUserFormDialogState((prevState) => ({
      ...prevState,
      title: 'Edit User',
      confirmButtonText: 'Edit',
      onConfirmButtonClick: () => handleUserEdit(id)
    }));

    setFormDialogOpen(true);
  };

  const handleDeleteButtonClick = (id: number) => {
    setUserId(id);
    openDialog();
  };

  const handleUserCreation = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setUsers((prevState) => [
        ...prevState,
        {
          id: users.length ? users[users.length - 1].id + 1 : 1,
          firstName: formFieldReferences.firstNameFieldRef.current?.value,
          lastName: formFieldReferences.lastNameFieldRef.current?.value,
          age: formFieldReferences.ageFieldRef.current?.value
        } as User
      ]);
      setFormDialogOpen(false);
      openSnackbar('User created successfully', 'success', 3000);
    }, 2000);
  };

  const handleUserEdit = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (
      !user ||
      (user.firstName ===
        formFieldReferences.firstNameFieldRef.current?.value &&
        user.lastName === formFieldReferences.lastNameFieldRef.current?.value &&
        user.age === formFieldReferences.ageFieldRef.current?.value)
    )
      return;

    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setUsers(
        users.map((user) =>
          user.id === id
            ? ({
                ...user,
                firstName: formFieldReferences.firstNameFieldRef.current?.value,
                lastName: formFieldReferences.lastNameFieldRef.current?.value,
                age: formFieldReferences.ageFieldRef.current?.value
              } as User)
            : user
        )
      );

      setFormDialogOpen(false);
      openSnackbar('User updated successfully', 'success', 3000);
    }, 2000);
  };

  const handleUserDeletion = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setUsers(users.filter((user) => user.id !== userId));
      setUserId(null);
      closeDialog();
      openSnackbar('User deleted successfully', 'success', 3000);
    }, 2000);
  };

  const handleClose = () => {
    setUserId(null);
    setFormDialogOpen(false);
  };

  const renderRow = (user: User) => {
    return (
      <DataTableRow key={user.id}>
        <DataTableCell
          alignment='left'
          variant='body'
          minWidth='6rem'
        >
          {user.firstName}
        </DataTableCell>
        <DataTableCell
          alignment='left'
          variant='body'
          minWidth='6rem'
        >
          {user.lastName}
        </DataTableCell>
        <DataTableCell
          alignment='right'
          variant='body'
          minWidth='3rem'
        >
          {user.age}
        </DataTableCell>
        <DataTableCell
          alignment='right'
          variant='body'
          width='8rem'
        >
          {renderActionButtons(user)}
        </DataTableCell>
      </DataTableRow>
    );
  };

  const renderActionButtons = (user: User) => {
    return (
      <StackLayout
        orientation='horizontal'
        horizontalAlignment='right'
        verticalAlignment='center'
        gap='0.5rem'
      >
        <IconButton
          variant='text'
          icon={<EditIcon />}
          onClick={() => handleEditButtonClick(user.id)}
        />
        <IconButton
          variant='text'
          icon={<DeleteIcon />}
          onClick={() => handleDeleteButtonClick(user.id)}
        />
      </StackLayout>
    );
  };

  return (
    <>
      <BoxLayout
        horizontalAlignment='center'
        verticalAlignment='top'
      >
        <StackLayout
          width='80%'
          orientation='vertical'
        >
          <BoxLayout
            height='3rem'
            horizontalAlignment='left'
            verticalAlignment='center'
            padding='0 1rem'
          >
            <Button
              variant='contained'
              text='Add User'
              size='small'
              disabled={loading}
              onClick={handleAddButtonClick}
            />
          </BoxLayout>
          <DataTable
            hoverable
            autoFooter
            loading={loading}
          >
            <DataTableHeader>
              <DataTableRow>
                <DataTableCell
                  alignment='left'
                  variant='header'
                  minWidth='6rem'
                >
                  First Name
                </DataTableCell>
                <DataTableCell
                  alignment='left'
                  variant='header'
                  minWidth='6rem'
                >
                  Last Name
                </DataTableCell>
                <DataTableCell
                  alignment='right'
                  variant='header'
                  minWidth='3rem'
                >
                  Age
                </DataTableCell>
                <DataTableCell
                  alignment='right'
                  variant='header'
                  width='8rem'
                />
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>{users.map(renderRow)}</DataTableBody>
          </DataTable>
        </StackLayout>
      </BoxLayout>
      {renderDialog({
        message: `Are you sure you want to delete this user?
        This action is irreversible.`,
        confirmButtonLoading: actionLoading,
        onConfirmButtonClick: handleUserDeletion
      })}
      <UserFormDialog
        {...userFormDialogState}
        isOpen={formDialogOpen}
        onClose={handleClose}
        confirmButtonLoading={actionLoading}
      />
    </>
  );
};

export { UserList };
