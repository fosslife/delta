apikey=spark1234
usage(){
    cat << EndOfMessage
up.sh - simple cUrl based client for delta

Usage - 
./up.sh {file|url} [args] server

Args-
  filename
  URL (original url)
  password

Example:
    To upload file
        ./up.sh file filename.txt http://spark.pepe/
    To upload a file and password protect it
        ./up.sh file filename.txt password1234 http://spark.pepe/
    To shorten a URL
        ./up.sh url http://www.longurl.domain/path http://spark.pepe/
    To shorten a URL and password protect it
        ./up.sh url http://www.longurl.domain/path password1234 http://spark.pepe/
    To shorten with custom URL
        ./up.sh url http://www.longurl.domain/path shortcustom http://spark.pepe/
    To shorten with custom URL with password
        ./up.sh url http://www.longurl.domain/path shortcustom password123 http://spark.pepe/

i.e. password will always be second last parameter, last is always server url
EndOfMessage
}

uploadFile() {
    case $# in
        3 )
            curl -H "api-key: $apikey" -F file=@$2 $3
            ;;
        4 )
            curl -H "api-key: $apikey" -F file=@$2 -F pass=$3 $4
            ;;
        * )
            echo "Incorrect arguments, use --help"
            exit 1
    esac
}

uploadUrl(){
   # what?
}
case $1 in
    file )   
        uploadFile $@
        ;;
    url )
        uploadUrl $@
        ;;
    -h | --help )
        usage
        exit
        ;;
    * )
        usage
        exit 1
esac