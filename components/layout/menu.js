// == Import : npm
import { useRef, useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';

// == Import : local
import { PropertiesFilterContext } from '../../context/propertiesFilterContext';

/**
 * Menu de navigation.
 * @returns {JSX.Element}
 */
const Menu = () => {
    const [propertiesFilterState, dispatchPropertiesFilterState] = useContext(PropertiesFilterContext);
    const header = useRef(null);
    const navMenuContentList = useRef(null);
    const [session, loading] = useSession();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        window.onresize = () => {
            setIsOpen(false); // Ferme le menu
        }
    }, []);

    useEffect(() => {
        handleMenuDisplay();
    }, [isOpen]);

    /**
     * Modifie l'affichage du menu pour les écrans inférieur à 768px.
     */
    const handleMenuDisplay = () => {
        const navMenuContentListChildren = navMenuContentList.current.childNodes;

        if (header.current.clientWidth < 768 && isOpen) {
            navMenuContentList.current.classList.replace('hideMenu', 'displayMenu');
            setTimeout(() => {
                navMenuContentList.current.classList.add('displayMenu_overflow');
            },500)
        } else {
            navMenuContentList.current.classList.remove('displayMenu_overflow');
            navMenuContentList.current.classList.replace('displayMenu', 'hideMenu');
        }
    };

    /**
     * Gère l'affichage du menu.
     * @param e
     */
    const handleDropdownItemDisplay = (e) => {
        if (e._reactName === "onBlur" && e.relatedTarget?.className !== "navMenuDropdownItemChild") {
            e.currentTarget.nextSibling.classList.remove('show');
            e.relatedTarget?.className !== "navMenuContentButton" ? setIsOpen(false) : null;
        }
        if (e._reactName === "onClick") {
            if (e.currentTarget.type === "button") {
                e.currentTarget.nextSibling.classList.contains('show')
                    ? e.currentTarget.nextSibling.classList.remove('show')
                    : e.currentTarget.nextSibling.classList.add('show');
            }
            if (e.currentTarget.nodeName === "DIV") {
                e.currentTarget.classList.remove('show');
                setIsOpen(false);
            }
        }
    };

    /**
     * Gère la déconnexion de l'utilisateur depuis le menu.
     * @param e
     */
    const handleOnClickDisconnectUser = (e) => {
        e.preventDefault();
        signOut({ callbackUrl: "/" });
    };

    return (
        <header
            className="header"
            ref={header}
        >
            <nav className="navMenu">
                <div className="navMenuBrand">
                    <Link href={"/"} passHref>
                        <a>
                            <strong>ToulHouse</strong>
                        </a>
                    </Link>
                </div>
                <div className="navMenuContent">
                    <ul
                        className="navMenuContentList hideMenu"
                        ref={navMenuContentList}
                    >
                        <li>
                            <div className="navMenuContentListDropdown">
                                <button
                                    type="button"
                                    className="navMenuContentButton"
                                    onClick={handleDropdownItemDisplay}
                                    onBlur={handleDropdownItemDisplay}
                                >
                                    Acheter
                                </button>
                                <div
                                    className="navMenuContentListDropdownItem navMenuDropdownItem"
                                    onClick={handleDropdownItemDisplay}
                                >
                                    <Link href={"/recherche/achat-maison"} passHref>
                                        <a
                                            className="navMenuDropdownItemChild"
                                            onClick={() => dispatchPropertiesFilterState({ type: 'RESETFILTER' })}
                                        >
                                            Maison
                                        </a>
                                    </Link>
                                    <Link href={"/recherche/achat-appartement"} passHref>
                                        <a
                                            className="navMenuDropdownItemChild"
                                            onClick={() => dispatchPropertiesFilterState({ type: 'RESETFILTER' })}
                                        >
                                            Appartement
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="navMenuContentListDropdown">
                                <button
                                    type="button"
                                    className="navMenuContentButton"
                                    onBlur={handleDropdownItemDisplay}
                                    onClick={handleDropdownItemDisplay}
                                >
                                    Louer
                                </button>
                                <div
                                    className="navMenuContentListDropdownItem navMenuDropdownItem"
                                    onClick={handleDropdownItemDisplay}
                                >
                                    <Link href={"/recherche/location-maison"} passHref>
                                        <a
                                            className="navMenuDropdownItemChild"
                                            onClick={() => dispatchPropertiesFilterState({ type: 'RESETFILTER' })}
                                        >
                                            Maison
                                        </a>
                                    </Link>
                                    <Link href={"/recherche/location-appartement"} passHref>
                                        <a
                                            className="navMenuDropdownItemChild"
                                            onClick={() => dispatchPropertiesFilterState({ type: 'RESETFILTER' })}
                                        >
                                            Appartement
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <button
                    className="navMenuButton"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {!session && !loading &&
                    <Link href={"/auth"} passHref>
                        <a className="navMenuAuth">
                            <FontAwesomeIcon icon={faUserCircle} className="navMenuAuthIcon" />
                        </a>
                    </Link>
                }
                {session && !loading &&
                    <div className="navMenuAuth">
                        <div className="navMenuAuthDropdown">
                            <button
                                type="button"
                                className="navMenuAuthButton"
                                onClick={(e) => {
                                    setIsOpen(false);
                                    handleDropdownItemDisplay(e);
                                }}
                                onBlur={handleDropdownItemDisplay}
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="navMenuAuthButtonIcon" />
                            </button>
                            <div
                                className="navMenuAuthDropdownItem navMenuDropdownItem"
                                onClick={handleDropdownItemDisplay}
                            >
                                <Link href={"/dashboard"} passHref>
                                    <a className="navMenuDropdownItemChild">
                                        Mon Compte
                                    </a>
                                </Link>
                                <a
                                    className="navMenuDropdownItemChild"
                                    href="#"
                                    onClick={handleOnClickDisconnectUser}
                                >
                                    Déconnexion
                                </a>
                            </div>
                        </div>
                    </div>
                }
            </nav>
        </header>
    );
};

export default Menu;
