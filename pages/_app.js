// == Import : npm
import { Provider } from 'next-auth/client';

// == Import : local
import { PropertiesFilterContextProvider } from '../context/propertiesFilterContext';

// == Import : styles
import '../styles/globals.scss';
import '../styles/extraLarge.scss';
import '../styles/large.scss';
import '../styles/medium.scss';
import '../styles/small.scss';
import '../styles/extraSmall.scss';

const MyApp = ({ Component, pageProps }) => (
    <Provider session={pageProps.session}>
        <PropertiesFilterContextProvider>
            <Component {...pageProps} />
        </PropertiesFilterContextProvider>
    </Provider>
);

export default MyApp;
