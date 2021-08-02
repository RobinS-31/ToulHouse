// == Import : npm
import PropTypes from 'prop-types';

// == Import : components
import Profile from './profile';
import HandleProperty from "./handleProperty";

/**
 * Gère l'affichage de "userPanel".
 * @param {Object} user - Données de l'utilisateur.
 * @returns {JSX.Element}
 */
const UserPanel = ({ user }) => {
    return (
        <div className='userPanel'>
            <div className='userPanel_menu'>
                <h2 className='userPanel_menu_title'>{!user.admin ? "Mon Compte" : "Gestion des annonces"}</h2>
            </div>
            <div className='userPanel_content'>
                {!user.admin && <Profile user={user} />}
                {user.admin && <HandleProperty />}
            </div>
        </div>
    );
};

UserPanel.propTypes = {
    user: PropTypes.object
};

export default UserPanel;
