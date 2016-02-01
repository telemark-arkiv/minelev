'use strict'

var students = [
  {
    firstName: 'Hallgrim',
    middleName: '',
    lastName: 'Durk',
    fullName: 'Hallgrim Durk',
    personalIdNumber: '18117148321',
    userName: 'haldu',
    unitId: 'SKIVS',
    unitName: 'Birger Bønks videregående skole',
    orgId: '',
    groups: [
      {
        id: 'SKIVS:2SAA/151KRO1005',
        description: 'Kroppsøving',
        unitId: 'SKIVS'
      },
      {
        id: 'SKIVS:1STH/151SAF1001',
        description: 'Samfunnsfag',
        unitId: 'SKIVS'
      },
      {
        id: 'SKIVS:1STC/151GEO1001',
        description: 'Geografi',
        unitId: 'SKIVS'
      }
    ],
    contactTeacher: true
  },
  {
    firstName: 'Helga',
    middleName: '',
    lastName: 'Durk',
    fullName: 'Helga Durk',
    personalIdNumber: '220475148321',
    userName: 'heldu',
    unitId: 'SKIVS',
    unitNavn: 'Birger Bønks videregående skole',
    orgId: '',
    groups: [
      {
        id: 'SKIVS:2SAA/151KRO1005',
        description: 'Kroppsøving',
        unitId: 'SKIVS'
      }
    ],
    contactTeacher: false
  }
]

module.exports = students
