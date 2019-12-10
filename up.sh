usage(){
    cat << EndOfMessage
up.sh - simple client for delta

Usage - 
  -f    filename
  -u    URL

EndOfMessage
}

case $1 in
    -f | --file )   
        filename=$1
        ;;
    -h | --help )
        usage
        exit
        ;;
    * )
        usage
        exit 1
esac