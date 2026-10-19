# Configurateur praticables

Outil interne de préparation de montage : on pose des praticables en 3D, le site ajoute les garde-corps, les fixations et les escaliers, puis sort la nomenclature du matériel.

## Utilisation

À l'ouverture : une scène 8 × 8 m en PRI-R21 (ASD 500 kg/m², plateau par défaut) à 1 m, face public ouverte, escalier à l'arrière côté droit (vu du public). « Revenir à la scène 8 × 8 » la recharge.

En ligne : https://configurateur-praticables.vercel.app/

Ouvrir `index.html` dans un navigateur. Aucun serveur n'est nécessaire. Three.js est chargé depuis un CDN, il faut donc une connexion internet.

- **Nouveau projet** : un assistant demande le nom, la largeur et la profondeur de la scène, la hauteur, le plateau principal, le bord sans garde-corps et les escaliers (12 emplacements au choix : avant, arrière et côtés, chacun à gauche / au centre / à droite, vus du public), montre un aperçu du plan et génère la scène (avec complément en petits formats si besoin)
- **Escaliers** : avec l'outil Sélection, touche un escalier pour le sélectionner, glisse-le pour le déplacer (le long du bord ou sur un autre bord), décale-le de 50 cm ou supprime-le depuis le panneau
- Sur téléphone, le panneau devient un tiroir sous la vue 3D
- Outils : Sélection, Poser, Zone, Escalier, Bord ouvert, Effacer (touches 1 à 6)
- R pour pivoter, flèches pour déplacer, Suppr pour supprimer, Ctrl+D pour dupliquer, Ctrl+Z / Ctrl+Maj+Z pour annuler / rétablir
- Le plan est enregistré dans le navigateur (localStorage)

## Projets et partage

- **Projets** : chaque scène est un projet enregistré dans le navigateur ; la liste permet d'ouvrir, dupliquer ou supprimer. « Nouveau projet » garde l'ancien dans la liste.
- **Exporter / importer un fichier** `.praticables.json` pour sauvegarder ou envoyer un projet.
- **Lien de partage** : le projet est compressé dans l'adresse (`#p=…`), sans serveur. C'est une copie : les modifications faites ailleurs ne reviennent pas.

## Plan de montage 2D

Bouton « Plan de montage 2D » : plateaux numérotés avec leur référence, cotes générales et en chaîne, garde-corps, bords ouverts, jupes, escaliers (référence ESC), tableau des positions (X ; Y depuis le coin arrière gauche vu du public) et nomenclature avec les poids. « Imprimer » sort la feuille en A4 paysage (plan en page 1, tableaux en page 2).

## Poids, charge et transport

- Poids unitaire par référence ; poids total dans la nomenclature et sur le plan. Les poids marqués ≈ sont estimés : seuls PRA-R21 (42 kg), PRI-R21 (37 kg), PRA-C11 (24 kg), PRI-R15 (12,8 kg), PRA-T21D (20 kg), PS100 (1,2 kg) et GARD1 (5,48 kg) viennent des fiches revendeur.
- Charge admissible : celle de la référence la plus faible posée (750 kg/m² en PRA, 500 kg/m² en PRI).
- Transport : nombre de chariots selon le réglage « plateaux 2 × 1 par chariot » (8 par défaut, à ajuster à ton parc).

## Jupes

Réglage « Jupes » : aucune, face public, face et côtés, ou tout le tour. Longueur par hauteur de plancher, hors escaliers, et pinces (1 tous les 50 cm + 1 par extrémité, à valider). Les jupes sont dessinées en 3D et sur le plan.

## Lien avec Salle 3D

- Dans [Salle 3D](https://salle-3d-tools.vercel.app), une scène, une régie ou la scène FIP 360 sélectionnée affiche **« Détailler en praticables ASD ↗ »** : le configurateur s'ouvre avec ses dimensions (P = ouverture, L = profondeur, H = hauteur) et son nom.
- **« Envoyer vers Salle 3D »** renvoie la scène détaillée : elle remplace la scène d'origine à la même place (plateaux, garde-corps, escaliers, jupes en 3D et sur le plan 2D), et la fiche setup de Salle 3D liste le matériel ASD avec les poids. Sans onglet Salle 3D ouvert, l'envoi ouvre Salle 3D avec la scène au centre de la vue (lien `#asd=…`).
- « Modifier la scène ASD ↗ » dans Salle 3D rouvre le projet détaillé.
- Modèles de la salle dans l'assistant : scène machiniste 8 × 8 m à 1,20 m, scène centrale FIP 360 4 × 4 m, régie 4 × 3 m à 1,10 m.

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
