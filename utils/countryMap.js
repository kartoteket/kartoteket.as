export const iso3ToName = iso => {
  const c = ISO3.find(d => d.iso3 === iso);
  return c.iso3;
};
const ISO3 = [
  {
    iso3: 'ABW',
    name: 'Aruba'
  },
  {
    iso3: 'AFG',
    name: 'Afghanistan'
  },
  {
    iso3: 'AGO',
    name: 'Angola'
  },
  {
    iso3: 'AIA',
    name: 'Anguilla'
  },
  {
    iso3: 'ALB',
    name: 'Albania'
  },
  {
    iso3: 'ALD',
    name: 'Aland'
  },
  {
    iso3: 'AND',
    name: 'Andorra'
  },
  {
    iso3: 'ARE',
    name: 'United Arab Emirates'
  },
  {
    iso3: 'ARG',
    name: 'Argentina'
  },
  {
    iso3: 'ARM',
    name: 'Armenia'
  },
  {
    iso3: 'ASM',
    name: 'American Samoa'
  },
  {
    iso3: 'ATA',
    name: 'Antarctica'
  },
  {
    iso3: 'ATC',
    name: 'Ashmore and Cartier Islands'
  },
  {
    iso3: 'ATF',
    name: 'French Southern and Antarctic Lands'
  },
  {
    iso3: 'ATG',
    name: 'Antigua and Barbuda'
  },
  {
    iso3: 'AUS',
    name: 'Australia'
  },
  {
    iso3: 'AUT',
    name: 'Austria'
  },
  {
    iso3: 'AZE',
    name: 'Azerbaijan'
  },
  {
    iso3: 'BDI',
    name: 'Burundi'
  },
  {
    iso3: 'BEL',
    name: 'Belgium'
  },
  {
    iso3: 'BEN',
    name: 'Benin'
  },
  {
    iso3: 'BFA',
    name: 'Burkina Faso'
  },
  {
    iso3: 'BGD',
    name: 'Bangladesh'
  },
  {
    iso3: 'BGR',
    name: 'Bulgaria'
  },
  {
    iso3: 'BHR',
    name: 'Bahrain'
  },
  {
    iso3: 'BHS',
    name: 'The Bahamas'
  },
  {
    iso3: 'BIH',
    name: 'Bosnia and Herzegovina'
  },
  {
    iso3: 'BJN',
    name: 'Bajo Nuevo Bank (Petrel Is.)'
  },
  {
    iso3: 'BLM',
    name: 'Saint Barthelemy'
  },
  {
    iso3: 'BLR',
    name: 'Belarus'
  },
  {
    iso3: 'BLZ',
    name: 'Belize'
  },
  {
    iso3: 'BMU',
    name: 'Bermuda'
  },
  {
    iso3: 'BOL',
    name: 'Bolivia'
  },
  {
    iso3: 'BRA',
    name: 'Brazil'
  },
  {
    iso3: 'BRB',
    name: 'Barbados'
  },
  {
    iso3: 'BRN',
    name: 'Brunei'
  },
  {
    iso3: 'BTN',
    name: 'Bhutan'
  },
  {
    iso3: 'BWA',
    name: 'Botswana'
  },
  {
    iso3: 'CAF',
    name: 'Central African Republic'
  },
  {
    iso3: 'CAN',
    name: 'Canada'
  },
  {
    iso3: 'CHE',
    name: 'Switzerland'
  },
  {
    iso3: 'CHL',
    name: 'Chile'
  },
  {
    iso3: 'CHN',
    name: 'China'
  },
  {
    iso3: 'CIV',
    name: 'Ivory Coast'
  },
  {
    iso3: 'CLP',
    name: 'Clipperton Island'
  },
  {
    iso3: 'CMR',
    name: 'Cameroon'
  },
  {
    iso3: 'CNM',
    name: 'Cyprus No Mans Area'
  },
  {
    iso3: 'COD',
    name: 'Democratic Republic of the Congo'
  },
  {
    iso3: 'COG',
    name: 'Republic of the Congo'
  },
  {
    iso3: 'COK',
    name: 'Cook Islands'
  },
  {
    iso3: 'COL',
    name: 'Colombia'
  },
  {
    iso3: 'COM',
    name: 'Comoros'
  },
  {
    iso3: 'CPV',
    name: 'Cabo Verde'
  },
  {
    iso3: 'CRI',
    name: 'Costa Rica'
  },
  {
    iso3: 'CSI',
    name: 'Coral Sea Islands'
  },
  {
    iso3: 'CUB',
    name: 'Cuba'
  },
  {
    iso3: 'CUW',
    name: 'CuraÃ§ao'
  },
  {
    iso3: 'CYM',
    name: 'Cayman Islands'
  },
  {
    iso3: 'CYN',
    name: 'Northern Cyprus'
  },
  {
    iso3: 'CYP',
    name: 'Cyprus'
  },
  {
    iso3: 'CZE',
    name: 'Czechia'
  },
  {
    iso3: 'DEU',
    name: 'Germany'
  },
  {
    iso3: 'DJI',
    name: 'Djibouti'
  },
  {
    iso3: 'DMA',
    name: 'Dominica'
  },
  {
    iso3: 'DNK',
    name: 'Denmark'
  },
  {
    iso3: 'DOM',
    name: 'Dominican Republic'
  },
  {
    iso3: 'DZA',
    name: 'Algeria'
  },
  {
    iso3: 'ECU',
    name: 'Ecuador'
  },
  {
    iso3: 'EGY',
    name: 'Egypt'
  },
  {
    iso3: 'ERI',
    name: 'Eritrea'
  },
  {
    iso3: 'ESB',
    name: 'Dhekelia Sovereign Base Area'
  },
  {
    iso3: 'ESP',
    name: 'Spain'
  },
  {
    iso3: 'EST',
    name: 'Estonia'
  },
  {
    iso3: 'ETH',
    name: 'Ethiopia'
  },
  {
    iso3: 'FIN',
    name: 'Finland'
  },
  {
    iso3: 'FJI',
    name: 'Fiji'
  },
  {
    iso3: 'FLK',
    name: 'Falkland Islands'
  },
  {
    iso3: 'FRA',
    name: 'France'
  },
  {
    iso3: 'FRO',
    name: 'Faroe Islands'
  },
  {
    iso3: 'FSM',
    name: 'Federated States of Micronesia'
  },
  {
    iso3: 'GAB',
    name: 'Gabon'
  },
  {
    iso3: 'GBR',
    name: 'United Kingdom'
  },
  {
    iso3: 'GEO',
    name: 'Georgia'
  },
  {
    iso3: 'GGY',
    name: 'Guernsey'
  },
  {
    iso3: 'GHA',
    name: 'Ghana'
  },
  {
    iso3: 'GIB',
    name: 'Gibraltar'
  },
  {
    iso3: 'GIN',
    name: 'Guinea'
  },
  {
    iso3: 'GLP',
    name: 'Guadeloupe'
  },
  {
    iso3: 'GMB',
    name: 'The Gambia'
  },
  {
    iso3: 'GNB',
    name: 'Guinea-Bissau'
  },
  {
    iso3: 'GNQ',
    name: 'Equatorial Guinea'
  },
  {
    iso3: 'GRC',
    name: 'Greece'
  },
  {
    iso3: 'GRD',
    name: 'Grenada'
  },
  {
    iso3: 'GRL',
    name: 'Greenland'
  },
  {
    iso3: 'GTM',
    name: 'Guatemala'
  },
  {
    iso2: 'GUF',
    name: 'French Guiana'
  },
  {
    iso3: 'GUM',
    name: 'Guam'
  },
  {
    iso3: 'GUY',
    name: 'Guyana'
  },
  {
    iso3: 'HKG',
    name: 'Hong Kong S.A.R.'
  },
  {
    iso3: 'HMD',
    name: 'Heard Island and McDonald Islands'
  },
  {
    iso3: 'HND',
    name: 'Honduras'
  },
  {
    iso3: 'HRV',
    name: 'Croatia'
  },
  {
    iso3: 'HTI',
    name: 'Haiti'
  },
  {
    iso3: 'HUN',
    name: 'Hungary'
  },
  {
    iso3: 'IDN',
    name: 'Indonesia'
  },
  {
    iso3: 'IMN',
    name: 'Isle of Man'
  },
  {
    iso3: 'IND',
    name: 'India'
  },
  {
    iso3: 'IOA',
    name: 'Indian Ocean Territories'
  },
  {
    iso3: 'IOT',
    name: 'British Indian Ocean Territory'
  },
  {
    iso3: 'IRL',
    name: 'Ireland'
  },
  {
    iso3: 'IRN',
    name: 'Iran'
  },
  {
    iso3: 'IRQ',
    name: 'Iraq'
  },
  {
    iso3: 'ISL',
    name: 'Iceland'
  },
  {
    iso3: 'ISR',
    name: 'Israel'
  },
  {
    iso3: 'ITA',
    name: 'Italy'
  },
  {
    iso3: 'JAM',
    name: 'Jamaica'
  },
  {
    iso3: 'JEY',
    name: 'Jersey'
  },
  {
    iso3: 'JOR',
    name: 'Jordan'
  },
  {
    iso3: 'JPN',
    name: 'Japan'
  },
  {
    iso3: 'KAB',
    name: 'Baykonur Cosmodrome'
  },
  {
    iso3: 'KAS',
    name: 'Siachen Glacier'
  },
  {
    iso3: 'KAZ',
    name: 'Kazakhstan'
  },
  {
    iso3: 'KEN',
    name: 'Kenya'
  },
  {
    iso3: 'KGZ',
    name: 'Kyrgyzstan'
  },
  {
    iso3: 'KHM',
    name: 'Cambodia'
  },
  {
    iso3: 'KIR',
    name: 'Kiribati'
  },
  {
    iso3: 'KNA',
    name: 'Saint Kitts and Nevis'
  },
  {
    iso3: 'KOR',
    name: 'South Korea'
  },
  {
    iso3: 'KOS',
    name: 'Kosovo'
  },
  {
    iso3: 'KWT',
    name: 'Kuwait'
  },
  {
    iso3: 'LAO',
    name: 'Laos'
  },
  {
    iso3: 'LBN',
    name: 'Lebanon'
  },
  {
    iso3: 'LBR',
    name: 'Liberia'
  },
  {
    iso3: 'LBY',
    name: 'Libya'
  },
  {
    iso3: 'LCA',
    name: 'Saint Lucia'
  },
  {
    iso3: 'LIE',
    name: 'Liechtenstein'
  },
  {
    iso3: 'LKA',
    name: 'Sri Lanka'
  },
  {
    iso3: 'LSO',
    name: 'Lesotho'
  },
  {
    iso3: 'LTU',
    name: 'Lithuania'
  },
  {
    iso3: 'LUX',
    name: 'Luxembourg'
  },
  {
    iso3: 'LVA',
    name: 'Latvia'
  },
  {
    iso3: 'MAC',
    name: 'Macao S.A.R'
  },
  {
    iso3: 'MAF',
    name: 'Saint Martin'
  },
  {
    iso3: 'MAR',
    name: 'Morocco'
  },
  {
    iso3: 'MCO',
    name: 'Monaco'
  },
  {
    iso3: 'MDA',
    name: 'Moldova'
  },
  {
    iso3: 'MDG',
    name: 'Madagascar'
  },
  {
    iso3: 'MDV',
    name: 'Maldives'
  },
  {
    iso3: 'MEX',
    name: 'Mexico'
  },
  {
    iso3: 'MHL',
    name: 'Marshall Islands'
  },
  {
    iso3: 'MKD',
    name: 'Macedonia'
  },
  {
    iso3: 'MKD',
    name: 'North Macedonia'
  },
  {
    iso3: 'MLI',
    name: 'Mali'
  },
  {
    iso3: 'MLT',
    name: 'Malta'
  },
  {
    iso3: 'MMR',
    name: 'Myanmar'
  },
  {
    iso3: 'MNE',
    name: 'Montenegro'
  },
  {
    iso3: 'MNG',
    name: 'Mongolia'
  },
  {
    iso3: 'MNP',
    name: 'Northern Mariana Islands'
  },
  {
    iso3: 'MOZ',
    name: 'Mozambique'
  },
  {
    iso3: 'MRT',
    name: 'Mauritania'
  },
  {
    iso3: 'MSR',
    name: 'Montserrat'
  },
  {
    iso2: 'MTQ',
    name: 'Martinique'
  },
  {
    iso3: 'MUS',
    name: 'Mauritius'
  },
  {
    iso3: 'MWI',
    name: 'Malawi'
  },
  {
    iso3: 'MYS',
    name: 'Malaysia'
  },
  {
    iso3: 'MYT',
    name: 'Mayotte'
  },
  {
    iso3: 'NAM',
    name: 'Namibia'
  },
  {
    iso3: 'NCL',
    name: 'New Caledonia'
  },
  {
    iso3: 'NER',
    name: 'Niger'
  },
  {
    iso3: 'NFK',
    name: 'Norfolk Island'
  },
  {
    iso3: 'NGA',
    name: 'Nigeria'
  },
  {
    iso3: 'NIC',
    name: 'Nicaragua'
  },
  {
    iso3: 'NIU',
    name: 'Niue'
  },
  {
    iso3: 'NLD',
    name: 'Netherlands'
  },
  {
    iso3: 'NOR',
    name: 'Norway'
  },
  {
    iso3: 'NPL',
    name: 'Nepal'
  },
  {
    iso3: 'NRU',
    name: 'Nauru'
  },
  {
    iso3: 'NZL',
    name: 'New Zealand'
  },
  {
    iso3: 'OMN',
    name: 'Oman'
  },
  {
    iso3: 'PAK',
    name: 'Pakistan'
  },
  {
    iso3: 'PAN',
    name: 'Panama'
  },
  {
    iso3: 'PCN',
    name: 'Pitcairn Islands'
  },
  {
    iso3: 'PER',
    name: 'Peru'
  },
  {
    iso3: 'PGA',
    name: 'Spratly Islands'
  },
  {
    iso3: 'PHL',
    name: 'Philippines'
  },
  {
    iso3: 'PLW',
    name: 'Palau'
  },
  {
    iso3: 'PNG',
    name: 'Papua New Guinea'
  },
  {
    iso3: 'POL',
    name: 'Poland'
  },
  {
    iso3: 'PRI',
    name: 'Puerto Rico'
  },
  {
    iso3: 'PRK',
    name: 'North Korea'
  },
  {
    iso3: 'PRT',
    name: 'Portugal'
  },
  {
    iso3: 'PRY',
    name: 'Paraguay'
  },
  {
    iso3: 'PSE',
    name: 'Palestine'
  },
  {
    iso3: 'PYF',
    name: 'French Polynesia'
  },
  {
    iso3: 'QAT',
    name: 'Qatar'
  },
  {
    iso3: 'REU',
    name: 'Reunion'
  },
  {
    iso3: 'ROU',
    name: 'Romania'
  },
  {
    iso3: 'RUS',
    name: 'Russia'
  },
  {
    iso3: 'RWA',
    name: 'Rwanda'
  },
  {
    iso3: 'SAH',
    name: 'Western Sahara'
  },
  {
    iso3: 'SAU',
    name: 'Saudi Arabia'
  },
  {
    iso3: 'SCR',
    name: 'Scarborough Reef'
  },
  {
    iso3: 'SDN',
    name: 'Sudan'
  },
  {
    iso3: 'SDS',
    name: 'South Sudan'
  },
  {
    iso3: 'SEN',
    name: 'Senegal'
  },
  {
    iso3: 'SER',
    name: 'Serranilla Bank'
  },
  {
    iso3: 'SGP',
    name: 'Singapore'
  },
  {
    iso3: 'SGS',
    name: 'South Georgia and the Islands'
  },
  {
    iso3: 'SHN',
    name: 'Saint Helena'
  },
  {
    iso3: 'SLB',
    name: 'Solomon Islands'
  },
  {
    iso3: 'SLE',
    name: 'Sierra Leone'
  },
  {
    iso3: 'SLV',
    name: 'El Salvador'
  },
  {
    iso3: 'SMR',
    name: 'San Marino'
  },
  {
    iso3: 'SOL',
    name: 'Somaliland'
  },
  {
    iso3: 'SOM',
    name: 'Somalia'
  },
  {
    iso3: 'SPM',
    name: 'Saint Pierre and Miquelon'
  },
  {
    iso3: 'SRB',
    name: 'Republic of Serbia'
  },
  {
    iso3: 'SRB',
    name: 'Serbia'
  },
  {
    iso3: 'STP',
    name: 'Sao Tome and Principe'
  },
  {
    iso3: 'SUR',
    name: 'Suriname'
  },
  {
    iso3: 'SVK',
    name: 'Slovakia'
  },
  {
    iso3: 'SVN',
    name: 'Slovenia'
  },
  {
    iso3: 'SWE',
    name: 'Sweden'
  },
  {
    iso3: 'SWZ',
    name: 'Eswatini'
  },
  {
    iso3: 'SWZ',
    name: 'Swaziland'
  },
  {
    iso3: 'SXM',
    name: 'Sint Maarten'
  },
  {
    iso3: 'SYC',
    name: 'Seychelles'
  },
  {
    iso3: 'SYR',
    name: 'Syria'
  },
  {
    iso3: 'TCA',
    name: 'Turks and Caicos Islands'
  },
  {
    iso3: 'TCD',
    name: 'Chad'
  },
  {
    iso3: 'TGO',
    name: 'Togo'
  },
  {
    iso3: 'THA',
    name: 'Thailand'
  },
  {
    iso3: 'TJK',
    name: 'Tajikistan'
  },
  {
    iso3: 'TKM',
    name: 'Turkmenistan'
  },
  {
    iso3: 'TLS',
    name: 'East Timor'
  },
  {
    iso3: 'TON',
    name: 'Tonga'
  },
  {
    iso3: 'TTO',
    name: 'Trinidad and Tobago'
  },
  {
    iso3: 'TUN',
    name: 'Tunisia'
  },
  {
    iso3: 'TUR',
    name: 'Turkey'
  },
  {
    iso3: 'TUV',
    name: 'Tuvalu'
  },
  {
    iso3: 'TWN',
    name: 'Taiwan'
  },
  {
    iso3: 'TZA',
    name: 'United Republic of Tanzania'
  },
  {
    iso3: 'TZA',
    name: 'Tanzania'
  },
  {
    iso3: 'UGA',
    name: 'Uganda'
  },
  {
    iso3: 'UKR',
    name: 'Ukraine'
  },
  {
    iso3: 'UMI',
    name: 'United States Minor Outlying Islands'
  },
  {
    iso3: 'URY',
    name: 'Uruguay'
  },
  {
    iso3: 'USA',
    name: 'United States of America'
  },
  {
    iso3: 'USG',
    name: 'US Naval Base Guantanamo Bay'
  },
  {
    iso3: 'UZB',
    name: 'Uzbekistan'
  },
  {
    iso3: 'VAT',
    name: 'Vatican'
  },
  {
    iso3: 'VCT',
    name: 'Saint Vincent and the Grenadines'
  },
  {
    iso3: 'VEN',
    name: 'Venezuela'
  },
  {
    iso3: 'VGB',
    name: 'British Virgin Islands'
  },
  {
    iso3: 'VIR',
    name: 'United States Virgin Islands'
  },
  {
    iso3: 'VNM',
    name: 'Vietnam'
  },
  {
    iso3: 'VUT',
    name: 'Vanuatu'
  },
  {
    iso3: 'WLF',
    name: 'Wallis and Futuna'
  },
  {
    iso3: 'WSB',
    name: 'Akrotiri Sovereign Base Area'
  },
  {
    iso3: 'WSM',
    name: 'Samoa'
  },
  {
    iso3: 'YEM',
    name: 'Yemen'
  },
  {
    iso3: 'ZAF',
    name: 'South Africa'
  },
  {
    iso3: 'ZMB',
    name: 'Zambia'
  },
  {
    iso3: 'ZWE',
    name: 'Zimbabwe'
  },
  // messed up iso codes that does not exist
  { iso3: 'VATICAN', name: 'Holy See' },
  { iso3: 'CRUISESHIP', name: 'Cruise Ship' }
];
