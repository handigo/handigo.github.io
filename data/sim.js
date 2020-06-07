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
            ['Aceh',72308,10699,2961,61954,147922],
            ['Sumatera Utara',151411,24452,7938,239390,423191],
            ['Sumatera Barat',91578,8326,5525,150816,256245],
            ['Riau',117135,6689,3596,153072,280492],
            ['Jambi',50489,5016,1251,69478,126234],
            ['Sumatera Selatan',79375,7832,1526,120363,209096],
            ['Bengkulu',29712,2348,221,54721,87002],
            ['Lampung',106653,19347,14280,225586,365866],
            ['Kep. Bangka Belitung',26979,2910,276,50401,80566, {lat: 1, drawConnector: false}],
            ['Kepulauan Riau',35344,3258,798,59254,98654, {lat: 1.5, lon: 1, drawConnector: false}],
            ['DKI Jakarta',747886,38313,7737,1105582,1899518, {lat: 1.25, lon: 0.5}],
            ['Jawa Barat',484512,45122,26287,1072244,1628165],
            ['Jawa Tengah',453332,45124,24972,1529731,2053159, {lat: 1, lon: 0.25, drawConnector: false}],
            ['D.I. Yogyakarta',88522,3268,492,248545,340827, {lat: -1.2}],
            ['Jawa Timur',531679,50669,26551,1525374,2134273],
            ['Banten',107791,8935,6995,177681,301402, {lat: -1, lon: -1}],
            ['Bali',164003,11545,1399,367241,544188],
            ['Nusa Tenggara Barat',40512,6966,1434,136081,184993, {lon: 1, drawConnector: false}],
            ['Nusa Tenggara Timur',24273,7271,675,76158,108377, {lat: -1, lon: 1, drawConnector: false}],
            ['Kalimantan Barat',59501,9632,2611,164312,236056],
            ['Kalimantan Tengah',44409,4122,1563,110243,160337],
            ['Kalimantan Selatan',93268,5441,6678,242301,347688],
            ['Kalimantan Timur',100197,7995,13399,226632,348223, {lat: 0.5, drawConnector: false}],
            ['Sulawesi Utara',34480,5627,4580,52076,96763],
            ['Sulawesi Tengah',29912,3522,3933,60482,97849, {lon: 2, drawConnector: false}],
            ['Sulawesi Selatan',142960,10850,9809,338290,501909, {lat: 0.5, lon: -0.5, drawConnector: false}],
            ['Sulawesi Tenggara',28437,1307,3953,85276,118973],
            ['Gorontalo',13921,1968,568,33621,50078],
            ['Maluku',10638,2677,315,31990,45620, {lat: 4, drawConnector: false}],
            ['Maluku Utara',6515,855,849,16322,24541, {lat: 2, lon: 2, drawConnector: false}],
            ['Papua',30259,6647,1869,70304,109079, {lat: 0.5,lon: -4, drawConnector: false}]		
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
		    text: 'Jumlah Surat Izin Mengemudi Yang Dikeluarkan Tahun 2018'
  },
  
    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            from: -1,
            to: 0,
            color: grnColor,
            name: 'SIM A'
        }, {
            from: 0,
            to: 1,
            color: bluColor,
            name: 'SIM BI'
        }, {
            from: 2,
            to: 3,
            name: 'SIM BII',
            color: yelColor
        }, {
            from: 3,
            to: 4,
            name: 'SIM C',
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
        /*mapData: Highcharts.maps['countries/us/us-all'],*/
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
                        ['SIM A', this.grnVotes, grnColor],
                        ['SIM BI', this.bluVotes, bluColor],
                        ['SIM BII', this.yelVotes, yelColor],
                        ['SIM C', this.redVotes, redColor]                                             
                    ],
                    //.sort(function (a, b) {
                    //    return b[1] - a[1]; // Sort tooltip by most votes
                    //}), 
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

// When clicking legend items, also toggle connectors and pies
Highcharts.each(chart.legend.allItems, function (item) {
    var old = item.setVisible;
    item.setVisible = function () {
        var legendItem = this;
        old.call(legendItem);
        Highcharts.each(chart.series[0].points, function (point) {
            if (chart.colorAxis[0].dataClasses[point.dataClass].name === legendItem.name) {
                // Find this state's pie and set visibility
                Highcharts.find(chart.series, function (item) {
                    return item.name === point.id;
                }).setVisible(legendItem.visible, false);
                // Do the same for the connector point if it exists
                var connector = Highcharts.find(chart.series[2].points, function (item) {
                    return item.name === point.id;
                });
                if (connector) {
                    connector.setVisible(legendItem.visible, false);
                }
            }
        });
        chart.redraw();
    };
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
            name: 'SIM A',
            y: state.grnVotes,
            color: grnColor
        }, {
            name: 'SIM BI',
            y: state.bluVotes,
            color: bluColor
        }, {
            name: 'SIM BII',
            y: state.yelVotes,
            color: yelColor
        }, {
            name: 'SIM C',
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

