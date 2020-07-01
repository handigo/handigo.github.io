// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
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
                ['Aceh',1195,518,69,0,1782],
                ['Sumatera Utara',2626,161,259,2,3048],
                ['Sumatera Barat',1094,4,411,16,1525],
                ['Riau',1366,674,332,428,2800],
                ['Jambi',737,166,72,58,1033],
                ['Sumatera Selatan',1395,6,14,99,1514],
                ['Bengkulu',1267,258,17,21,1563],
                ['Lampung',1233,297,2,161,1693],
                ['Kep. Bangka Belitung',850,1,0,0,851, {lat: 1, drawConnector: false}],
                ['Kepulauan Riau',678,0,158,60,896, {lat: 1.5, lon: 1, drawConnector: false}],
                ['DKI Jakarta',5621,0,0,1058,6679, {lat: 1.5, lon: 0.5}],
                ['Jawa Barat',2203,27,0,131,2361],
                ['Jawa Tengah',1755,0,0,650,2405],
                ['D.I. Yogyakarta',755,0,5,0,760, {lat: -1}],
                ['Jawa Timur',1406,0,0,15,1421],
                ['Banten',334,26,0,402,762, {lat: -1, lon: -1}],
                ['Bali',743,0,0,0,743],
                ['Nusa Tenggara Barat',1294,29,161,0,1484, {lon: 1, drawConnector: false}],
                ['Nusa Tenggara Timur',1934,712,0,4,2650, {lat: -1, lon: 1, drawConnector: false}],
                ['Kalimantan Barat',865,157,513,0,1535],
                ['Kalimantan Tengah',813,317,141,1,1272],
                ['Kalimantan Selatan',593,11,151,8,763],
                ['Kalimantan Timur',572,113,49,151,885, {lat: -1, drawConnector: false}],
                ['Kalimantan Utara',98,79,665,10,852, {lat: 2, drawConnector: false}],
                ['Sulawesi Utara',756,78,93,0,927],
                ['Sulawesi Tengah',1319,43,277,5,1644, {lon: 2, drawConnector: false}],
                ['Sulawesi Selatan',1326,231,343,115,2015, {lat: -0.75, drawConnector: false}],
                ['Sulawesi Tenggara',634,368,7,0,1009],
                ['Gorontalo',274,114,74,5,467],
                ['Sulawesi Barat',49,72,50,15,186, {lon: -0.5, drawConnector: false}],
                ['Maluku',645,127,308,0,1080, {lat: 4, drawConnector: false}],
                ['Maluku Utara',506,206,565,0,1277, {lat: 2, lon: 2, drawConnector: false}],
                ['Papua Barat',740,1272,257,41,2310],
                ['Papua',1151,781,289,141,2362]

       
  ],
		maxVotes = 0,
    grnColor = '#424242',
    bluColor = '#90A4AE',
    yelColor = '#8D6E63',
    redColor = '#FFA726';
    
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
		    text: 'Panjang Jalan Provinsi Menurut Jenis Permukaan Tahun 2018 (km)'
  },
  
  

    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            
            color: grnColor,
            name: 'Aspal'
        }, {
            
            color: bluColor,
            name: 'Kerikil'
        }, {
            
            name: 'Tanah',
            color: yelColor
        }, {
            
            name: 'Lainnya',
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
                        ['Aspal', this.grnVotes, grnColor],
                        ['Kerikil', this.bluVotes, bluColor],
                        ['Tanah', this.yelVotes, yelColor],
                        ['Lainnya', this.redVotes, redColor]
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
                            '<br/>';
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
            name: 'Aspal',
            y: state.grnVotes,
            color: grnColor
        }, {
            name: 'Kerikil',
            y: state.bluVotes,
            color: bluColor
        }, {
            name: 'Tanah',
            y: state.yelVotes,
            color: yelColor
        }, {
            name: 'Lainnya',
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

