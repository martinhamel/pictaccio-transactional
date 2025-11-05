#! /usr/bin/env bash

#set -o errexit -o pipefail -o noclobber -o nounset

source $(brew --prefix nvm)/nvm.sh
nvm use 9.6.0
DIR="$(dirname "$0")"

function print_help {
	echo
	echo --qa, --stage, --prod:
	echo Choose environment to build
	echo
	echo --push:
	echo Push to registry after build
	echo
	echo --no-cache:
	echo Docker --no-cache
	echo
}



export environment=""
export push="false"
export nocache="false"
while true; do
	if ! [ -n "${1+set}" ]; then
		break;
	fi

    case "$1" in
        --qa)
        	environment="qa"
        	shift
        	;;
        --stage)
        	environment="stage"
        	shift
        	;;
        --prod)
        	environment="prod"
        	shift
        	;;
        --push)
        	push="true"
        	shift
        	;;
        --clean)
        	nocache="true"
        	shift
        	;;
        \?|-h|--help)
        	print_help
        	exit 0
        	;;
    esac
done

case $environment in
	qa)
		$DIR/qa_env/build
		;;
	stage)
		$DIR/stage_env/build
		;;
	prod)
		$DIR/prod_env/build
		;;
esac
