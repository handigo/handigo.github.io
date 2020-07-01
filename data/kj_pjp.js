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
            ['Aceh',871,324,85,502,1782],
            ['Sumatera Utara',1177,1267,194,410,3048],
            ['Sumatera Barat',377,722,126,300,1525],
            ['Riau',1004,699,94,1003,2800],
            ['Jambi',414,385,161,73,1033],
            ['Sumatera Selatan',525,402,224,363,1514],
            ['Bengkulu',636,294,310,323,1563],
            ['Lampung',1141,167,86,299,1693],
            ['Kep. Bangka Belitung',476,236,84,55,851, {lat: 1, drawConnector: false}],
            ['Kepulauan Riau',410,179,110,197,896, {lat: 1.5, lon: 1, drawConnector: false}],
            ['DKI Jakarta',4455,0,2224,0,6679, {lat: -2.25, lon: -0.5}],
            ['Jawa Barat',867,1262,205,27,2361],
            ['Jawa Tengah',2169,196,40,0,2405],
            ['D.I. Yogyakarta',341,213,143,63,760, {lat: -1}],
            ['Jawa Timur',671,623,123,4,1421],
            ['Banten',526,154,56,26,762],
            ['Bali',428,173,142,0,743],
            ['Nusa Tenggara Barat',1029,213,2,240,1484, {lon: 1, drawConnector: false}],
            ['Nusa Tenggara Timur',1497,211,229,713,2650, {lat: -1, lon: 1, drawConnector: false}],
            ['Kalimantan Barat',775,543,133,84,1535],
            ['Kalimantan Tengah',509,248,301,214,1272],
            ['Kalimantan Selatan',451,107,42,163,763],
            ['Kalimantan Timur',465,3,288,129,885, {lat: -1, drawConnector: false}],
            ['Kalimantan Utara',58,50,44,700,852, {lat: 2, drawConnector: false}],
            ['Sulawesi Utara',379,288,88,172,927],
            ['Sulawesi Tengah',271,723,229,421,1644, {lon: 2, drawConnector: false}],
            ['Sulawesi Selatan',813,374,254,574,2015, {lat: -0.75, drawConnector: false}],
            ['Sulawesi Tenggara',492,269,79,169,1009],
            ['Gorontalo',185,38,56,188,467],
            ['Sulawesi Barat',48,35,31,72,186, {lon: -0.5, drawConnector: false}],
            ['Maluku',428,75,183,394,1080, {lat: 4, drawConnector: false}],
            ['Maluku Utara',379,173,160,565,1277, {lat: 2, lon: 2, drawConnector: false}],
            ['Papua Barat',631,446,940,293,2310],
            ['Papua',638,618,937,169,2362]    
       
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
		    text: 'Panjang Jalan Provinsi Menurut Kondisi Jalan Tahun 2018 (km)'
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