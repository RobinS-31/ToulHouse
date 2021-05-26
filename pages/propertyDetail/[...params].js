// == Import : components
import Head from 'next/head';
import Layout from "../../components/layout";
import PropertyDetail from "../../components/propertyDetail";

// == Import : local
import { getHousesList, getHouseById } from "../api/houses";
import { getApartmentsList, getApartmentById } from "../api/apartments";


export const getStaticPaths = async () => {
    const apartmentsList = await getApartmentsList();
    const housesList = await getHousesList();

    const apartmentsParams = apartmentsList.map(apartment => {
        return {
            params: {
                params: [
                    "appartement",
                    apartment._id
                ]
            }
        };
    });
    const housesParams = housesList.map(house => {
        return {
            params: {
                params: [
                    "maison",
                    house._id
                ]
            }
        };
    });

    const propertiesParams = JSON.parse(JSON.stringify([...apartmentsParams, ...housesParams]));
    return {
        paths: propertiesParams,
        fallback: 'blocking'
    };
};

export const getStaticProps = async ({ params }) => {
    const [type, id] = params.params;
    const getPropertyDetail = type === "maison" ? await getHouseById(id) : await getApartmentById(id);
    const propertyDetail = JSON.parse(JSON.stringify(getPropertyDetail));

    if (propertyDetail === null) {
        return {
            notFound: true
        }
    } else {
        return {
            props: { propertyDetail },
            revalidate: 60
        };
    }
};

const Property = ({ propertyDetail }) => {
    const title = (typeof propertyDetail.title) !== "undefined" ? propertyDetail.title : "";

    return (
        <>
            <Head>
                <title>{`Détail annonce : ${title} | ToulHouse - Agence Immobilière`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Descriptif du bien ..." />
            </Head>
            <Layout>
                <main className="container">
                    <PropertyDetail property={propertyDetail}/>
                </main>
            </Layout>
        </>
    )
};

export default Property;
