// == Import : npm
import Head from 'next/head';
import { getSession } from 'next-auth/client'

// == Import : components
import Layout from '../components/layout';
import UserPanel from "../components/userPanel";


export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        context.res.writeHead(307, { Location: '/auth' });
        context.res.end();
        return { props: {} };
    }

    return {
        props: {
            session
        }
    };
};

const Dashboard = ({ session }) => {
    const { user } = session;

    return (
        <>
            <Head>
                <title>Tableau de bord | ToulHouse - Agence Immobilière</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Page de gestion de compte utilisateur." />
            </Head>
            <Layout>
                <main className="container">
                    <UserPanel user={user} />
                </main>
            </Layout>
        </>
    );
};

export default Dashboard;
