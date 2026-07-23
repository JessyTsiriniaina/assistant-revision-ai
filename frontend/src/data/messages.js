export const messages = [
  {
    id: 1,
    role: "user",
    text: "Explique-moi la troisième forme normale.",
  },
  {
    id: 2,
    role: "assistant",
    text: "La troisième forme normale (3NF) consiste à supprimer les dépendances transitives dans une table. Une table est en 3NF si elle est déjà en 2NF et si aucun attribut non-clé ne dépend d'un autre attribut non-clé.",
  },
  {
    id: 3,
    role: "user",
    text: "Peux-tu me donner un exemple concret ?",
  },
  {
    id: 4,
    role: "assistant",
    text: "Bien sûr. Imagine une table Étudiant(id, nom, code_departement, nom_departement). Ici, nom_departement dépend de code_departement, pas de la clé id. Pour être en 3NF, il faut créer une table Département séparée.",
  },
  {
    id: 5,
    role: "user",
    text: "Merci, c'est plus clair !",
  },
  {
    id: 6,
    role: "assistant",
    text: "Avec plaisir. N'hésite pas si tu veux qu'on aborde la BCNF ensuite.",
  },
];
