// Dashboard 1 Morris-chart

// Morris.Area({
//         element: 'morris-area-chart',
//         data: [{
//             period: '2012',
//             Python: 0,
//             PHP: 0,
//             Java: 0
//         }, {
//             period: '2013',
//             Python: 100,
//             PHP: 80,
//             Java: 65
//         }, {
//             period: '2014',
//             Python: 180,
//             PHP: 150,
//             Java: 120
//         }, {
//             period: '2015',
//             Python: 100,
//             PHP: 70,
//             Java: 40
//         }, {
//             period: '2016',
//             Python: 180,
//             PHP: 150,
//             Java: 120
//         }, {
//             period: '2017',
//             Python: 100,
//             PHP: 70,
//             Java: 40
//         },
//          {
//             period: '2018',
//             Python: 180,
//             PHP: 150,
//             Java: 120
//         }],
//         xkey: 'period',
//         ykeys: ['Python', 'PHP', 'Java'],
//         labels: ['Python', 'PHP', 'Java'],
//         pointSize: 0,
//         fillOpacity: 0.99,
//         pointStrokeColors:['#65b12d', '#933EC5 ', '#006DF0'],
//         behaveLikeLine: true,
//         gridLineColor: '#e0e0e0',
//         lineWidth:0,
//         hideHover: 'auto',
//         lineColors: ['#65b12d', '#933EC5 ', '#006DF0'],
//         resize: true
        
//     });
	
Morris.Area({
        element: 'extra-area-chart',
        data: [{
            period: '2014',
            Men: 90,
            Women: 80,
            Unisex: 20
        }, {
            period: '2015',
            Men: 100,
            Women: 120,
            Unisex: 70
        }, {
            period: '2016',
            Men: 130,
            Women: 100,
            Unisex: 80
        }, {
            period: '2017',
            Men: 80,
            Women: 60,
            Unisex: 70
        }, {
            period: '2018',
            Men: 70,
            Women: 200,
            Unisex: 140
        }, {
            period: '2019',
            Men: 180,
            Women: 150,
            Unisex: 140
        }, {
            period: '2020',
            Men: 105,
            Women: 100,
            Unisex: 80
        },
         {
            period: '2021',
            Men: 250,
            Women: 150,
            Unisex: 200
        }],
        xkey: 'period',
        ykeys: ['Men', 'Women', 'Unisex'],
        labels: ['Men', 'Women', 'Unisex'],
        pointSize: 3,
        fillOpacity: 0,
        pointStrokeColors:['#006DF0', '#933EC5', '#65b12d'],
        behaveLikeLine: true,
        gridLineColor: '#e0e0e0',
        lineWidth: 1,
        hideHover: 'auto',
        lineColors: ['#006DF0', '#933EC5', '#65b12d'],
        resize: true
        
    });