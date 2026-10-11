// Tableau qui va contenir tous nos livres

var listeLivres = [];

// On récupère les éléments du formulaire
var champIsbn = document.getElementById("isbn");
var champTitre = document.getElementById("titre");
var champAuteur = document.getElementById("auteur");
var champAnnee = document.getElementById("annee");
var champIndexModification = document.getElementById("indexModification");
var messageErreur = document.getElementById("messageErreur");
var corpsTableau = document.getElementById("corpsTableau");
var champRecherche = document.getElementById("recherche");

// On récupère les boutons
var btnAjouter = document.getElementById("btnAjouter");
var btnReinitialiser = document.getElementById("btnReinitialiser");


// Fonction pour afficher un message d'erreur

function afficherErreur(texte) {
  messageErreur.innerText = texte;
}


// Fonction pour vider le message d'erreur

function viderErreur() {
  messageErreur.innerText = "";
}

// Fonction pour vider le formulaire

function viderFormulaire() {
  champIsbn.value = "";
  champTitre.value = "";
  champAuteur.value = "";
  champAnnee.value = "";
  champIndexModification.value = "-1";
  viderErreur();
}


// Fonction de validation du formulaire
// Renvoie true si tout est correct, false sinon

function validerFormulaire() {

  // Vérifier que tous les champs sont remplis
  if (champIsbn.value === "" || champTitre.value === "" || champAuteur.value === "" || champAnnee.value === "") {
    afficherErreur("Veuillez remplir tous les champs.");
    return false;
  }

  // Vérifier que l'année est bien un nombre
  if (isNaN(champAnnee.value)) {
    afficherErreur("L'année doit être un nombre.");
    return false;
  }
  if (isNaN(champIsbn.value)) {
    afficherErreur("L'Isbn doit être un nombre.");
    return false;
  }

  // Si tout va bien, on vide le message d'erreur
  viderErreur();
  return true;
}


// Fonction pour afficher tous les livres dans le tableau

function afficherLivres(livres) {

  // On vide le tableau avant de le remplir
  corpsTableau.innerHTML = "";

  // On parcourt la liste de livres avec une boucle simple
  for (var i = 0; i < livres.length; i++) {

    var livre = livres[i];

    // On crée une nouvelle ligne de tableau
    var ligne = document.createElement("tr");

    // On crée les cellules une par une
    var celluleIsbn = document.createElement("td");
    celluleIsbn.innerText = livre.isbn;

    var celluleTitre = document.createElement("td");
    celluleTitre.innerText = livre.titre;

    var celluleAuteur = document.createElement("td");
    celluleAuteur.innerText = livre.auteur;

    var celluleAnnee = document.createElement("td");
    celluleAnnee.innerText = livre.annee;

    var celluleActions = document.createElement("td");

    // Bouton Modifier
    var btnModifier = document.createElement("button");
    btnModifier.innerText = "Modifier";
    btnModifier.className = "btn btn-warning btn-sm btn-action";

    // On utilise une variable séparée pour garder le bon index dans la boucle
    var indexLivre = i;

    btnModifier.addEventListener("click", function () {
      modifierLivre(indexLivre);
    });

    // Bouton Supprimer
    var btnSupprimer = document.createElement("button");
    btnSupprimer.innerText = "Supprimer";
    btnSupprimer.className = "btn btn-danger btn-sm btn-action";

    btnSupprimer.addEventListener("click", function () {
      supprimerLivre(indexLivre);
    });

    // On ajoute les boutons dans la cellule actions
    celluleActions.appendChild(btnModifier);
    celluleActions.appendChild(btnSupprimer);

    // On ajoute toutes les cellules dans la ligne
    ligne.appendChild(celluleIsbn);
    ligne.appendChild(celluleTitre);
    ligne.appendChild(celluleAuteur);
    ligne.appendChild(celluleAnnee);
    ligne.appendChild(celluleActions);

    // On ajoute la ligne dans le tableau
    corpsTableau.appendChild(ligne);
  }
}




// Fonction appelée quand on clique sur "Ajouter"

function ajouterLivre() {

  // On valide le formulaire avant de continuer
  if (validerFormulaire() === false) {
    return;
  }

  // On regarde si on est en train de modifier un livre existant
  var index = parseInt(champIndexModification.value);

  if (index === -1) {
    // C'est un nouvel ajout

    // On crée un nouvel objet livre
    var nouveauLivre = {
      isbn: champIsbn.value,
      titre: champTitre.value,
      auteur: champAuteur.value,
      annee: champAnnee.value
    };

    // On ajoute le livre dans la liste
    listeLivres.push(nouveauLivre);

  } else {
    // C'est une modification d'un livre existant
    listeLivres[index].isbn = champIsbn.value;
    listeLivres[index].titre = champTitre.value;
    listeLivres[index].auteur = champAuteur.value;
    listeLivres[index].annee = champAnnee.value;
  }

  // On réaffiche le tableau avec la liste complète
  afficherLivres(listeLivres);

  // On réinitialise le formulaire
  viderFormulaire();
}


// Fonction pour préparer la modification d'un livre

function modifierLivre(index) {

  var livre = listeLivres[index];

  // On remplit le formulaire avec les données du livre
  champIsbn.value = livre.isbn;
  champTitre.value = livre.titre;
  champAuteur.value = livre.auteur;
  champAnnee.value = livre.annee;

  // On garde en mémoire l'index du livre que l'on modifie
  champIndexModification.value = index;

  // On change le texte du bouton pour que ce soit plus clair
  btnAjouter.innerText = "Modifier";
}


// Fonction pour supprimer un livre

function supprimerLivre(index) {

  // On enlève 1 élément de la liste à la position "index"
  listeLivres.splice(index, 1);

  // On réaffiche le tableau
  afficherLivres(listeLivres);
}


// Fonction de recherche d'un livre
// On recherche dans l'ISBN, le titre ou l'auteur

function rechercherLivres() {

  var texteRecherche = champRecherche.value;
  texteRecherche = texteRecherche.toLowerCase();

  // Si la zone de recherche est vide, on affiche tous les livres
  if (texteRecherche === "") {
    afficherLivres(listeLivres);
    return;
  }

  // Sinon on crée une nouvelle liste avec seulement les livres trouvés
  var resultats = [];

  for (var i = 0; i < listeLivres.length; i++) {

    var livre = listeLivres[i];

    var isbnMinuscule = livre.isbn.toLowerCase();
    var titreMinuscule = livre.titre.toLowerCase();
    var auteurMinuscule = livre.auteur.toLowerCase();

    // On vérifie si le texte recherché se trouve dans l'un des champs
    if (isbnMinuscule.indexOf(texteRecherche) !== -1 || titreMinuscule.indexOf(texteRecherche) !== -1 || auteurMinuscule.indexOf(texteRecherche) !== -1) {
      resultats.push(livre)   ;
    }
  }

  afficherLivres(resultats);
}


// Gestion des événements (clics et saisie)


// Quand on clique sur le bouton "Ajouter"
btnAjouter.addEventListener("click", function () {
  ajouterLivre();
  // On remet le texte du bouton par défaut après l'ajout
  btnAjouter.innerText = "Ajouter";
});

// Quand on clique sur le bouton "Réinitialiser"
btnReinitialiser.addEventListener("click", function () {
  viderFormulaire();
  btnAjouter.innerText = "Ajouter";
});

// Quand on tape dans la zone de recherche
champRecherche.addEventListener("keyup", function () {
  rechercherLivres();
});


// Au chargement de la page, on affiche le tableau (vide au départ)

afficherLivres(listeLivres);
