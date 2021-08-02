module.exports = {
    env: {
        MONGO_URI: "",
        NEXTAUTH_URL: "",
        EMAIL_FROM: "",
        EMAIL_SERVER: ""
    },
    async rewrites() {
        return [
            {
                source: '/recherche/achat-maison',
                destination: '/propertiesList/houses/0',
            },
            {
                source: '/recherche/achat-appartement',
                destination: '/propertiesList/apartments/0',
            },
            {
                source: '/recherche/location-maison',
                destination: '/propertiesList/houses/1',
            },
            {
                source: '/recherche/location-appartement',
                destination: '/propertiesList/apartments/1',
            },
            {
                source: '/detail/:param*',
                destination: '/propertyDetail/:param*'
            }
        ]
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "script-src 'self'; frame-ancestors 'none'; base-uri 'self';"
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    }
                ]
            }
        ]
    }
};
