// == Import : npm
import Head from 'next/head';
import { useEffect, useContext } from "react";

// == Import : components
import Layout from '../components/layout';
import Intro from "../components/intro";
import HomeSection from "../components/homeSection";

// == Import : local
import { PropertiesFilterContext } from "../context/propertiesFilterContext";
import dbConnect from '../utils/dbConnect';
import Apartment from '../models/Apartment';
import House from '../models/House';


export const getStaticProps = async () => {
    await dbConnect();

    // Récupère le nombre de documents de chaque collections (apartments/houses) par type (0: achat / 1: location)
    const apartmentsBuyCount = await Apartment.find({ type: 0 }).countDocuments();
    const apartmentsLocationCount = await Apartment.find({ type: 1 }).countDocuments();
    const housesBuyCount = await House.find({ type: 0 }).countDocuments();
    const housesLocationCount = await House.find({ type: 1 }).countDocuments();

    // Crée un nombre aléatoire ne dépassant pas le nombre de documents du type (0 ou 1) de chaque collection (apartment/house) - 6.
    const randomBuyApartments = Math.floor(Math.random() * ((apartmentsBuyCount - 6) - 1 + 1) + 1);
    const randomLocationApartments = Math.floor(Math.random() * ((apartmentsLocationCount - 6) - 1 + 1) + 1);
    const randomBuyHouses = Math.floor(Math.random() * ((housesBuyCount - 6) - 1 + 1) + 1);
    const randomLocationHouses = Math.floor(Math.random() * ((housesLocationCount - 6) - 1 + 1) + 1);

    // Permet de récupérer "aléatoirement" 6 annonces pour chaque type de chaque collections. On "skip" le nombre aléatoire précedemment créer et on récupère les 6 annonces qui suivent.
    const randomApartmentsBuy = await Apartment.find({ type: 0 }).skip(randomBuyApartments).limit(6);
    const randomApartmentsLocation = await Apartment.find({ type: 1 }).skip(randomLocationApartments).limit(6);
    const randomHousesBuy = await House.find({ type: 0 }).skip(randomBuyHouses).limit(6);
    const randomHousesLocation = await House.find({ type: 1 }).skip(randomLocationHouses).limit(6);

    const appartmentsRandomExcerpt = JSON.parse(JSON.stringify([...randomApartmentsBuy, ...randomApartmentsLocation]));
    const housesRandomExcerpt = JSON.parse(JSON.stringify([...randomHousesBuy, ...randomHousesLocation]));

    return {
        props: {
            appartmentsRandomExcerpt,
            housesRandomExcerpt
        },
        revalidate: 30
    };
};

const Home = ({ appartmentsRandomExcerpt, housesRandomExcerpt }) => {
    const [propertiesFilterState, dispatchPropertiesFilterState] = useContext(PropertiesFilterContext);

    useEffect(() => {
        dispatchPropertiesFilterState({ type: "RESETFILTER" });
    }, []);

    return (
        <>
            <Head>
                <title>ToulHouse - Agence Immobilière</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Retrouvez les annonces immobilière de la ville de Toulouse : achat, location, maisons ou appartements." />
            </Head>
            <Layout>
                <main className="container">
                    <Intro/>
                    <HomeSection properties={appartmentsRandomExcerpt} sectionName={"Appartements"}/>
                    <HomeSection properties={housesRandomExcerpt} sectionName={"Maisons"}/>
                </main>
            </Layout>
        </>
    );
};

export default Home;
