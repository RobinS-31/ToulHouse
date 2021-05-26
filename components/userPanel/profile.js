// == Import : npm
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';
import PropTypes from 'prop-types';

// == Import : components
import Card from "../card";

// == Import : local
import fetcher from "../../utils/fetcherConfig";
import api from "../../utils/axiosConfig";
import { emailRegEx, specialCharRegEx } from '../../utils/regEX';


/**
 * Gère l'affichage de la partie "profile" de "userPanel".
 * @param {Object} user - Données de l'utilisateur.
 * @returns {JSX.Element}
 */
const Profile = ({ user }) => {
    const [ session, loading ] = useSession();
    const favorites = session?.user?.favorites;

    const [firstname, setFirstname] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(user.email);
    const [disabledInput, setDisabledInput] = useState(true);
    const [displaySpinnerLoader, setDisplaySpinnerLoader] = useState(true);
    const [dataFavoritesProperties, setDataFavoritesProperties] = useState({});
    const [inputError, setInputError] = useState({
        firstnameError: false,
        nameError: false,
        emailError: false
    });

    const { data, error, isValidating, mutate } = useSWR(favorites.length ? `/api/manageUser/${favorites}` : null, fetcher);

    useEffect(() => {
        favorites.length ? setDisplaySpinnerLoader(true) : setDisplaySpinnerLoader(false);
    }, []);

    useEffect(() => {
        !isValidating ? setDataFavoritesProperties(data) : null;
        data ? setDisplaySpinnerLoader(false) : null;
    }, [data, isValidating]);

    /**
     * Gère l'affichage des input du formulaire.
     * @param e
     */
    const handleInputFocusAndBlur = (e) => {
        if (e._reactName === "onFocus") {
            e.currentTarget.labels[0].classList.add('active');
        }
        if (e._reactName === "onBlur" && e.currentTarget.value.length === 0) {
            e.currentTarget.labels[0].classList.remove('active');
        }
    };

    /**
     * Gère la valeur des inputs et vérifie que les inputs ne comportent pas de caratères spéciaux.
     * @param e
     */
    const handleOnChangeInput = (e) => {
        const input = e.currentTarget;
        switch (input.id) {
            case "firstname":
                setFirstname(input.value);
                if (!specialCharRegEx.test(input.value)) {
                    inputError.firstnameError === true ? setInputError({ ...inputError, firstnameError: false }) : null;
                } else {
                    inputError.firstnameError === false ? setInputError({ ...inputError, firstnameError: true }) : null;
                }
                break;
            case 'name':
                setName(input.value);
                if (!specialCharRegEx.test(input.value)) {
                    inputError.nameError === true ? setInputError({ ...inputError, nameError: false }) : null;
                } else {
                    inputError.nameError === false ? setInputError({ ...inputError, nameError: true }) : null;
                }
                break;
            case 'email':
                setEmail(input.value);
                if (emailRegEx.test(input.value)) {
                    inputError.emailError === true ? setInputError({ ...inputError, emailError: false }) : null;
                } else {
                    inputError.emailError === false ? setInputError({ ...inputError, emailError: true }) : null;
                }
                break;
            default: break;
        }
    };

    /**
     * Gère la soumission du formulaire.
     * @param e
     */
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const { firstnameError, nameError, emailError } = inputError;

        if (!firstnameError && !nameError && !emailError) {
            const response = await api.put(
                '/api/manageUser',
                {
                    firstname: firstname !== null ? firstname : user.firstname,
                    name: name !== null ? name : user.name,
                    email
                }
            );
            if (response.status === 200) {
                setDisabledInput(true);
            }
        }
    };

    /**
     * Gère l'affichage des logements favoris.
     * @param {Object} data - Objet contenant les données des logements favoris { house: [], apartments: [] }.
     * @returns {*[]} - Retourne une instance du composant "Card".
     */
    const displayFavoritesProperty = (data) => {
        return Object.entries(data).map(propertyByCategory => {
            return propertyByCategory[1].map(property => {
                return <Card
                    property={property}
                    propertyCategory={propertyByCategory[0]}
                    mutate={mutate}
                    key={property._id}
                />
            })
        })
    };

    return (
        <div className='profile'>
            <form className='profile_info'>
                <h3 className='profile_info_title'>Mes Informations</h3>
                <div className='profile_info_input'>
                    <div className="inputContainer">
                        {inputError.firstnameError && <div className="inputContainer_error">Veuillez ne pas utiliser de caractères spéciaux</div>}
                        <input
                            id='firstname'
                            value={firstname !== null ? firstname : user.firstname}
                            disabled={disabledInput}
                            onFocus={handleInputFocusAndBlur}
                            onBlur={handleInputFocusAndBlur}
                            onChange={handleOnChangeInput}
                        />
                        <label
                            className={user.firstname.length ? 'active' : ''}
                            htmlFor='firstname'
                        >
                            Prénom
                        </label>
                    </div>
                    <div className="inputContainer">
                        {inputError.nameError && <div className="inputContainer_error">Veuillez ne pas utiliser de caractères spéciaux</div>}
                        <input
                            id='name'
                            value={name !== null ? name : user.name}
                            disabled={disabledInput}
                            onFocus={handleInputFocusAndBlur}
                            onBlur={handleInputFocusAndBlur}
                            onChange={handleOnChangeInput}
                        />
                        <label
                            className={user.name?.length ? 'active' : ''}
                            htmlFor='name'
                        >
                            Nom
                        </label>
                    </div>
                    <div className="inputContainer">
                        {inputError.emailError && <div className="inputContainer_error">Veuillez entrer une adresse email valide</div>}
                        <input
                            id='email'
                            value={email}
                            disabled={disabledInput}
                            onFocus={handleInputFocusAndBlur}
                            onBlur={handleInputFocusAndBlur}
                            onChange={handleOnChangeInput}
                        />
                        <label
                            className={user.email.length ? 'active' : ''}
                            htmlFor='email'
                        >
                            Email
                        </label>
                    </div>
                </div>
                <div className='profile_info_buttons'>
                    <button
                        className='profile_info_buttons_editButton'
                        type='button'
                        onClick={() => setDisabledInput(!disabledInput)}
                    >
                        {!disabledInput ? 'Annuler' : 'Modifier'}
                    </button>
                    <button
                        className='profile_info_buttons_saveButton'
                        type='submit'
                        disabled={disabledInput}
                        onClick={handleSubmitForm}
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
            <div className='profile_favorites'>
                <h3 className='profile_favorites_title'>Mes Favoris</h3>
                <div className='profile_favorites_items'>
                    {isValidating && displaySpinnerLoader &&
                        <div className='profile_favorites_items_loading'>
                            <div className='spinnerLoader profileLoader' />
                            <p>Chargement</p>
                        </div>
                    }
                    {dataFavoritesProperties && Object.keys(dataFavoritesProperties).length && displayFavoritesProperty(dataFavoritesProperties)}
                </div>
            </div>
            <button
                className='profile_removeAccountButton'
                type='button'
            >
                Supprimer mon compte
            </button>
        </div>
    );
};

Profile.propTypes = {
    user: PropTypes.object
};

export default Profile;
