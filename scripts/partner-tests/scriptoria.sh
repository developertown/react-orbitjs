#!/bin/bash
#
# To run locally:
#   TRAVIS_BUILD_DIR=$PWD TRAVIS_REPO_SLUG=developertown/react-orbitjs TRAVIS_COMMIT=$(git rev-parse HEAD) ./scripts/partner-tests/scriptoria.sh
#
#
# -e - aborts script if any command fails
# -x - echos the commands
set -ex

repo_name="appbuilder-portal"
project_path="$TRAVIS_BUILD_DIR/tmp/partner-tests/sil/scriptoria"
git_url="https://github.com/sillsdev/$repo_name.git"
frontend_directory="$project_path/appbuilder-portal/source/SIL.AppBuilder.Portal.Frontend"

mkdir -p $project_path
cd $project_path

# if we are testing locally, this directory may already exist
rm -rf $repo_name

git clone $git_url
cd $frontend_directory

# swap out react-orbitjs with the latest commit
jq ".\"react-orbitjs\" = \"${TRAVIS_REPO_SLUG}#${TRAVIS_COMMIT}\"" package.json > package.tmp && mv package.tmp package.json

yarn install
yarn test:ci


