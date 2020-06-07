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
				
['Aceh',1997,105,2102],
['Sumatera Utara',2392,240,2632],
['Sumatera Barat',1355,94,1449],
['Riau',1165,172,1337],
['Jambi',1248,70,1318],
['Sumatera Selatan',1404,196,1600],
['Bengkulu',770,23,793],
['Lampung',1175,117,1292],
['Kep. Bangka Belitung',596,4,600, {lat: 1, drawConnector: false}],
['Kepulauan Riau',549,38,587, {lat: 1.5, lon: 1, drawConnector: false}],
['DKI Jakarta',47,6,53, {lat: 1}],
['Jawa Barat',1600,189,1789],
['Jawa Tengah',1457,61,1518],
['D.I. Yogyakarta',246,2,248, {lat: -1}],
['Jawa Timur',2271,90,2361],
['Banten',431,134,565, {lat: -0.75, lon: -0.75}],
['Bali',622,7,629],
['Nusa Tenggara Barat',904,31,935, {lon: 1, drawConnector: false}],
['Nusa Tenggara Timur',1782,76,1858, {lat: -1, lon: 1, drawConnector: false}],
['Kalimantan Barat',1965,153,2118],
['Kalimantan Tengah',1632,370,2002],
['Kalimantan Selatan',1124,80,1204],
['Kalimantan Timur',1571,140,1711, {lat: -1, drawConnector: false}],
['Kalimantan Utara',541,44,585, {lat: 2, drawConnector: false}],
['Sulawesi Utara',1564,100,1664],
['Sulawesi Tengah',2244,129,2373, {lon: 2, drawConnector: false}],
['Sulawesi Selatan',1674,72,1746, {lat: -0.75, drawConnector: false}],
['Sulawesi Tenggara',1404,94,1498],
['Gorontalo',694,55,749],
['Sulawesi Barat',672,91,763, {lon: -0.5, drawConnector: false}],
['Maluku',1618,154,1772, {lat: 4, drawConnector: false}],
['Maluku Utara',1119,84,1203, {lat: 2, lon: 2, drawConnector: false}],
['Papua Barat',1068,258,1326],
['Papua',2307,330,2637]
       
  ],
		maxVotes = 0,
    grnColor = '#424242',
    bluColor = '#FFA726';
    //yelColor = 'rgba(240,190,50,0.80)',
    //redColor = 'rgba(220,71,71,0.80)';
    
    // Compute max votes to find relative sizes of bubbles
Highcharts.each(data, function (row) {
    maxVotes = Math.max(maxVotes, row[3]);
});

// Build the chart
var chart = Highcharts.mapChart('container', {
    title: {
        text: 'Statistik Transportasi Darat Indonesia'
    },
    
    subtitle: {
		    text: 'Panjang Jalan Negara Menurut Jenis Permukaan Tahun 2018 (km)'
  },
  
  

    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            from: -1,
            to: 0,
            color: grnColor,
            name: 'Aspal'
        }, {
            from: 0,
            to: 1,
            color: bluColor,
            name: 'Tidak Diaspal'
        /*}, {
            from: 2,
            to: 3,
            name: 'Rusak',
            color: yelColor
        }, {
            from: 3,
            to: 4,
            name: 'Rusak Berat',
            color: redColor*/
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
        keys: ['id', 'grnVotes', 'bluVotes', 'sumVotes', 'pieOffset'],
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                var hoverVotes = this.hoverVotes; // Used by pie only
                return '<b>' + this.id + '</b><br/>' +
                    Highcharts.map([                        
                        ['Aspal', this.grnVotes, grnColor],
                        ['Tidak Diaspal', this.bluVotes, bluColor]
                        //['Rusak', this.yelVotes, yelColor],
                        //['Rusak Berat', this.redVotes, redColor]
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
                   // yelVotes: state.yelVotes,
                    //redVotes: state.redVotes,
                    sumVotes: state.sumVotes
                });
            }
        },
        data: [{
            name: 'Aspal',
            y: state.grnVotes,
            color: grnColor
        }, {
            name: 'Tidak Diaspal',
            y: state.bluVotes,
            color: bluColor
      /* }, {
            name: 'Rusak',
            y: state.yelVotes,
            color: yelColor
        }, {
            name: 'Rusak Berat',
            y: state.redVotes,
            color: redColor*/
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

