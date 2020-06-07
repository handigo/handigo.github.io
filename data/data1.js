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
				['Aceh', 1093, 905, 97, 7, 2102],
				['Sumatera Utara', 1019, 1374, 197, 42, 2632],
				['Sumatera Barat', 892, 463, 85, 9, 1449],
				['Riau', 384, 780, 129, 44, 1337],
				['Jambi', 835, 413, 40, 30, 1318],
				['Sumatera Selatan', 457, 947, 155, 41, 1600],
				['Bengkulu', 511, 258, 23, 1, 793],
				['Lampung', 570, 605, 82, 35, 1292],
				['Kep. Bangka Belitung', 462, 134, 4, 0, 600, {lat: 1, drawConnector: false}],
				['Kepulauan Riau', 351, 198, 21, 17, 587, {lat: 1.5, lon: 1, drawConnector: false}],
				['DKI Jakarta', 14, 33, 5, 1, 53, {lat: 1}],
				['Jawa Barat', 730, 870, 163, 26, 1789],
				['Jawa Tengah', 588, 869, 56, 5, 1518],
				['D.I. Yogyakarta', 178, 68, 1, 1, 248, {lat: -1}],
				['Jawa Timur', 958, 1312, 85, 6, 2361],
				['Banten', 101, 330, 105, 29, 565, {lat: -1, lon: -1}],
				['Bali', 476, 146, 6, 1, 629],
				['Nusa Tenggara Barat', 661, 243, 26, 5, 935, {lon: 1, drawConnector: false}],
				['Nusa Tenggara Timur', 1235, 547, 55, 21, 1858, {lat: -1, lon: 1, drawConnector: false}],
				['Kalimantan Barat', 1453, 513, 102, 50, 2118],
				['Kalimantan Tengah', 920, 712, 152, 218, 2002],
				['Kalimantan Selatan', 573, 551, 66, 14, 1204],
				['Kalimantan Timur', 575, 996, 111, 29, 1711, {lat: -1, drawConnector: false}],
				['Kalimantan Utara', 323, 218, 36, 8, 585, {lat: 2, drawConnector: false}],
				['Sulawesi Utara', 845, 719, 58 , 42 , 1664 ],
				['Sulawesi Tengah', 1141 , 1103 , 105 , 24 , 2373, {lon: 2, drawConnector: false} ],
				['Sulawesi Selatan', 1090 , 583 , 28 , 45 , 1746, {lat: -0.75, drawConnector: false} ],
				['Sulawesi Tenggara', 820 , 584 , 70 , 24 , 1498 ],
				['Gorontalo', 331 , 364 , 36 , 18 , 749 ],
				['Sulawesi Barat', 469 , 203 , 35 , 56 , 763, {lon: -0.5, drawConnector: false} ],
				['Maluku', 1022 , 596 , 83 , 71 , 1772, {lat: 4, drawConnector: false} ],
				['Maluku Utara', 703, 416, 42, 42, 1203, {lat: 2, lon: 2, drawConnector: false}],
				['Papua Barat', 591, 478, 142, 115, 1326],
				['Papua', 1259 , 1048, 260, 70, 2637]
       
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
		    text: 'Panjang Jalan Negara Menurut Kondisi Jalan Tahun 2018 (km)'
  },
  
  
    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            from: -1,
            to: 0,
            color: grnColor,
            name: 'Baik'
        }, {
            from: 0,
            to: 1,
            color: bluColor,
            name: 'Sedang'
        }, {
            from: 2,
            to: 3,
            name: 'Rusak',
            color: yelColor
        }, {
            from: 3,
            to: 4,
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
                        ['Baik', this.grnVotes, grnColor],
                        ['Sedang', this.bluVotes, bluColor],
                        ['Rusak', this.yelVotes, yelColor],
                        ['Rusak Berat', this.redVotes, redColor]
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