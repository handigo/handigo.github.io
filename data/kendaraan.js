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

['Aceh',171815,66162,132544,2929612,3300133],
['Sumatera Utara',642107,57361,458271,6541363,7699102],
['Sumatera Barat',237251,91925,188384,2061042,2578602],
['Riau',701773,70545,208026,2277316,3257660],
['Jambi',339413,59822,390906,4784080,5574221],
['Sumatera Selatan',955914,82377,190461,4578471,5807223],
['Bengkulu',66218,9993,66228,1053800,1196239],
['Lampung',226501,26688,158685,3008567,3420441],
['Kep. Bangka Belitung',76947,26678,49106,1377302,1530033, {lat: 1, drawConnector: false}],
['Kepulauan Riau',192360,15687,48167,1235064,1491278, {lat: 1.5, lon: 1, drawConnector: false}],
['DKI Jakarta',4078868,543202,1057575,16080708,21760353, {lat: 1.25, lon: 0.5}],
['Jawa Barat',1558780,189649,834687,10510718,13093833],
['Jawa Tengah',1254891,100400,695087,15391655,17442033, {lat: 0.5, drawConnector: false}],
['D.I. Yogyakarta',431973,49226,184639,4098580,4764418, {lat: -1.2}],
['Jawa Timur',1529053,72859,652478,14993350,17247740],
['Banten',212639,26935,131549,2842097,3213220, {lat: -1, lon: -1}],
['Bali',902292,37893,329387,3874919,5144491],
['Nusa Tenggara Barat',153786,70424,102219,1964459,2290888, {lon: 1, drawConnector: false}],
['Nusa Tenggara Timur',216531,60398,113086,1590204,1980219, {lat: -1, lon: 1, drawConnector: false}],
['Kalimantan Barat',389537,62886,171702,2347828,2971953],
['Kalimantan Tengah',281380,83087,167241,1416502,1948210],
['Kalimantan Selatan',305424,138505,294135,2522699,3260763],
['Kalimantan Timur',294725,58014,346618,2387903,3087260, {lat: 0.5, drawConnector: false}],
['Sulawesi Utara',187415,100253,91786,1250951,1630405],
['Sulawesi Tengah',190973,47817,160262,2082823,2481875, {lon: 2, drawConnector: false}],
['Sulawesi Selatan',456271,143910,385266,3474322,4459769, {lat: 0.5, lon: -0.5, drawConnector: false}],
['Sulawesi Tenggara',57781,109321,63040,1369950,1600092],
['Gorontalo',96854,73101,21064,328899,519918],
['Maluku',67895,12011,33133,779251,892290, {lat: 4, drawConnector: false}],
['Maluku Utara',7015,3137,5205,152729,168086, {lat: 2, lon: 2, drawConnector: false}],
['Papua',156605,47916,47607,793883,1046011, {lat: 0.5,lon: -4, drawConnector: false}]
		
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
		    text: 'Jumlah Kendaraan Bermotor Tahun 2018'
  },
  
 

    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            
            color: grnColor,
            name: 'Mobil Penumpang'
        }, {
           
            color: bluColor,
            name: 'Mobil Bis'
        }, {
            
            name: 'Mobil Barang',
            color: yelColor
        }, {
            
            name: 'Sepeda Motor',
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
                        ['Mobil Penumpang', this.grnVotes, grnColor],
                        ['Mobil Bis', this.bluVotes, bluColor],
                        ['Mobil Barang', this.yelVotes, yelColor],
                        ['Sepeda Motor', this.redVotes, redColor]
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
            name: 'Mobil Penumpang',
            y: state.grnVotes,
            color: grnColor
        }, {
            name: 'Mobil Bis',
            y: state.bluVotes,
            color: bluColor
        }, {
            name: 'Mobil Barang',
            y: state.yelVotes,
            color: yelColor
        }, {
            name: 'Sepeda Motor',
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

