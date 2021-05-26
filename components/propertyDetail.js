// == Import : npm
import { useEffect, useState, useRef, useContext } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRulerCombined,
    faDoorOpen,
    faBed,
    faAngleLeft,
    faAngleRight,
    faExpand,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

// == Import : local
import { PropertiesFilterContext } from "../context/propertiesFilterContext";
import { priceFormatted, resizeImageFullscreen } from "../utils/tools";


/**
 * Gère l'affichage du détail d'une propriété.
 * @param {Object} property - Données de la propriété à afficher.
 * @returns {JSX.Element}
 */
const PropertyDetail = ({ property }) => {
    const [propertiesFilterState, dispatchPropertiesFilterState] = useContext(PropertiesFilterContext);

    const [activeItem, setActiveItem] = useState(1); // Correspond à l'index de l'image active (celle affiché dans le carousel).
    const [scrollbarPosition, setScrollbarPosition] = useState(0); // Définit la position que la scrollbar devra avoir dans le container des miniatures (si le scroll est possible).
    const [letsScroll, setLetsScroll] = useState(false); // Autorise ou non la scrollbar à correspondre à la position indiquer par "scrollbarPosition" (voir useEffect un peu plus bas).
    const [displayButtonScrollMiniatureContainer, setDisplayButtonScrollMiniatureContainer] = useState(false); // Affiche ou non les boutons indiquant et permettant le scroll dans le container des miniatures.
    const [isFullscreen, setIsFullscreen] = useState(false); // Indique si le client est actuellement en plein écran ou non.
    const [displayMoreText, setDisplayMoreText] = useState(false); // Permet d'afficher entièrement ou non la description du bien.
    const [displayReference, setDisplayReference] = useState(false); // Permet d'afficher entièrement ou non la référence du bien.
    const [descriptionTextHeight, setDescriptionTextHeight] = useState(0); // Correspond à la hauteur du paragraphe contenant la description du bien.
    const [touchEventStart, setTouchEventStart] = useState({}); // Correspond à la position de l'axe X et Y au moment où l'évènement "TouchEvent" se déclenche.

    const contentScroll = useRef(null); // Fait référence à l'espace (en largeur ou en hauteur) qu'il est possible de scroller dans la galerie d'image miniature.
    const imageActiveOnCarousel = useRef(null); // Fait référence a l'image affichée dans le carousel.
    const imageMiniActive = useRef(null); // Fait référence à l'index de l'image miniature "active" (celle affiché dans le carousel).
    const descriptionHeight = useRef(null); // Fait référence à la hauteur du paragraphe contenant la description.
    const fullElToSwitchToFullscreen = useRef(null); // Fait référence a la section "propertyDetailTopMain" (carousel + galerie).
    const oneElToSwitchToFullscreen = useRef(null); // Fait référence a la class "propertyDetailTopMainCarousel" (caroussel) de la section "propertyDetailTopMain".
    const carouselImgContainer = useRef(null); // Fait référence à la class "propertyDetailTopMainCarouselImgContainer" (div qui contient les images) de la section "propertyDetailTopMain".

    useEffect(() => {
        /* Défini la hauteur du paragraphe contenant la description afin d'adapter la hauteur de la div contennant le paragraphe si l'utilisateur souhaite l'afficher entièrement. */
        setDescriptionTextHeight(descriptionHeight.current.clientHeight);

        /*
        * Si la hauteur ou la largeur totale du contenu (images miniatures) est plus importante que ce qui peut être affiché sur la vue de l'utilisateur alors on passe "displayButtonScrollMiniatureContainer" sur true,
        * ce qui affichera des "flèches" indiquant que l'on peut scroller et permetant de la faire en cliquant dessus.
        */
        if (contentScroll.current.scrollHeight > contentScroll.current.clientHeight || contentScroll.current.scrollWidth > contentScroll.current.clientWidth) {
            setDisplayButtonScrollMiniatureContainer(true)
        } else {
            setDisplayButtonScrollMiniatureContainer(false)
        }

        /*
        * Si l'utlisateur reviens en arrière via le bouton retour, on passe "fromHistoryBack" sur true.
        */
        window.onpopstate = (event) => {
            dispatchPropertiesFilterState({
                type: "SETFILTER",
                name: "fromHistoryBack",
                value: true
            });
        };

        /* Permet d'appeler la fonction "resizeImageFullscreen" lors d'un redimensionnement de la vue, par exemple en passant d'un affichage portrait à paysage */
        window.onresize = (event) => {
            Array.from(carouselImgContainer.current.childNodes).map(img => {
                const resizeImage = resizeImageFullscreen(
                    img.naturalWidth,
                    img.naturalHeight,
                    carouselImgContainer.current.offsetWidth,
                    carouselImgContainer.current.offsetHeight
                );
                img.style.width = resizeImage.width;
                img.style.height = resizeImage.height;
            })
            setDescriptionTextHeight(descriptionHeight.current.clientHeight);
        };

        return () => {
            window.onpopstate = null;
            window.onresize = null;
        };
    }, []);

    useEffect(() => {
        /*
        * Si "letScroll" est true alors on indique à la barre de défilement de correspondre à la position indiqué par "scrollbarPosition".
        * Cette action fait suite à un changement d'image dans le carousel, de sorte à ce que la miniature représenter comme active (celle qui correspond donc à l'image afficher dans le carousel)
        * soit visible dans le container affichant les miniatures.
        */
        if (letsScroll) {
            contentScroll.current.scrollTo(
                screen.width >= 992
                    ? { top: scrollbarPosition, behavior: 'smooth' }
                    : { left: scrollbarPosition, behavior: 'smooth'}
            );
            setLetsScroll(false);
        }
    }, [scrollbarPosition, letsScroll]);

    /**
     * Gère le changement d'images dans le carousel via le click sur une miniatures.
     * @param e
     */
    const handleOnClickImagesMiniature = (e) => {
        setActiveItem(parseInt(e.currentTarget.dataset.id, 10));
    };

    /**
     * Gère le changement d'images dans le carousel via les bouton.
     * @param e
     */
    const handleOnClickSwitchImage = (e) => {
        if (e.currentTarget.dataset.shift === "prev") {
            activeItem !== 1 ? setActiveItem(activeItem - 1) : null;
            contentScroll.current.scrollTo(
                screen.width >= 992
                    ? { top: (parseInt(imageMiniActive.current.offsetTop) - 220), behavior: 'smooth' }
                    : { left: (parseInt(imageMiniActive.current.offsetLeft) - 220), behavior: 'smooth'}
            );
        }
        if (e.currentTarget.dataset.shift === "next") {
            activeItem !== property.images.length ? setActiveItem(activeItem + 1) : null;
            contentScroll.current.scrollTo(
                screen.width >= 992
                    ? { top: parseInt(imageMiniActive.current.offsetTop), behavior: 'smooth' }
                    : { left: parseInt(imageMiniActive.current.offsetLeft), behavior: 'smooth'}
            );
        }
    };

    /**
     * Gère l'affichage du container des miniatures.
     * @param e
     */
    const handleOnClickButtonScrollMiniatureContainer = (e) => {
        const thumbnailTotalHeightOrWidthScroll = screen.width >= 992 && !isFullscreen ? contentScroll.current.scrollHeight : contentScroll.current.scrollWidth; // Représente la hauteur ou la largeur totale du conteneur affichant les miniatures.
        const thumbnailClientHeightOrWidthDisplay = screen.width >= 992 && !isFullscreen ? contentScroll.current.clientHeight : contentScroll.current.clientWidth; // Represente la hauteur ou la largeur du conteneur affichant les miniatures, du côté client.
        const scrollMax = thumbnailTotalHeightOrWidthScroll - thumbnailClientHeightOrWidthDisplay; // Correspond à la la hauteur ou la largeur restante qui n'est pas affiché sur l'écran.
        setLetsScroll(true); // Autorise la barre de défilement à prendre la position indiquer par scrollbarPosition (voir useEffect un peu plus haut).

        if (e.currentTarget.dataset.shift === "top" && scrollbarPosition >= 0) {
            if ((scrollbarPosition - 200) < 0) {
                setScrollbarPosition(0)
            } else {
                setScrollbarPosition(scrollbarPosition - 200)
            }
        }
        if (e.currentTarget.dataset.shift === "bottom" && scrollbarPosition <= scrollMax) {
            if ((scrollbarPosition + 200) > scrollMax) {
                setScrollbarPosition(scrollMax)
            } else {
                setScrollbarPosition(scrollbarPosition + 200)
            }
        }
    };

    /**
     * Gère le passage en plein écran.
     */
    const handleToggleFullscreen = () => {
        const elToSwitchToFullscreen = screen.width >= 1200 ? fullElToSwitchToFullscreen : oneElToSwitchToFullscreen;

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            setIsFullscreen(true);
            elToSwitchToFullscreen.current.requestFullscreen()
                .then(res => {
                    if (contentScroll.current.scrollHeight > contentScroll.current.clientHeight || contentScroll.current.scrollWidth > contentScroll.current.clientWidth) {
                        setDisplayButtonScrollMiniatureContainer(true)
                    } else {
                        setDisplayButtonScrollMiniatureContainer(false)
                    }
                })
        } else {
            setIsFullscreen(false);
            document.exitFullscreen()
                .then(res => {
                    if (contentScroll.current.scrollHeight > contentScroll.current.clientHeight || contentScroll.current.scrollWidth > contentScroll.current.clientWidth) {
                        setDisplayButtonScrollMiniatureContainer(true)
                    } else {
                        setDisplayButtonScrollMiniatureContainer(false)
                    }
                })
        }
    };

    /**
     * Gère le changement d'images dans le carousel via le tactile.
     * @param e
     */
    const handleTouchEventOnCarousel = (e) => {
        const swipeDirectionX = touchEventStart.x - e.changedTouches[0].clientX; // Distance parcourue sur l'axe X.
        const swipeDirectionY = touchEventStart.y - e.changedTouches[0].clientY; // Distance parcourue sur l'axe Y.
        const swipeDirection = Math.abs(swipeDirectionX) - Math.abs(swipeDirectionY);

        /* Si "swipeDirection" est supérieur à 0 c'est que le scroll est bien pincipalement sur l'axe X et on peut donc passer à l'image suivante */
        if (swipeDirection > 0 && Object.keys(touchEventStart).length) {
            if (swipeDirectionX >= 20) {
                activeItem !== property.images.length ? setActiveItem(activeItem + 1) : null;
                contentScroll.current.scrollTo(
                    screen.width >= 992
                        ? { top: parseInt(imageMiniActive.current.offsetTop), behavior: 'smooth' }
                        : { left: parseInt(imageMiniActive.current.offsetLeft), behavior: 'smooth'}
                );
                setTouchEventStart({});
            }
            if (swipeDirectionX <= -20) {
                activeItem !== 1 ? setActiveItem(activeItem - 1) : null;
                contentScroll.current.scrollTo(
                    screen.width >= 992
                        ? { top: (parseInt(imageMiniActive.current.offsetTop) - 220), behavior: 'smooth' }
                        : { left: (parseInt(imageMiniActive.current.offsetLeft) - 220), behavior: 'smooth'}
                );
                setTouchEventStart({});
            }
        }
    };

    /**
     * Redimensionne les images en conservant leur ratio original grâce à la fonction "resizeImageFullscreen".
     * @param e
     */
    const handleResizeImage = (e) => {
        if (e.currentTarget.complete) {
            const resizeImage = resizeImageFullscreen(
                e.currentTarget.naturalWidth,
                e.currentTarget.naturalHeight,
                carouselImgContainer.current.offsetWidth,
                carouselImgContainer.current.offsetHeight
            );
            e.currentTarget.style.width = resizeImage.width;
            e.currentTarget.style.height = resizeImage.height;
        }
    };

    return (
        <div className="propertyDetail">
            <section
                className={`propertyDetailTopMain ${isFullscreen ? "Fullscreen" : ""}`}
                ref={fullElToSwitchToFullscreen}
            >
                <div
                    className="propertyDetailTopMainCarousel"
                    ref={oneElToSwitchToFullscreen}
                    onTouchStart={(e) => {
                        setTouchEventStart({
                            x: e.touches[0].clientX,
                            y: e.touches[0].clientY
                        });
                    }}
                    onTouchMove={handleTouchEventOnCarousel}
                >
                    <div
                        className="propertyDetailTopMainCarouselImgContainer"
                        ref={carouselImgContainer}
                    >
                        {property && property.images.map((image, index) => (
                           <img
                               className={activeItem === (index + 1) ? "imgActive" : "imgNonActive"}
                               ref={activeItem === (index + 1) ? imageActiveOnCarousel : null}
                               key={index + 1}
                               data-id={index + 1}
                               src={image.original}
                               alt={`Image numéro ${index + 1} représentant le logement`}
                               loading="lazy"
                               onLoad={handleResizeImage}
                           />
                        ))}
                    </div>
                    <div
                        className="propertyDetailTopMainShift prev"
                        data-shift="prev"
                        onClick={handleOnClickSwitchImage}
                    >
                       <span>
                           <FontAwesomeIcon icon={faAngleLeft} />
                       </span>
                    </div>
                    <div
                        className="propertyDetailTopMainShift next"
                        data-shift="next"
                        onClick={handleOnClickSwitchImage}
                    >
                       <span>
                           <FontAwesomeIcon icon={faAngleRight} />
                       </span>
                    </div>
                    <FontAwesomeIcon
                        className={`propertyDetailTopMainButtonFullscreen ${isFullscreen ? "exitFullscreen" : "enterFullscreen"}`}
                        onClick={handleToggleFullscreen}
                        icon={isFullscreen ? faTimes : faExpand}
                    />
               </div>
                <div className="propertyDetailTopMainMini">
                    <div
                        className="propertyDetailTopMainMiniItems"
                        ref={contentScroll}
                        onScroll={() => setScrollbarPosition(screen.width >= 1200 && !isFullscreen ? contentScroll.current.scrollTop : contentScroll.current.scrollLeft)}
                    >
                        {property && property.images.map((image, index) => (
                            <div key={index + 1}>
                                <img
                                    className={(index + 1) === activeItem ? 'propertyDetailTopMainMiniItemsImg' : null}
                                    data-id={index + 1}
                                    ref={(index + 1) === activeItem ? imageMiniActive : null}
                                    src={image.h142}
                                    style={(index + 1) === activeItem ? { borderImage: `${property.type === 0 ? "linear-gradient(#f6d365, #fda085)" : "linear-gradient(#84fab0, #8fd3f4)"} 30`} : null }
                                    alt={`Miniature image numéro ${index + 1} représentant le logement`}
                                    onClick={handleOnClickImagesMiniature}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                    {displayButtonScrollMiniatureContainer &&
                        <div
                            className="propertyDetailTopMainScroll top"
                            data-shift="top"
                            onClick={handleOnClickButtonScrollMiniatureContainer}
                        >
                               <span>
                                   <FontAwesomeIcon icon={faAngleLeft} />
                               </span>
                        </div>
                    }
                    {displayButtonScrollMiniatureContainer &&
                        <div
                            className="propertyDetailTopMainScroll bottom"
                            data-shift="bottom"
                            onClick={handleOnClickButtonScrollMiniatureContainer}
                        >
                               <span>
                                   <FontAwesomeIcon icon={faAngleRight} />
                               </span>
                        </div>
                    }
                </div>
            </section>
            <section className="propertyDetailBottomMain">
                <div className="propertyDetailBottomMainHeader">
                    <h2 className="propertyDetailBottomMainHeaderTitle">{property.title}</h2>
                    <p className="propertyDetailBottomMainHeaderReference">
                        Référence:
                        <span
                            className={displayReference ? "hidden display" : "hidden"}
                            onClick={() => setDisplayReference(!displayReference)}
                        >
                            {displayReference ? property._id : "Afficher"}
                        </span>
                    </p>
                </div>
                <p className="propertyDetailBottomMainAddress">{property.address}</p>
                <h3 className="propertyDetailBottomMainPrice">{priceFormatted(property.price)} <span>{property.type === 1 ? "CC / mois" : ""}</span></h3>
                <div className="propertyDetailBottomMainDetails">
                    <div className="propertyDetailBottomMainDetailsItem">
                        <FontAwesomeIcon icon={faRulerCombined} />
                        <p>
                            Surface
                            <span>{property.surface} m²</span>
                        </p>
                    </div>
                    <div className="propertyDetailBottomMainDetailsItem">
                        <FontAwesomeIcon icon={faDoorOpen} />
                        <p>
                            Pièces
                            <span>{property.pcsNbr}</span>
                        </p>
                    </div>
                    <div className="propertyDetailBottomMainDetailsItem">
                        <FontAwesomeIcon icon={faBed} />
                        <p>
                            Chambres
                            <span>{property.bedroomNbr}</span>
                        </p>
                    </div>
                </div>
                <div className="propertyDetailBottomMainDescription">
                    <h3>Descriptif du bien</h3>
                    <div
                        className={displayMoreText ? "full" : "excerpt"}
                        style={displayMoreText ? { height: descriptionTextHeight } : null}
                    >
                        <p ref={descriptionHeight}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin commodo vulputate lectus. Donec fringilla faucibus feugiat. Sed mollis accumsan nibh, id volutpat arcu dignissim non.
                            Mauris iaculis fermentum vehicula. Aenean urna quam, consequat non mattis vitae, sagittis vel magna. Nam magna enim, semper sed tempor vel, finibus pretium leo.
                            Fusce tristique ut quam vel dapibus. Ut sit amet dui ut velit molestie tristique eu sit amet urna. Sed consectetur elit sed tempor vulputate.
                            Curabitur congue accumsan nulla, non euismod lacus fringilla quis. Vivamus mattis lacus id eros tempus, a vehicula felis venenatis. In hac habitasse platea dictumst.
                            Mauris sed est aliquam risus semper ultrices. Integer eu turpis erat. Aliquam sem elit, eleifend non enim pellentesque, vehicula vulputate elit.
                            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque porta, erat et volutpat porta, enim turpis mollis orci, interdum iaculis justo nibh eget massa.
                            Proin posuere rhoncus mauris a efficitur. Mauris vel accumsan erat.
                        </p>
                    </div>
                    <span
                        className={displayMoreText ? "displayMinus" : "displayMore"}
                        onClick={() => setDisplayMoreText(!displayMoreText)}
                    >
                        {displayMoreText ? "Lire moins" : "[...] Lire plus"}
                    </span>
                </div>
                {property.insideDetails.length !== 0 &&
                    <div className="propertyDetailBottomMainInformations">
                        <h3>Intérieur</h3>
                        <ul>
                            {property && property.insideDetails.map((detail, index) =>
                                <li key={index}>- {detail}</li>
                            )}
                        </ul>
                    </div>
                }
                {property.outsideDetails.length !== 0 &&
                    <div className="propertyDetailBottomMainInformations">
                        <h3>Extérieur</h3>
                        <ul>
                            {property.outsideDetails.map((detail, index) =>
                                <li key={index}>- {detail}</li>
                            )}
                        </ul>
                    </div>
                }
            </section>
        </div>
    );
};

PropertyDetail.propTypes = {
    property: PropTypes.object
};

export default PropertyDetail;
