// == Import : npm
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faDoorOpen, faEuroSign, faSortAmountDown,} from '@fortawesome/free-solid-svg-icons';

// == Import : components
import Card from './card';

// == Import : local
import { PropertiesFilterContext } from '../context/propertiesFilterContext';


/**
 * Gère l'affichage de la page de recherche des propriétés.
 * @param {Object} params - Correspond au paramètres des propriétés affichées (categorie et type).
 * @param {function} setSize - Augmente le nombre de propriétés à affichées.
 * @param {number} size - Correspond au nombre de propriétés affichées.
 * @param {Object[]} propertiesList - Tableau des propriétés à affichées.
 * @returns {JSX.Element}
 */
const PropertiesList = ({ params, setSize, size, propertiesList }) => {
    const [propertiesFilterState, dispatchPropertiesFilterState] = useContext(PropertiesFilterContext);

    const [firstRender, setFirstRender] = useState(true);
    const [displaySpinner, setDisplaySpinner] = useState(true);
    const [displayFilter, setDisplayFilter] = useState(false);
    const [displayButtonShowFilter, setDisplayButtonShowFilter] = useState(false);
    const [noMoreResult, setNoMoreResult] = useState(false);

    const { pcsNbr, priceMin, priceMax, surface, sortBy, scrollTop } = propertiesFilterState;

    const { params: [propertiesCategory, propertiesType] } = params;

    useEffect(() => {
        setFirstRender(false);
        screen.width >= 992 ? setDisplayFilter(true) : null;
        screen.width < 992 ? setDisplayButtonShowFilter(true) : null;

        window.onscroll = (event) => {
            if (window.scrollY !== 0) {
                dispatchPropertiesFilterState({
                    type: 'SETFILTER',
                    name: 'scrollTop',
                    value: window.scrollY
                });
            }
        };
        return () => {
            window.onscroll = null;
        };
    }, []);

    useEffect(() => {
        !firstRender ? setDisplaySpinner(true) : null;
        window.scrollTo(0, scrollTop);
    }, [propertiesCategory, propertiesType]);

    useEffect(() => {
        if (propertiesList) {
            setDisplaySpinner(false);
            propertiesList.map(properties => {
                properties.length === 0 ? setNoMoreResult(true) : setNoMoreResult(false);
            })
        }
    }, [propertiesList]);

    /**
     * Augmente le nombre d'éléments à récupérer lors du clic sur le bouton "AFFICHER PLUS".
     */
    const handleOnClickButtonShowMore = () => {
        if (!noMoreResult) {
            setSize(size + 1);
            setDisplaySpinner(true);
        }
    };

    /**
     * Gère la valeur des inputs.
     * @param e
     */
    const handleOnChangeFilterInput = (e) => {
        switch (e.currentTarget.name) {
            case 'surface':
            case 'priceMin':
            case 'priceMax':
                if (!Number.isNaN(parseInt(e.currentTarget.value)) || !e.currentTarget.value.length) {
                    dispatchPropertiesFilterState({
                        type: 'SETFILTER',
                        name: e.currentTarget.name,
                        value: e.currentTarget.value
                    });
                    setDisplaySpinner(true);
                }
                break;
            default:
                dispatchPropertiesFilterState({
                    type: 'SETFILTER',
                    name: e.currentTarget.name,
                    value: e.currentTarget.value
                });
                setDisplaySpinner(true);
                break;
        }
    };

    /**
     * Supprime les filtres lors du clic sur le bouton "Effacer".
     */
    const handleOnClickResetButton = () => {
        dispatchPropertiesFilterState({
            type: 'RESETFILTER'
        });
        setDisplaySpinner(true);
    };

    return (
        <section className='section'>
            <div className='sectionTitle'>
                <h2 className='h2-responsive'>
                    {propertiesCategory === 'houses'
                        ? 'Maisons '
                        : 'Appartements '
                    }
                    <span style={{ fontSize: '1rem' }}>
                        - {propertiesType === '0' ? 'Achat' : 'Location'}
                    </span>
                </h2>
            </div>
            {displayButtonShowFilter &&
                <button
                    className='sectionDisplayButtonShowFilter btn'
                    onClick={() => setDisplayFilter(!displayFilter)}
                >
                    Afficher les filtres
                </button>
            }
            {displayFilter &&
                <div className='sectionFilter'>
                    <div className='sectionFilterItem order_4'>
                        <div className='sectionFilterItemIcon'>
                            <FontAwesomeIcon icon={faDoorOpen} />
                        </div>
                        <select
                            className='browser-default custom-select'
                            name='pcsNbr'
                            id='pcsNbr'
                            value={pcsNbr}
                            onChange={handleOnChangeFilterInput}
                        >
                            <option value='0'>Toutes</option>
                            <option value='1'>1 & plus</option>
                            <option value='2'>2 & plus</option>
                            <option value='3'>3 & plus</option>
                            <option value='4'>4 & plus</option>
                            <option value='5'>5 & plus</option>
                        </select>
                    </div>
                    <div className='sectionFilterItem order_1'>
                        <div className='sectionFilterItemIcon'>
                            <FontAwesomeIcon icon={faRulerCombined} />
                        </div>
                        <input
                            className='form-control form-control-sm'
                            value={surface}
                            placeholder='Min'
                            type='text'
                            name='surface'
                            onChange={handleOnChangeFilterInput}
                        />
                    </div>
                    <div className='sectionFilterItem order_2'>
                        <div className='sectionFilterItemIcon'>
                            <FontAwesomeIcon icon={faEuroSign} />
                        </div>
                        <input
                            className='form-control form-control-sm'
                            value={priceMin}
                            placeholder='Min'
                            type='text'
                            name='priceMin'
                            onChange={handleOnChangeFilterInput}
                        />
                    </div>
                    <div className='sectionFilterItem order_3'>
                        <div className='sectionFilterItemIcon'>
                            <FontAwesomeIcon icon={faEuroSign} />
                        </div>
                        <input
                            className='form-control form-control-sm'
                            value={priceMax}
                            placeholder='Max'
                            type='text'
                            name='priceMax'
                            onChange={handleOnChangeFilterInput}
                        />
                    </div>
                    <div className='sectionFilterItem order_5'>
                        <div className='sectionFilterItemIcon'>
                            <FontAwesomeIcon icon={faSortAmountDown} />
                        </div>
                        <select
                            className='browser-default custom-select'
                            name='sortBy'
                            id='sortBy'
                            value={sortBy}
                            onChange={handleOnChangeFilterInput}
                        >
                            <option value='price'>Prix</option>
                            <option value='surface'>Surface</option>
                            <option value='pcsNbr'>Pièces</option>
                            <option value='bedroomNbr'>Chambres</option>
                        </select>
                    </div>
                    <div className='sectionFilterItem order_6'>
                        <button
                            className={`sectionFilterResetbutton ${propertiesType === '0' ? "buy" : "rent"}`}
                            onClick={handleOnClickResetButton}
                        >
                            Effacer
                        </button>
                    </div>
                </div>
            }
            <div className='sectionContent'>
                {
                    propertiesList && propertiesList.map(properties => {
                        return properties.map(property =>
                            <Card
                                property={property}
                                propertyCategory={propertiesCategory}
                                key={property._id}
                            />
                        )
                    })
                }
            </div>
            <div className='sectionButton'>
                <button
                    className='btn btn-default'
                    onClick={handleOnClickButtonShowMore}
                >
                    {
                        displaySpinner
                        ? <div className='spinnerLoader' />
                        : noMoreResult ? 'Pas de résultat' : 'Afficher plus'
                    }
                </button>
            </div>
        </section>
    );
};

PropertiesList.propTypes = {
    params: PropTypes.object,
    setSize: PropTypes.func,
    size: PropTypes.number,
    propertiesList: PropTypes.array
};

export default PropertiesList;
