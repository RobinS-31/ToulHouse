// == Import : npm
import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faDoorOpen, faBed, faTimes, faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

// == Import : local
import { priceFormatted } from "../utils/tools";
import api from "../utils/axiosConfig";


/**
 * Gère l'affichage d'une propriété.
 * @param {Object} property - Données d'une propriété.
 * @param {string} propertyCategory - Catégory de la propriété (house, apartment).
 * @param {function} mutate - Fonction pour récupérer la liste des propriétés (lié a SWR).
 * @returns {JSX.Element}
 */
const Card = ({ property, propertyCategory, mutate }) => {

    const [session, loading] = useSession();
    const emptyHeartIcon = useRef(null);
    const fullHeartIcon = useRef(null);
    const [isFavMessage, setIsFavMessage] = useState(false);
    const favorites = session?.user?.favorites;

    useEffect(() => {
        if (favorites?.includes(property._id)) {
            emptyHeartIcon.current.classList.remove("show");
            fullHeartIcon.current.classList.add("show");
        }
    }, [favorites]);

    /**
     * Gère l'affichage du bouton "like".
     */
    const handleLikeButton = async () => {
        if (session && !loading) {
            if (!favorites.includes(property._id)) {
                favorites.push(property._id);
                const response = await api.put(
                    '/api/manageUser',
                    { favorites }
                );
                if (response.status === 200) {
                    emptyHeartIcon.current.classList.remove("show");
                    fullHeartIcon.current.classList.add("show");
                }
            } else {
                const findFavoriteIndex = favorite => favorite === property._id;
                const favoriteToRemoveIndex = favorites.findIndex(findFavoriteIndex);
                favorites.splice(favoriteToRemoveIndex, 1);

                const response = await api.put(
                    '/api/manageUser',
                    { favorites }
                );
                if (response.status === 200) {
                    fullHeartIcon.current.classList.remove("show");
                    emptyHeartIcon.current.classList.add("show");
                    mutate ? mutate() : null;
                }
            }
        } else {
            isFavMessage ? setIsFavMessage(false) : setIsFavMessage(true);
        }
    };

    return (
        <div className="card">
            <div className="card_entity">
                <Link
                    href={`/detail/${propertyCategory === "houses" ? "maison" : "appartement"}/${property._id}`}
                    passHref
                >
                    <a>
                        <div className="card_entity_img">
                            <img
                                className="card_entity_img_bg"
                                src={property.images[0].h200}
                                alt={property.title}
                                loading="lazy"
                            />
                        </div>
                    </a>
                </Link>
                <div className="card_body">
                    <h4 className="card_body_title">{property.title}</h4>
                    <div className="card_body_text">
                        <div className="card_body_text_details">
                            <FontAwesomeIcon className="card_body_text_details_icon" icon={faRulerCombined}/><span
                            className="card_body_text_details_content">{property.surface} m²</span>
                            <FontAwesomeIcon className="card_body_text_details_icon" icon={faDoorOpen}/><span
                            className="card_body_text_details_content">{property.pcsNbr} p.</span>
                            <FontAwesomeIcon className="card_body_text_details_icon" icon={faBed}/><span
                            className="card_body_text_details_content">{property.bedroomNbr} ch.</span>
                        </div>
                        <strong>{priceFormatted(property.price)}<span>{property.type === 1 ? " / mois" : ""}</span></strong>
                    </div>
                    <Link href={`/detail/${propertyCategory === "houses" ? "maison" : "appartement"}/${property._id}`}
                          passHref
                    >
                        <a>
                            <button
                                className={`card_body_detailButton ${property.type === 0 ? "buy" : "rent"}`}
                            >
                                detail
                            </button>
                        </a>
                    </Link>
                    <div className="card_body_favorite">
                        <div className="card_body_favorite_content">
                            <button
                                className="card_body_favorite_content_likeButton"
                                onClick={handleLikeButton}
                            >
                                <FontAwesomeIcon
                                    className="card_body_favorite_content_likeButton_icon empty show"
                                    icon={emptyHeart}
                                    forwardedRef={emptyHeartIcon}
                                />
                                <FontAwesomeIcon
                                    className="card_body_favorite_content_likeButton_icon full"
                                    icon={fullHeart}
                                    forwardedRef={fullHeartIcon}
                                />
                            </button>
                            {isFavMessage &&
                                <div
                                    className="card_body_favorite_content_message"
                                >
                                    <button
                                        className="card_body_favorite_content_message_closeButton"
                                        type="button"
                                        title="Fermer cette fenêtre"
                                        onClick={() => setIsFavMessage(false)}
                                    >
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                    <p className="card_body_favorite_content_message_text">Pour sauvegarder cette annonce vous devez vous connecter ou créer un compte.</p>
                                    <Link href={"/auth"} passHref>
                                        <a className="card_body_favorite_content_message_authLink">
                                            <button
                                                className="card_body_favorite_content_message_authLink_button"
                                                type="button"
                                            >
                                                Se Connecter / Créer un compte
                                            </button>
                                        </a>
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

Card.propTypes = {
    property: PropTypes.object,
    propertyCategory: PropTypes.string,
    mutate: PropTypes.func
};

export default Card;
