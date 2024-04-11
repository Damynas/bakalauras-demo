import { useState } from 'react';
import {
  BoxLayout,
  Button,
  FontProvider,
  Text,
  ThemeProvider,
  Themes,
  StackLayout,
  useSnackbar,
  type Theme
} from '@damynas/harusame-ui';
import { UserList } from './UserList';

const defaultTheme = Themes.hunterGreen;

const App = () => {
  const { renderSnackbar, openSnackbar } = useSnackbar();

  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const changeTheme = () => {
    setTheme(
      theme === Themes.hunterGreen ? Themes.purpleSapphire : Themes.hunterGreen
    );
  };

  return (
    <FontProvider>
      <ThemeProvider theme={theme}>
        <StackLayout
          orientation='vertical'
          verticalAlignment='top'
          height='100vh'
          gap='3rem'
        >
          <StackLayout
            height='3rem'
            orientation='horizontal'
            horizontalAlignment='spaceBetween'
            verticalAlignment='center'
            padding='0 1rem'
            backgroundColor={theme.colors.primary500}
          >
            <BoxLayout
              horizontalAlignment='center'
              verticalAlignment='center'
            >
              <Text
                variant='heading1'
                fontWeight='bold'
                color={theme.colors.white}
              >
                HARUSAME UI
              </Text>
            </BoxLayout>
            <Button
              variant='contained'
              text='Change Theme'
              onClick={changeTheme}
            />
          </StackLayout>
          <UserList openSnackbar={openSnackbar} />
        </StackLayout>
        {renderSnackbar({})}
      </ThemeProvider>
    </FontProvider>
  );
};

export { App };
