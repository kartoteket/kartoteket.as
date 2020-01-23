#!/bin/bash
MONTHS=( 01 02 03 04 05 06 07 08 09 10 11 12 )
FILEBASE=chirps-v2.0.2019
FTP=ftp://chg-ftpout.geog.ucsb.edu/pub/org/chg/products/CHIRPS-2.0/global_monthly/tifs
OUT=februar.
# go to the data directory
cd ./data

for i in "${MONTHS[@]}"
do
  file=${FILEBASE}.$i.tif
  # get the file
  curl -o ${file}.gz ${FTP}/${file}.gz 
  # Unzip the file
  gunzip ${file}.gz

  ## resample the file to smaller size
  gdalwarp -overwrite -srcnodata -9999 -dstnodata -1 ${file} -ts 720 200 file_$i.tmp.tif

  ## convert to ascii
  gdal_translate -of AAIGrid -co DECIMAL_PRECISION=1 file_$i.tmp.tif file_$i.asc 
done
