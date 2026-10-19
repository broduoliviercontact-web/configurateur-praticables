# Configurateur praticables

Outil interne de préparation de montage : on pose des praticables en 3D, le site ajoute les garde-corps, les fixations et les escaliers, puis sort la nomenclature du matériel.

## Utilisation

En ligne : https://configurateur-praticables.vercel.app/

Ouvrir `index.html` dans un navigateur. Aucun serveur n'est nécessaire. Three.js est chargé depuis un CDN, il faut donc une connexion internet.

- **Nouveau projet** : un assistant demande le nom, la largeur et la profondeur de la scène, la hauteur, le plateau principal, le bord sans garde-corps et les escaliers (12 emplacements au choix : avant, arrière et côtés, chacun à gauche / au centre / à droite, vus du public), montre un aperçu du plan et génère la scène (avec complément en petits formats si besoin)
- **Escaliers** : avec l'outil Sélection, touche un escalier pour le sélectionner, glisse-le pour le déplacer (le long du bord ou sur un autre bord), décale-le de 50 cm ou supprime-le depuis le panneau
- Sur téléphone, le panneau devient un tiroir sous la vue 3D
- Outils : Sélection, Poser, Zone, Escalier, Bord ouvert, Effacer (touches 1 à 6)
- R pour pivoter, flèches pour déplacer, Suppr pour supprimer, Ctrl+D pour dupliquer, Ctrl+Z / Ctrl+Maj+Z pour annuler / rétablir
- Le plan est enregistré dans le navigateur (localStorage)

## Catalogue

Les références sont en haut du script dans `index.html` : `BRANDS`, `PLATEAUX`, `GC`, `ESCALIERS` et `HEIGHTS`. Pour ajouter un plateau, on ajoute une ligne à `PLATEAUX`.

- ASD : PRA-R21, PRI-R21, PRA-C11, PRI-C11, PRA-R15, PRI-R15, PRA-T21D, PRA-T21G ; pieds PS060 à PS100 ; garde-corps GARD05, GARD1, GARD2 (avec ou sans kit 100) ; SGC, C0014, C0011, FGARD ; escaliers ESC60 à ESC260
- Prolyte StageDex : Topline 2×1, 2×0,5, triangles G et D ; Basicline noir 2×1. Les pieds et les brides restent à compléter.

## Règles de calcul (à valider)

- 4 pieds par plateau rectangulaire, 3 par triangle
- 1 jonction par mètre de bord commun entre plateaux de même hauteur
- Garde-corps sur tout bord libre ou dominant un plateau plus bas, découpés en 2 m, 1 m et 0,5 m
- 2 supports SGC par garde-corps, 1 FGARD entre deux garde-corps alignés

⚠️ Les garde-corps GARD ASD sont indiqués « espace technique, n'est plus autorisé pour un espace scène ». Vérifier la référence à utiliser avec ASD.
