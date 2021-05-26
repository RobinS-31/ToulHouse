// == Import : npm
import { useContext, useEffect } from "react";
import { useSWRInfinite } from "swr";
import Head from "next/head";

// == Import : components
import Layout from "../../components/layout";
import PropertiesList from "../../components/propertiesList";

// == Import : local
import { PropertiesFilterContext } from '../../context/propertiesFilterContext';
import fetcher from "../../utils/fetcherConfig";


export const getServerSideProps = async ({ params }) => {
    return {
        props: {
            params
        },
    };
};

const Properties = ({ params }) => {
    const [propertiesFilterState, dispatchPropertiesFilterState] = useContext(PropertiesFilterContext);
    const { pcsNbr, priceMin, priceMax, surface, sortBy, fromHistoryBack } = propertiesFilterState;
    const { params: [propertiesCategory, propertiesType] } = params;
    const title = `${propertiesCategory === "apartments" ? "Appartement" : "Maison"} - ${propertiesType === "0" ? "Achat" : "Location"}`;

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.length) return null;
        return `/api/${propertiesCategory}/0/LIST/${propertiesType}/${pageIndex}/${sortBy}/${pcsNbr ? pcsNbr : '0'}/${priceMin ? priceMin : '0'}/${priceMax ? priceMax : '999999999'}/${surface ? surface : '0'}`                    // SWR key
    }
    const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(getKey, fetcher);

    useEffect(() => {
        !fromHistoryBack
            ? setSize(1)
            : dispatchPropertiesFilterState({
                type: 'SETFILTER',
                name: 'fromHistoryBack',
                value: false
            })
    }, []);

    return (
        <>
            <Head>
                <title>{`Liste : ${title} | ToulHouse - Agence Immobilière`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Liste des annonces disponibles pour maisons ou appartements en achat ou location pour la ville de Toulouse" />
            </Head>
            <Layout>
                <main className="container">
                    <PropertiesList params={params} setSize={setSize} size={size} propertiesList={data} />
                </main>
            </Layout>
        </>
    )
};

export default Properties;
