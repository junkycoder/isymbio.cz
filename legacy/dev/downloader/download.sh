#!/bin/bash

while read line
do
  url="${line//\%20/ }";
  mtd --url="$url" --file=.

  search="http:\/\/isymbio.cz\/admin\/upload\/";
  old=$(echo $line | sed "s/$search//g")
  new=$(echo $url | sed "s/$search//g")
  echo $new
  mv "$old" "./$new"
done < "$1"