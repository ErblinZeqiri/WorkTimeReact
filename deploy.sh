#!/usr/bin/env sh

# arrêter le script si une commande échoue
set -e

# construire
npm run build

# naviguer dans le dossier de build de sortie
cd dist

# si vous déployez sur un domaine personnalisé
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# si vous déployez sur https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# si vous déployez sur https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:ErblinZeqiri/WorkTimeReact.git master:gh-pages

cd -

