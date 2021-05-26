// == Import : npm
import { useState, useReducer, useRef } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// == Import : local
import api from "../../../utils/axiosConfig";


/**
 * Gère l'affichage du détail d'une propriété et du formulaire d'ajout d'une propriété.
 * @param {Object} property - Données d'une propriété.
 * @param {string} category - Catégory de la propriété (house, apartment).
 * @param {boolean} newProperty - Booléen, false par défaut (utilisé pour la soumission du formulaire, true: ajout propriété, false: modification propriété).
 * @param {function} reFetch - Fonction pour récupérer la liste des propriétés (lié a SWR).
 * @returns {JSX.Element}
 */
const HandlePropertyCard = ({ property, category, newProperty = false, reFetch }) => {

    const initialState = {
        propertyTitle: property.title,
        propertyAddress: property.address,
        propertyBedroomNbr: property.bedroomNbr,
        propertyPcsNbr: property.pcsNbr,
        propertySurface: property.surface,
        propertyPrice: property.price,
        propertyType: 0,
        propertyCategory: 'house',
        propertyInsideDetails: property.insideDetails,
        propertyOutsideDetails: property.outsideDetails,
        propertyInsideDetail: '',
        propertyOutsideDetail: '',
        fileData: [],
        propertyImages: property.images
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SETVALUES':
                return {
                    ...state,
                    [action.name]: action.value
                }
            case 'RESETVALUES':
                return initialState;
            default: break;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    const [disabledInput, setDisabledInput] = useState(!newProperty);
    const [displayEmptyInputMessage, setDisplayEmptyInputMessage] = useState(false);
    const inputFile = useRef(null);
    let emptyInput = false;

    const {
        propertyTitle,
        propertyAddress,
        propertyBedroomNbr,
        propertyPcsNbr,
        propertySurface,
        propertyPrice,
        propertyType,
        propertyCategory,
        propertyInsideDetails,
        propertyOutsideDetails,
        propertyInsideDetail,
        propertyOutsideDetail,
        fileData,
        propertyImages
    } = state;

    /**
     * Gère l'affichage des inputs du formulaire.
     * @param e
     */
    const handleInputFocusAndBlur = (e) => {
        if (e._reactName === "onFocus") {
            e.currentTarget.nextElementSibling.classList.add('active');
        }
        if (e._reactName === "onBlur" && e.currentTarget.value.length === 0) {
            e.currentTarget.nextElementSibling.classList.remove('active');
        }
    };

    /**
     * Gère l'affichage du détail d'une propriété.
     * @param e
     */
    const handleOnClickSectionList = (e) => {
        const target = e.currentTarget;

        if (target.nextElementSibling.classList.contains("show")) {
            target.nextElementSibling.classList.remove("show");
        } else {
            target.nextElementSibling.classList.add("show");
        }
    };

    /**
     * Gère l'ajout ou la suppression des détails.
     * @param e
     */
    const handleOnclickAddOrRemoveDetail = (e) => {
        e.preventDefault();
        const buttonName = e.currentTarget.name;
        const buttonValue = e.currentTarget.value;

        switch (buttonName) {
            case 'addInsideDetail':
                if (buttonValue.length) {
                    dispatch({ type: 'SETVALUES', name: 'propertyInsideDetails', value: [...propertyInsideDetails, buttonValue] });
                    dispatch({ type: 'SETVALUES', name: 'propertyInsideDetail', value: '' });
                }
                break;
            case 'addOutsideDetail':
                if (buttonValue.length) {
                    dispatch({ type: 'SETVALUES', name: 'propertyOutsideDetails', value: [...propertyOutsideDetails, buttonValue] });
                    dispatch({ type: 'SETVALUES', name: 'propertyOutsideDetail', value: '' });
                }
                break;
            case 'removeInsideDetail':
                const insideDetailsFilter = propertyInsideDetails.filter(detail => detail !== buttonValue);
                dispatch({ type: 'SETVALUES', name: 'propertyInsideDetails', value: insideDetailsFilter });
                break;
            case 'removeOutsideDetail':
                const outsideDetailsFilter = propertyOutsideDetails.filter(detail => detail !== buttonValue);
                dispatch({ type: 'SETVALUES', name: 'propertyOutsideDetails', value: outsideDetailsFilter });
                break;
            default: break;
        }
    };

    /**
     * Gère la suppression des images.
     * @param e
     */
    const handleOnClickRemoveImage = (e) => {
        const indexToRemove = parseInt(e.currentTarget.value);
        const arrayImages = [...propertyImages];
        arrayImages.splice(indexToRemove, 1);

        dispatch({
            type: 'SETVALUES',
            name: 'propertyImages',
            value: arrayImages
        });
    };

    /**
     * Gère la valeur des inputs.
     * @param e
     */
    const handleOnChangeInput = (e) => {
        const inputName = e.currentTarget.name;

        if (inputName === 'fileData') {
            dispatch({ type: 'SETVALUES', name: inputName, value: Array.from(e.target.files) });
        } else if (inputName === 'propertyBedroomNbr' || inputName === 'propertyPcsNbr' || inputName === 'propertySurface' || inputName === 'propertyPrice' || inputName === 'propertyType') {
            if (parseInt(e.currentTarget.value, 10)) dispatch({ type: 'SETVALUES', name: inputName, value: parseInt(e.currentTarget.value, 10) });
            if (e.currentTarget.value === "") dispatch({ type: 'SETVALUES', name: inputName, value: 0 });
        } else {
            dispatch({ type: 'SETVALUES', name: inputName, value: e.currentTarget.value });
        }
    };

    /**
     * Gère la suppression d'une propriété.
     * @param e
     */
    const handleOnClickRemovePropertyButton = async (e) => {
        const response = await api.delete(`/api/manageProperty?&id=${property._id}&category=${category}`);

        if (response.status === 200) {
            reFetch();
        }
    };

    /**
     * Gère l'ajout ou la modification d'une propriété.
     * @param e
     */
    const handleOnSubmitForm = async (e) => {
        e.preventDefault();

        const propertyData = {
            insideDetails: propertyInsideDetails,
            outsideDetails: propertyOutsideDetails,
            images: propertyImages,
            type: newProperty ? propertyType : property.type,
            title: propertyTitle,
            address: propertyAddress,
            price: propertyPrice,
            surface: propertySurface,
            pcsNbr: propertyPcsNbr,
            bedroomNbr: propertyBedroomNbr,
            category: newProperty ? propertyCategory : category
        };
        !newProperty ? propertyData.id = property._id : null;

        for (const [key, value] of Object.entries(propertyData)) {
            if (key !== 'images' && key !=='type' && key !=='category') {
                if (key === 'price' || key === 'surface' || key === 'pcsNbr' || key === 'bedroomNbr') {
                    value === 0 ? emptyInput = true : null;
                } else {
                    value.length === 0 ? emptyInput = true : null;
                }
            }
        }

        const formData = new FormData();
        formData.append("infoData", JSON.stringify(propertyData));
        fileData.forEach((file) => {
            formData.append("propertyPic", file);
        })

        if (!emptyInput) {
            displayEmptyInputMessage ? setDisplayEmptyInputMessage(false) : null;

            if (newProperty) {
                const response = await api.post(
                    '/api/manageProperty',
                    formData,
                    {
                        headers: {'content-type': 'multipart/form-data'}
                    }
                );
                if (response.status === 201) {
                    dispatch({ type: 'RESETVALUES' });
                    inputFile.current.value = null;
                    reFetch();
                }
            } else {
                const response = await api.put(
                    '/api/manageProperty',
                    formData,
                    {
                        headers: {'content-type': 'multipart/form-data'}
                    }
                );
                if (response.status === 200) {
                    setDisabledInput(true);
                    reFetch();
                }
            }
        } else {
            setDisplayEmptyInputMessage(true);
        }
    };

    return (
        <div className="handlePropertyCard">
            <h4
                className="handlePropertyCard_title"
                onClick={handleOnClickSectionList}
            >
                {!newProperty
                    ? <p>
                        Réf : {property._id}
                        <span>[ {propertyTitle} ]</span>
                    </p>
                    : <p className="handlePropertyCard_title_newProperty">Ajouter une propriété</p>
                }
                <FontAwesomeIcon className="handlePropertyCard_title_icon" icon={faChevronDown}/>
            </h4>
            <form className="handlePropertyCard_form">
                <div className="handlePropertyCard_form_body">
                    <div className="handlePropertyCard_form_body_imgList">
                        {
                            propertyImages.map((image, index) => {
                                return <div className="handlePropertyCard_form_body_imgList_item" key={image.h142}>
                                    <img
                                        src={image.h142}
                                        alt="test"
                                        loading="lazy"
                                    />
                                    {!disabledInput &&
                                        <button
                                            className="handlePropertyCard_form_body_imgList_item_button"
                                            type="button"
                                            name='removeImage'
                                            value={index}
                                            onClick={handleOnClickRemoveImage}
                                        >
                                            x
                                        </button>
                                    }
                                </div>
                            })
                        }
                        {
                            inputFile?.current && Array.from(inputFile.current.files).map(file => {
                                return <div className="handlePropertyCard_form_body_imgList_item" key={file.name}>
                                    <img
                                        className='handlePropertyCard_form_body_imgList_item_img'
                                        src={URL.createObjectURL(file)}
                                        alt="test"
                                        loading="lazy"
                                    />
                                </div>
                            })
                        }
                    </div>
                    <div className="handlePropertyCard_form_body_content">
                        {newProperty &&
                            <>
                                <div className="handlePropertyCard_form_body_content_select">
                                    <label htmlFor="category">Catégorie :</label>
                                    <select
                                        name="propertyCategory"
                                        id="category"
                                        value={propertyCategory}
                                        onChange={handleOnChangeInput}
                                    >
                                        <option value="house">Maison</option>
                                        <option value="apartment">Appartement</option>
                                    </select>
                                </div>
                                <div className="handlePropertyCard_form_body_content_select">
                                    <label htmlFor="type">Type :</label>
                                    <select
                                        name="propertyType"
                                        id="type"
                                        value={propertyType}
                                        onChange={handleOnChangeInput}
                                    >
                                        <option value={0}>Achat</option>
                                        <option value={1}>Location</option>
                                    </select>
                                </div>
                            </>
                        }
                        <div className="handlePropertyCard_form_body_content_input inputContainer">
                            <input
                                id='title'
                                name='propertyTitle'
                                value={propertyTitle}
                                disabled={disabledInput}
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={handleOnChangeInput}
                            />
                            <label
                                className={propertyTitle.length ? 'active' : ''}
                                htmlFor='title'
                            >
                                Titre
                            </label>
                        </div>
                        <div className="handlePropertyCard_form_body_content_input inputContainer">
                            <input
                                id='address'
                                name='propertyAddress'
                                value={propertyAddress}
                                disabled={disabledInput}
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={handleOnChangeInput}
                            />
                            <label
                                className={propertyAddress.length ? 'active' : ''}
                                htmlFor='address'
                            >
                                Adresse
                            </label>
                        </div>
                        <div className="handlePropertyCard_form_body_content_input inputContainer">
                            <input
                                id='bedroomNbr'
                                name='propertyBedroomNbr'
                                value={propertyBedroomNbr === 0 ? "" : propertyBedroomNbr}
                                disabled={disabledInput}
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={handleOnChangeInput}
                            />
                            <label
                                className={propertyBedroomNbr !== 0 && propertyBedroomNbr.toString().length ? 'active' : ''}
                                htmlFor='bedroomNbr'
                            >
                                Chambres
                            </label>
                        </div>
                        <div className="handlePropertyCard_form_body_content_input inputContainer">
                            <input
                                id='pcsNbr'
                                name='propertyPcsNbr'
                                value={propertyPcsNbr === 0 ? "" : propertyPcsNbr}
                                disabled={disabledInput}
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={handleOnChangeInput}
                            />
                            <label
                                className={propertyPcsNbr !== 0 && propertyPcsNbr.toString().length ? 'active' : ''}
                                htmlFor='pcsNbr'
                            >
                                Pièces
                            </label>
                        </div>
                        <div className="handlePropertyCard_form_body_content_input inputContainer">
                            <input
                                id='surface'
                                name='propertySurface'
                                value={propertySurface === 0 ? "" : propertySurface}
                                disabled={disabledInput}
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={handleOnChangeInput}
                            />
                            <label
                                className={propertySurface !== 0 && propertySurface.toString().length ? 'active' : ''}
                                htmlFor='surface'
                            >
                                Superficie
                            </label>
                        </div>
                        <div className="handlePropertyCard_form_body_content_input inputContainer">
                            <input
                                id='price'
                                name='propertyPrice'
                                value={propertyPrice === 0 ? "" : propertyPrice}
                                disabled={disabledInput}
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={handleOnChangeInput}
                            />
                            <label
                                className={propertyPrice !== 0 && propertyPrice.toString().length ? 'active' : ''}
                                htmlFor='price'
                            >
                                Prix
                            </label>
                        </div>
                        <div className="handlePropertyCard_form_body_content_list">
                            <p>Détails intérieurs :</p>
                            <ul>
                                {propertyInsideDetails.map(detail => {
                                    return <li key={detail}>
                                        {detail}
                                        {!disabledInput &&
                                            <button
                                                className="handlePropertyCard_form_body_content_list_removeButton"
                                                type="button"
                                                name='removeInsideDetail'
                                                value={detail}
                                                onClick={handleOnclickAddOrRemoveDetail}
                                            >
                                                x
                                            </button>
                                        }
                                    </li>
                                })}
                            </ul>
                            {!disabledInput &&
                                <>
                                    <input
                                        type="text"
                                        name='propertyInsideDetail'
                                        placeholder="Ajouter un détail"
                                        value={propertyInsideDetail}
                                        onChange={handleOnChangeInput}
                                    />
                                    <button
                                        className="handlePropertyCard_form_body_content_list_addButton"
                                        name='addInsideDetail'
                                        onClick={handleOnclickAddOrRemoveDetail}
                                        value={propertyInsideDetail}
                                    >
                                        Ajouter
                                    </button>
                                </>
                            }
                        </div>
                        <div className="handlePropertyCard_form_body_content_list">
                            <p>Détails extérieurs :</p>
                            <ul>
                                {propertyOutsideDetails.map(detail => {
                                    return <li key={detail}>
                                        {detail}
                                        {!disabledInput &&
                                            <button
                                                className="handlePropertyCard_form_body_content_list_removeButton"
                                                type="button"
                                                name='removeOutsideDetail'
                                                value={detail}
                                                onClick={handleOnclickAddOrRemoveDetail}
                                            >
                                                x
                                            </button>
                                        }
                                    </li>
                                })}
                            </ul>
                            {!disabledInput &&
                            <>
                                <input
                                    type="text"
                                    name='propertyOutsideDetail'
                                    placeholder="Ajouter un détail"
                                    value={propertyOutsideDetail}
                                    onChange={handleOnChangeInput}
                                />
                                <button
                                    className="handlePropertyCard_form_body_content_list_addButton"
                                    name='addOutsideDetail'
                                    onClick={handleOnclickAddOrRemoveDetail}
                                    value={propertyOutsideDetail}
                                >
                                    Ajouter
                                </button>
                            </>
                            }
                        </div>
                        <div className="handlePropertyCard_form_body_content_input addPictures">
                            <label htmlFor='propertyPic'>Ajouter des photos :</label>
                            <input
                                id='propertyPic'
                                type='file'
                                name='fileData'
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                multiple={true}
                                onChange={handleOnChangeInput}
                                disabled={disabledInput}
                                ref={inputFile}
                            />
                        </div>
                        {displayEmptyInputMessage &&
                            <div className="handlePropertyCard_form_body_content_errorMessage">
                                <p>Veuillez remplir tout les champs.</p>
                            </div>
                        }
                    </div>
                </div>
                <div className='handlePropertyCard_form_buttons'>
                    {!newProperty &&
                        <>
                        <button
                            className='handlePropertyCard_form_buttons_removeButton'
                            type='button'
                            //onClick={handleOnClickRemovePropertyButton}
                        >
                            Supprimer
                        </button>
                        <button
                            className='handlePropertyCard_form_buttons_editButton'
                            type='button'
                            onClick={() => setDisabledInput(!disabledInput)}
                        >
                            {!disabledInput ? 'Annuler' : 'Modifier'}
                        </button>
                        </>
                    }
                    <button
                        className='handlePropertyCard_form_buttons_saveButton'
                        type='submit'
                        disabled={disabledInput}
                        //onClick={handleOnSubmitForm}
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    )
};

HandlePropertyCard.propTypes = {
    property: PropTypes.object,
    category: PropTypes.string,
    newProperty: PropTypes.bool,
    reFetch: PropTypes.func
};

export default HandlePropertyCard;
