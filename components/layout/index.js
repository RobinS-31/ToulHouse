// == Import : npm
import PropTypes from 'prop-types';

// == Import : components
import Menu from "./menu";
import Footer from './footer';

/**
 * Dispostion générale.
 * @param {Object} children
 * @returns {JSX.Element}
 */
const Layout = ({children}) => (
    <>
        <Menu/>
        {children}
        <Footer/>
    </>
);

Layout.propTypes = {
    children: PropTypes.object
};

export default Layout;
