// == Import : components
import Head from 'next/head';
import Layout from "../../components/layout";
import Login from "../../components/login";


const Auth = () => (
    <>
        <Head>
            <title>Page de connexion et de création de compte | ToulHouse - Agence Immobilière</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content="Page de connexion et de création de compte" />
        </Head>
        <Layout>
            <main className="container">
                <Login />
            </main>
        </Layout>
    </>
)

export default Auth;
