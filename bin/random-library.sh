#!/bin/sh

curl 'https://www.random.org/lists/?mode=advanced' \
  --data 'list=frappe%0D%0Ahighcharts%0D%0Arecharts%0D%0Afusion%0D%0Avictory%0D%0Acharts.js%0D%0Areact-vis%0D%0A&format=plain' --data 'list=react-vis%0D%0Areact-vis&format=plain' \
  --compressed -s \
| sed -n 1p
