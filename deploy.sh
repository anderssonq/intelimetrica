git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:anderssonq/intelimetrica.git master:gh-pages

cd -