'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('countries', [
      {
        code: 'BD',
        name: 'Bangladesh',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BE',
        name: 'Belgium',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BF',
        name: 'Burkina Faso',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BG',
        name: 'Bulgaria',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BA',
        name: 'Bosnia and Herzegovina',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BB',
        name: 'Barbados',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'WF',
        name: 'Wallis and Futuna',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BL',
        name: 'Saint Barthelemy',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BM',
        name: 'Bermuda',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BN',
        name: 'Brunei',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BO',
        name: 'Bolivia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BH',
        name: 'Bahrain',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BI',
        name: 'Burundi',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BJ',
        name: 'Benin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BT',
        name: 'Bhutan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JM',
        name: 'Jamaica',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BV',
        name: 'Bouvet Island',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BW',
        name: 'Botswana',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'WS',
        name: 'Samoa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BQ',
        name: 'Bonaire, Saint Eustatius and Saba ',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BR',
        name: 'Brazil',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BS',
        name: 'Bahamas',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JE',
        name: 'Jersey',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BY',
        name: 'Belarus',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'BZ',
        name: 'Belize',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'RU',
        name: 'Russia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'RW',
        name: 'Rwanda',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'RS',
        name: 'Serbia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TL',
        name: 'East Timor',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'RE',
        name: 'Reunion',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TM',
        name: 'Turkmenistan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TJ',
        name: 'Tajikistan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'RO',
        name: 'Romania',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TK',
        name: 'Tokelau',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GW',
        name: 'Guinea-Bissau',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GU',
        name: 'Guam',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GT',
        name: 'Guatemala',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GS',
        name: 'South Georgia and the South Sandwich Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GR',
        name: 'Greece',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GQ',
        name: 'Equatorial Guinea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GP',
        name: 'Guadeloupe',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JP',
        name: 'Japan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GY',
        name: 'Guyana',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GG',
        name: 'Guernsey',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GF',
        name: 'French Guiana',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GE',
        name: 'Georgia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GD',
        name: 'Grenada',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GB',
        name: 'United Kingdom',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GA',
        name: 'Gabon',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SV',
        name: 'El Salvador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GN',
        name: 'Guinea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GM',
        name: 'Gambia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GL',
        name: 'Greenland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GI',
        name: 'Gibraltar',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'GH',
        name: 'Ghana',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'OM',
        name: 'Oman',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TN',
        name: 'Tunisia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'JO',
        name: 'Jordan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HR',
        name: 'Croatia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HT',
        name: 'Haiti',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HU',
        name: 'Hungary',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HK',
        name: 'Hong Kong',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HN',
        name: 'Honduras',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'HM',
        name: 'Heard Island and McDonald Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VE',
        name: 'Venezuela',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PR',
        name: 'Puerto Rico',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PS',
        name: 'Palestinian Territory',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PW',
        name: 'Palau',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PT',
        name: 'Portugal',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SJ',
        name: 'Svalbard and Jan Mayen',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PY',
        name: 'Paraguay',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IQ',
        name: 'Iraq',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PA',
        name: 'Panama',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PF',
        name: 'French Polynesia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PG',
        name: 'Papua New Guinea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PE',
        name: 'Peru',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PK',
        name: 'Pakistan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PH',
        name: 'Philippines',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PN',
        name: 'Pitcairn',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PL',
        name: 'Poland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'PM',
        name: 'Saint Pierre and Miquelon',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ZM',
        name: 'Zambia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'EH',
        name: 'Western Sahara',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'EE',
        name: 'Estonia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'EG',
        name: 'Egypt',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ZA',
        name: 'South Africa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'EC',
        name: 'Ecuador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IT',
        name: 'Italy',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VN',
        name: 'Vietnam',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SB',
        name: 'Solomon Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ET',
        name: 'Ethiopia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SO',
        name: 'Somalia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ZW',
        name: 'Zimbabwe',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SA',
        name: 'Saudi Arabia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ES',
        name: 'Spain',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ER',
        name: 'Eritrea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ME',
        name: 'Montenegro',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MD',
        name: 'Moldova',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MG',
        name: 'Madagascar',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MF',
        name: 'Saint Martin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MA',
        name: 'Morocco',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MC',
        name: 'Monaco',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UZ',
        name: 'Uzbekistan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MM',
        name: 'Myanmar',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ML',
        name: 'Mali',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MO',
        name: 'Macao',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MN',
        name: 'Mongolia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MH',
        name: 'Marshall Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MK',
        name: 'Macedonia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MU',
        name: 'Mauritius',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MT',
        name: 'Malta',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MW',
        name: 'Malawi',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MV',
        name: 'Maldives',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MQ',
        name: 'Martinique',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MP',
        name: 'Northern Mariana Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MS',
        name: 'Montserrat',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MR',
        name: 'Mauritania',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IM',
        name: 'Isle of Man',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UG',
        name: 'Uganda',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TZ',
        name: 'Tanzania',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MY',
        name: 'Malaysia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MX',
        name: 'Mexico',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IL',
        name: 'Israel',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FR',
        name: 'France',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IO',
        name: 'British Indian Ocean Territory',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SH',
        name: 'Saint Helena',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FI',
        name: 'Finland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FJ',
        name: 'Fiji',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FK',
        name: 'Falkland Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FM',
        name: 'Micronesia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FO',
        name: 'Faroe Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NI',
        name: 'Nicaragua',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NL',
        name: 'Netherlands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NO',
        name: 'Norway',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NA',
        name: 'Namibia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VU',
        name: 'Vanuatu',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NC',
        name: 'New Caledonia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NE',
        name: 'Niger',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NF',
        name: 'Norfolk Island',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NG',
        name: 'Nigeria',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NZ',
        name: 'New Zealand',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NP',
        name: 'Nepal',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NR',
        name: 'Nauru',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'NU',
        name: 'Niue',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CK',
        name: 'Cook Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'XK',
        name: 'Kosovo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CI',
        name: 'Ivory Coast',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CH',
        name: 'Switzerland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CO',
        name: 'Colombia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CN',
        name: 'China',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CM',
        name: 'Cameroon',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CL',
        name: 'Chile',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CC',
        name: 'Cocos Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CA',
        name: 'Canada',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CG',
        name: 'Republic of the Congo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CF',
        name: 'Central African Republic',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CD',
        name: 'Democratic Republic of the Congo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CZ',
        name: 'Czech Republic',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CY',
        name: 'Cyprus',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CX',
        name: 'Christmas Island',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CR',
        name: 'Costa Rica',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CW',
        name: 'Curacao',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CV',
        name: 'Cape Verde',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CU',
        name: 'Cuba',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SZ',
        name: 'Swaziland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SY',
        name: 'Syria',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SX',
        name: 'Sint Maarten',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KG',
        name: 'Kyrgyzstan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KE',
        name: 'Kenya',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SS',
        name: 'South Sudan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SR',
        name: 'Suriname',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KI',
        name: 'Kiribati',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KH',
        name: 'Cambodia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KN',
        name: 'Saint Kitts and Nevis',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KM',
        name: 'Comoros',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ST',
        name: 'Sao Tome and Principe',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SK',
        name: 'Slovakia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KR',
        name: 'South Korea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SI',
        name: 'Slovenia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KP',
        name: 'North Korea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KW',
        name: 'Kuwait',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SN',
        name: 'Senegal',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SM',
        name: 'San Marino',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SL',
        name: 'Sierra Leone',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SC',
        name: 'Seychelles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KZ',
        name: 'Kazakhstan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'KY',
        name: 'Cayman Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SG',
        name: 'Singapore',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SE',
        name: 'Sweden',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SD',
        name: 'Sudan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DO',
        name: 'Dominican Republic',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DM',
        name: 'Dominica',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DJ',
        name: 'Djibouti',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DK',
        name: 'Denmark',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VG',
        name: 'British Virgin Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DE',
        name: 'Germany',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'YE',
        name: 'Yemen',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'DZ',
        name: 'Algeria',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'US',
        name: 'United States',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UY',
        name: 'Uruguay',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'YT',
        name: 'Mayotte',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UM',
        name: 'United States Minor Outlying Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LB',
        name: 'Lebanon',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LC',
        name: 'Saint Lucia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LA',
        name: 'Laos',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TV',
        name: 'Tuvalu',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TW',
        name: 'Taiwan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TT',
        name: 'Trinidad and Tobago',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TR',
        name: 'Turkey',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LK',
        name: 'Sri Lanka',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LI',
        name: 'Liechtenstein',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LV',
        name: 'Latvia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TO',
        name: 'Tonga',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LT',
        name: 'Lithuania',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LU',
        name: 'Luxembourg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LR',
        name: 'Liberia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LS',
        name: 'Lesotho',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TH',
        name: 'Thailand',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TF',
        name: 'French Southern Territories',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TG',
        name: 'Togo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TD',
        name: 'Chad',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'TC',
        name: 'Turks and Caicos Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'LY',
        name: 'Libya',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VA',
        name: 'Vatican',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VC',
        name: 'Saint Vincent and the Grenadines',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AE',
        name: 'United Arab Emirates',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AD',
        name: 'Andorra',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AG',
        name: 'Antigua and Barbuda',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AF',
        name: 'Afghanistan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AI',
        name: 'Anguilla',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'VI',
        name: 'U.S. Virgin Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IS',
        name: 'Iceland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IR',
        name: 'Iran',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AM',
        name: 'Armenia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AL',
        name: 'Albania',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AO',
        name: 'Angola',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AQ',
        name: 'Antarctica',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AS',
        name: 'American Samoa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AR',
        name: 'Argentina',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AU',
        name: 'Australia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AT',
        name: 'Austria',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AW',
        name: 'Aruba',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IN',
        name: 'India',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AX',
        name: 'Aland Islands',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'AZ',
        name: 'Azerbaijan',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'IE',
        name: 'Ireland',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'ID',
        name: 'Indonesia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'UA',
        name: 'Ukraine',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'QA',
        name: 'Qatar',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'MZ',
        name: 'Mozambique',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('countries', null, {})
  }
}
