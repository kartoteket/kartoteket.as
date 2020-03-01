from netCDF4 import Dataset as NetCDFFile
# Read in netcdf file
url = 'http://thredds.met.no/thredds/dodsC/aromearcticlatest/arome_arctic_extracted_2_5km_latest.nc'
nc = NetCDFFile(url)
# Variables
t2m = nc.variables['air_temperature_2m'][:]