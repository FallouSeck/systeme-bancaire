Système bancaire

Des users
    1. Conseiller
        a. Des clients à gerer. (CRUD)
        b. Il ne peut faire des actions que sur les clients dont il est responsable
        c. Un conseiller doit obligatoirement avoir un manager
    2. Manager
        a. Des conseiller à gérer (CRUD)
        b. Il ne peut faire des actions que sur les conseillers dont il est responsable

    3. Directeur
        a. Des clients, des conseillers et des manager à gérer (CRUD) même sur l’agent de sécurité.
        b. Il peut tout faire faire sur tout le monde

    4. Agent de sécurité
        a. Faire des rondes et signaler les incidents (CRUD sur les rondes)

    5. Clients
        a. Des comptes (épargne et courant)
        b. Au maximum un 1 de chaque et interdiction d’en avoir plus
        c. Un client doit obligatoirement avoir un comte et un conseiller


Avec cette API et postman il faudra :
    1. Créer 1 directeur
    2. 2 managers (seul le directeur peut le faire)
    3. 3 conseillers (seule le directeur et un manager peuvent le faire peut le faire)
    4. 2 clients pour chaque conseiller (directeur manager conseiller)
    5. 1 agent de sécurité (seul le directeur peut le faire)



    ajouter
    // customer 
        => status (interdit bancaire ou solvable)
    // bankAccount
        => montant 
        => put(montant)

    1.1
     => le client doit pouvoir modifier le montant de son compte
     => le client n'a accès qu'à ses comptes(consultation et modification)
    1.2
     => le advisor ne doit avoir accès qu'à ses customers
     (consultations => fiches client, bankAccounts)
     (création, modification, suppression => fiches client, bankAccounts)
     => il ne doit avoir aucun accès sur un client d'un autre conseiller(consultation ou action)
    1.3
     => le manager ne doit avoir accès qu'à ses advisors
     (consultations => fiches advisor, customerId + toutes actions du advisor)
     (création, modification, suppression => fiches advisor, customerId + toute action du advisor)
     => il ne doit avoir aucun accès sur un advisor, customer ou bankAccount d'un autre manager(consultation ou action)
    1.4
     => le director peut tout faire à tout le monde(consultation, action)
    1.5
     => seul le directeur a acces sur le securityAgent(consultation, action)
    1.6
     => seul le securityAgent a acces a la création des securityRounds
     => seul le director et le securityAgent ont accès à la consultation des securityRounds