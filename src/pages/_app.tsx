import { useState } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from 'src/context/authProvider';
import { theme } from 'src/styles/theme';
import { ReportProvider } from 'src/context/reportProvider';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <ReportProvider>
          <Component {...pageProps} />
        </ReportProvider>
      </UserProvider>
    </ChakraProvider>
  );
};
export default App;
