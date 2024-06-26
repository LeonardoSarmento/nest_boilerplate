# chmod +x ./release.sh
VERSION=""

git fetch --all
git push

echo -e ''

#get parameters
while getopts v: flag
do
  case "${flag}" in
    v) VERSION=${OPTARG};;
  esac
done

#get highest tag number, and add 1.0.0 if doesn't exist
CURRENT_VERSION=`git tag --sort=committerdate | grep -E '^v[0-9]+.[0-9]+.[0-9]+' | tail -1 | cut -b 2-`
if [[ $CURRENT_VERSION == '' ]]
then
  CURRENT_VERSION='0.0.1'
fi
echo "Current Version: v$CURRENT_VERSION"

#replace . with space so can split into an array
CURRENT_VERSION_PARTS=(${CURRENT_VERSION//./ })
PRE_RELEASE_PARTS=(${CURRENT_VERSION_PARTS[2]//-/ })

#get number parts
VNUM1=${CURRENT_VERSION_PARTS[0]}
VNUM2=${CURRENT_VERSION_PARTS[1]}
VNUM3=${PRE_RELEASE_PARTS[0]}
VNUM4=${PRE_RELEASE_PARTS[1]}

if [[ $VERSION == 'major' ]]
then
  VNUM1=$((VNUM1+1))
  VNUM2=0
  VNUM3=0
elif [[ $VERSION == 'minor' ]]
then
  VNUM2=$((VNUM2+1))
  VNUM3=0
elif [[ $VERSION == 'patch' ]]
then
  VNUM3=$((VNUM3+1))
elif [[ $VERSION == 'pre' ]]
then
  VNUM4=$((VNUM4+1))
else
  echo "No version type (https://semver.org/) or incorrect type specified, try: -v [major, minor, patch, pre]"
  exit 1
fi


#create new tag
if  [ $VERSION != 'pre' ]
then
NEW_TAG="v$VNUM1.$VNUM2.$VNUM3"
else
NEW_TAG="v$VNUM1.$VNUM2.$VNUM3-$VNUM4"
fi

echo -e "New \tVersion: $NEW_TAG"

echo -e ''

printf 'Create %s-release: %s (y/n)? ' "$VERSION" "$NEW_TAG"
old_stty_cfg=$(stty -g)
stty raw -echo
answer=$( while ! head -c 1 | grep -i '[ny]' ;do true ;done )
stty $old_stty_cfg
if [ "$answer" != "${answer#[Yy]}" ];then
    echo Yes
else
    echo No
    exit;
fi

# Generate and insert statics in CHANGELOG <NEW_TAG>
echo -e "New \tCHANGELOG: $NEW_TAG"

# prevent error "dir not found"
if [ ! -f CHANGELOG.md ]; then
    echo "**${PWD##*/}**" > CHANGELOG.md
    echo ">  tokei --exclude *.sql *-lock.json **/migrations --sort code" >> CHANGELOG.md
fi

echo -e "\n### $NEW_TAG" >> CHANGELOG.md

echo -e "\nDate of create release: \`$(date --utc +%FT%TZ)\`\n" >> CHANGELOG.md

echo "\`\`\`text" >> CHANGELOG.md
# @todo create `input-file` with tokei config (custom file per project)
tokei --exclude *.sql *.toml *.json *.csproj **/Migrations/*.cs docs/**/*.* --sort code >> CHANGELOG.md
echo "\`\`\`" >> CHANGELOG.md

git add CHANGELOG.md
git commit -m "$NEW_TAG"
git push

git tag $NEW_TAG
git push origin $NEW_TAG

echo Pushed on $NEW_TAG

exit 0