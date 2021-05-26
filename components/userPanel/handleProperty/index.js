// == Import : npm
import { useEffect} from "react";
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

// == Import : components
import HandlePropertyCard from "./handlePropertyCard";

// == Import : local
import fetcher from "../../../utils/fetcherConfig";


/**
 * Gère l'affichage de la partie "admin" (ajout, modification, suppression des propriétés) de "userPanel".
 * @returns {JSX.Element}
 */
const HandleProperty = () => {

    const { data, error, mutate } = useSWR('/api/manageProperty', fetcher);
    const newProperty = {
        id: null,
        insideDetails: [],
        outsideDetails: [],
        images: [],
        type: 0,
        title: '',
        address: '',
        price: 0,
        surface: 0,
        pcsNbr: 0,
        bedroomNbr: 0,
        category: 0
    };

    /**
     * Gère l'affichage de la liste des propriétés.
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

    return (
        <div className="handleProperty">
            {!data && !error &&
                <div className="handleProperty_loader">
                    <div className='spinnerLoader profileLoader' />
                    <p>Récupération des données...</p>
                </div>
            }
            {data &&
                <>
                    <div className="handleProperty_addProperty">
                        <HandlePropertyCard property={newProperty} category={''} newProperty={true} reFetch={mutate} />
                    </div>
                    <div className="handleProperty_manage">
                        <h3 className="handleProperty_manage_title">Liste des propiétés</h3>
                        <div className="handleProperty_manage_section">
                            <h3
                                className="handleProperty_manage_section_title"
                                onClick={handleOnClickSectionList}
                            >
                                Maisons
                                <FontAwesomeIcon className="handleProperty_manage_section_title_icon" icon={faChevronDown}/>
                            </h3>
                            <div className="handleProperty_manage_section_list">
                                {data.housesList.map(house => {
                                    return <HandlePropertyCard property={house} category={'house'} reFetch={mutate} key={house._id} />
                                })}
                            </div>
                        </div>
                        <div className="handleProperty_manage_section">
                            <h3
                                className="handleProperty_manage_section_title"
                                onClick={handleOnClickSectionList}
                            >
                                Appartements
                                <FontAwesomeIcon className="handleProperty_manage_section_title_icon" icon={faChevronDown}/>
                            </h3>
                            <div className="handleProperty_manage_section_list">
                                {data.apartmentsList.map(apartment => {
                                    return <HandlePropertyCard property={apartment} category={'apartment'} reFetch={mutate} key={apartment._id} />
                                })}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default HandleProperty;
