// New map-pie series type that also allows lat/lon as center option.
// Also adds a sizeFormatter option to the series, to allow dynamic sizing
// of the pies.
Highcharts.seriesType('mappie', 'pie', {
    center: null, // Can't be array by default anymore
    clip: true, // For map navigation
    states: {
        hover: {
            halo: {
                size: 5
            }
        }
    },
    dataLabels: {
        enabled: false
    }
}, {
    getCenter: function () {
        var options = this.options,
            chart = this.chart,
            slicingRoom = 2 * (options.slicedOffset || 0);
        if (!options.center) {
            options.center = [null, null]; // Do the default here instead
        }
        // Handle lat/lon support
        if (options.center.lat !== undefined) {
            var point = chart.fromLatLonToPoint(options.center);
            options.center = [
                chart.xAxis[0].toPixels(point.x, true),
                chart.yAxis[0].toPixels(point.y, true)
            ];
        }
        // Handle dynamic size
        if (options.sizeFormatter) {
            options.size = options.sizeFormatter.call(this);
        }
        // Call parent function
        var result = Highcharts.seriesTypes.pie.prototype.getCenter.call(this);
        // Must correct for slicing room to get exact pixel pos
        result[0] -= slicingRoom;
        result[1] -= slicingRoom;
        return result;
    },
    translate: function (p) {
        this.options.center = this.userOptions.center;
        this.center = this.getCenter();
        return Highcharts.seriesTypes.pie.prototype.translate.call(this, p);
    }
});



var data = [
    ['Aceh',7889,2541,2713,6888,20031],
    ['Sumatera Utara',12735,6038,6727,7934,33434],
    ['Sumatera Barat',8163,2925,3567,4759,19414],
    ['Riau',7885,4667,3086,4722,20360],
    ['Jambi',5672,1497,1945,1627,10741],
    ['Sumatera Selatan',7118,4031,2327,2399,15875],
    ['Bengkulu',3278,792,926,1975,6971],
    ['Lampung',7041,2569,2314,5850,17774],
    ['Kep. Bangka Belitung',2099,930,583,473,4085, {lat: 1, drawConnector: false}],
    ['Kepulauan Riau',1164,924,650,1465,4203, {lat: 1.5, lon: 1, drawConnector: false}],
    ['Jawa Barat',13164,4828,2854,2549,23395],
    ['Jawa Tengah',15265,4841,3648,2930,26684, {lat: 0.5, drawConnector:false}],
    ['D.I. Yogyakarta',1750,772,435,405,3362, {lat: -1}],
    ['Jawa Timur',23586,4790,3925,4880,37181],
    ['Banten',3749,1020,457,264,5490, {lat: -0.75, lon: -0.5}],
    ['Bali',4759,681,807,1103,7350],
    ['Nusa Tenggara Barat',2828,632,855,1770,6085, {lon: 1, drawConnector: false}],
    ['Nusa Tenggara Timur',7592,1759,2925,6851,19127, {lat: -1, lon: 1, drawConnector: false}],
    ['Kalimantan Barat',4219,3024,2590,4829,14662],
    ['Kalimantan Tengah',4121,3124,2829,4639,14713],
    ['Kalimantan Selatan',4434,1922,3118,2006,11480],
    ['Kalimantan Timur',3894,2141,2329,2598,10962, {lat: -1, drawConnector: false}],
    ['Kalimantan Utara',607,736,503,723,2569, {lat: 2, drawConnector: false}],
    ['Sulawesi Utara',3508,824,875,2274,7481],
    ['Sulawesi Tengah',3163,2155,3454,4119,12891, {lon: 2, drawConnector: false}],
    ['Sulawesi Selatan',11418,4558,4547,6192,26715, {lat: -0.75, drawConnector: false}],
    ['Sulawesi Tenggara',2920,2535,2452,2821,10728],
    ['Gorontalo',2162,461,447,1253,4323],
    ['Sulawesi Barat',1624,852,1204,1048,4728, {lon: -0.5, drawConnector: false}],
    ['Maluku',2710,380,1096,3147,7333, {lat: 4, drawConnector: false}],
    ['Maluku Utara',1695,712,427,2040,4874, {lat: 2, lon: 2, drawConnector: false}],
    ['Papua Barat',2663,950,1107,4173,8893],
    ['Papua',3306,3012,3083,7424,16825]
    
       
  ],
		maxVotes = 0,
    grnColor = 'rgba(46,125,50,0.80)',
    bluColor = 'rgba(142,36,170,0.80)',
    yelColor = 'rgba(240,190,50,0.80)',
    redColor = 'rgba(220,71,71,0.80)';
    
    // Compute max votes to find relative sizes of bubbles
Highcharts.each(data, function (row) {
    maxVotes = Math.max(maxVotes, row[5]);
});

// Build the chart
var chart = Highcharts.mapChart('container', {
    title: {
        text: 'Statistik Transportasi Darat Indonesia'
    },
    
    subtitle: {
		    text: 'Panjang Jalan Kabupaten/Kota Menurut Kondisi Jalan Tahun 2018 (km)'
  },
  
  
    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
           
            color: grnColor,
            name: 'Baik'
        }, {
            
            color: bluColor,
            name: 'Sedang'
        }, {
            
            name: 'Rusak',
            color: yelColor
        }, {
            
            name: 'Rusak Berat',
            color: redColor
        }]
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
      			verticalAlign: 'bottom'
    	}
    },
    // Limit zoom range
    yAxis: {
        minRange: 2300
    },

    tooltip: {
        useHTML: true
    },

    // Default options for the pies
    plotOptions: {
        mappie: {
            borderColor: 'rgba(255,255,255,0.4)',
            borderWidth: 1,
            tooltip: {
                headerFormat: ''
            }
        }
    },
    
    series: [{
        
        mapData: Highcharts.maps['countries/id/id-all'],
        data: data,
        name: '',
        color: '#90CAF9' ,
        borderColor: '#FFF',
        showInLegend: false,
        joinBy: ['name', 'id'],
        keys: ['id', 'grnVotes', 'bluVotes', 'yelVotes', 'redVotes',
            'sumVotes', 'pieOffset'],
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                var hoverVotes = this.hoverVotes; // Used by pie only
                return '<b>' + this.id + '</b><br/>' +
                    Highcharts.map([                        
                        ['Baik', this.grnVotes, grnColor],
                        ['Sedang', this.bluVotes, bluColor],
                        ['Rusak', this.yelVotes, yelColor],
                        ['Rusak Berat', this.redVotes, redColor]
                    ],
                     
                    function (line) {
                        return '<span style="color:' + line[2] +
                            // Colorized bullet
                            '">\u25CF</span> ' +
                            // Party and votes
                            (line[0] === hoverVotes ? '<b>' : '') +
                            line[0] + ': ' +
                            Highcharts.numberFormat(line[1], 0) +
                            (line[0] === hoverVotes ? '</b>' : '') +
                            '<br>';
                    })
                    .join('') +
                    '<hr/>Total: ' + Highcharts.numberFormat(this.sumVotes, 0);
            }
        }
    }, 
    {name: 'Separators',
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['countries/id/id-all'], 'mapline'),
        color: '#000000',
        showInLegend: false,
        enableMouseTracking: false
    }, {
        name: 'Connectors',
        type: 'mapline',
        color: 'rgba(0, 0, 0, 0.6)',
        zIndex: 5,
        showInLegend: false,
        enableMouseTracking: false}
    
    ]
});



// Add the pies after chart load, optionally with offset and connectors
Highcharts.each(chart.series[0].points, function (state) {
    if (!state.id) {
        return; // Skip points with no data, if any
    }

    var pieOffset = state.pieOffset || {},
        centerLat = parseFloat(state.properties.latitude),
        centerLon = parseFloat(state.properties.longitude);

    // Add the pie for this state
    chart.addSeries({
        type: 'mappie',
        name: state.id,
        zIndex: 6, // Keep pies above connector lines
        sizeFormatter: function () {
            var yAxis = this.chart.yAxis[0],
                zoomFactor = (yAxis.dataMax - yAxis.dataMin) /
                    (yAxis.max - yAxis.min);
            return Math.max(
                this.chart.chartWidth / 45 * zoomFactor, // Min size
                this.chart.chartWidth / 25 * zoomFactor * state.sumVotes / maxVotes
            );
        },
        tooltip: {
            // Use the state tooltip for the pies as well
            pointFormatter: function () {
                return state.series.tooltipOptions.pointFormatter.call({
                    id: state.id,
                    hoverVotes: this.name,
                    grnVotes: state.grnVotes,
                    bluVotes: state.bluVotes,
                    yelVotes: state.yelVotes,
                    redVotes: state.redVotes,
                    sumVotes: state.sumVotes
                });
            }
        },
        data: [{
            name: 'Baik',
            y: state.grnVotes,
            color: grnColor
        }, {
            name: 'Sedang',
            y: state.bluVotes,
            color: bluColor
        }, {
            name: 'Rusak',
            y: state.yelVotes,
            color: yelColor
        }, {
            name: 'Rusak Berat',
            y: state.redVotes,
            color: redColor
        }],
        center: {
            lat: centerLat + (pieOffset.lat || 0),
            lon: centerLon + (pieOffset.lon || 0)
        }
    }, false);

    // Draw connector to state center if the pie has been offset
    if (pieOffset.drawConnector !== false) {
        var centerPoint = chart.fromLatLonToPoint({
                lat: centerLat,
                lon: centerLon
            }),
            offsetPoint = chart.fromLatLonToPoint({
                lat: centerLat + (pieOffset.lat || 0),
                lon: centerLon + (pieOffset.lon || 0)
            });
        chart.series[2].addPoint({
            name: state.id,
            path: 'M' + offsetPoint.x + ' ' + offsetPoint.y +
                'L' + centerPoint.x + ' ' + centerPoint.y
        }, false);
    }
});
// Only redraw once all pies and connectors have been added
chart.redraw();