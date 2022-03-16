## ToulHouse
Site web d'une agence immobilière fictive spécialisée sur la ville de Toulouse.
Le site propose des logements à la vente ou à la location (appartements ou maisons).

### Informations
* La page d’accueil et la page de détails des annonces sont en "Static Generation" avec revalidation des données.
* La page de recherche est en "Server-Side Rendering" avec récupération des données côté client via SWR.
* Je n'ai pas utilisé de framework CSS mais je me suis inspiré des créations qu'ils proposent.
* Pour le carrousel présent sur le détail des annonces je n'ai pas utilisé de modules, j'ai préféré le faire moi même.
* Pour la partie authentification j'ai utilisé NextAuth. La connexion se fait en passwordless via email.
* La page "Mon Compte" permet de modifier ses informations et de gérer ses favoris.
