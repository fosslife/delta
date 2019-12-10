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
EndOfMessage
}

uploadFile() {
    case $# in
        3 )
            curl -H "api-key: $apikey" -F file=@$2 $3
            ;;
        4 )
            curl -H "api-key: $apikey" -F file=@$2 -F lockwith=$3 $4
            ;;
        * )
            echo "Incorrect arguments, use --help"
            exit 1
    esac
}

uploadUrl(){
    case $# in
        3 )
            echo "Shortening URL"
            ;;
        4 )
            echo "shortening url with password"
            ;;
        * )
            echo "Incorrect arguments, use --help"
            exit 1
    esac
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