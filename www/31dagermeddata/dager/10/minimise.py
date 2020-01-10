# def main()

# f= open("fire_nrt_V1_94999.csv", "w+")
# f.close()

# f = open("short.csv",'r')
# i = 0
# for l in f:
#   i += 1
#   print(l)


# print(i)
#
# A simple python script to minimise and mormalise forest fire data from https://firms.modaps.eosdis.nasa.gov/active_fire/#firms-txt
#
import csv

# open output and input files
with open('fire_nrt_M6_96312.csv', mode='r') as inFile, open('fires.csv', mode='w') as minimised:
    reader = csv.DictReader(inFile)
    writer = csv.writer(minimised, delimiter=',')

    highest = 0

    for row in reader:
      writer.writerow([row["latitude"], row["longitude"], date, round(float(row["brightness"])/507, 2)])
      # we use the highest to get the magic number used above to normalise brightness
      highest = max(highest, float(row["brightness"]))

    print(f'Done processing Highest value is {highest}')