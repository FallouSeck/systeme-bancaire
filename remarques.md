1/ lors de la création du compte, on vérifie dans la bdd si le client ne possède pas déja un compte du même type que celui qu'on essaye de créer.
 => la fonction prend en paramètre le body de la requête à savoir "customerId" et "type"
 => par défault on créera un "current_account"
    => le problème est que lorsqu'on ne spécifié pas de type dans la requète la fonction de vérification ne recevra pas le paramètre type et de ce fait on peux créer des current_account à volonté pour un même client



    [] vérifier que le advisor existe dans la table Advisor lors de la création d'un new client 
    [] un trycatch a supprimer dans create>Customer