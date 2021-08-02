// == Import : npm
import { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

// == Import : components
import Card from './card';

/**
 * Gère l'affichage de la page "d'acceuil".
 * @param {Object[]} properties - Données des propriétés à afficher.
 * @param {string} sectionName - Nom de la section (Appartements, Maisons).
 * @returns {JSX.Element}
 */
const HomeSection = ({ properties, sectionName }) => {

    const [selectedType, setSelectedType] = useState(0);
    const propertiesCategory = sectionName === "Appartements" ? "apartments" : "houses";

    return (
        <section className='section'>
            <div className='sectionTitle'>
                <h2>{sectionName}</h2>
            </div>
            <div className="sectionToggle">
                <button
                    className={`sectionToggleButtonBuy ${selectedType === 0 ? "activeToggleButton" : ""}`}
                    onClick={() => setSelectedType(0)}
                >
                    Achat
                </button>
                <button
                    className={`sectionToggleButtonRent ${selectedType === 1 ? "activeToggleButton" : ""}`}
                    onClick={() => setSelectedType(1)}
                >
                    Location
                </button>
            </div>
            <div className="sectionContent">
                {
                    properties && properties.map(property => {
                        if (selectedType === property.type) {
                            return (
                                <Card
                                    property={property}
                                    propertyCategory={propertiesCategory}
                                    key={property._id}
                                />
                            )
                        }
                    })
                }
            </div>
            <div className="sectionButton">
                <Link href={`/recherche/${selectedType === 0 ? 'achat' : 'location'}-${sectionName === "Appartements" ? 'appartement' : 'maison'}`} passHref>
                    <a>
                        <button className="sectionButtonDisplayMore">Afficher plus</button>
                    </a>
                </Link>
            </div>
        </section>
    )
};

HomeSection.propTypes = {
    properties: PropTypes.array,
    sectionName: PropTypes.string
};

export default HomeSection;
