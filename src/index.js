import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./i18next"

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const muiTheme = createTheme();
const chakraTheme = extendTheme({ colors })

const theme = deepmerge(chakraTheme, muiTheme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      {/* <ChakraProvider theme={chakraTheme}>
        <ThemeProvider theme={muiTheme}> */}
          <Suspense fallback={(<div>Loading ~~</div>)}>
            <App />
          </Suspense>
        {/* </ThemeProvider>
      </ChakraProvider> */}
  </React.StrictMode>
);


