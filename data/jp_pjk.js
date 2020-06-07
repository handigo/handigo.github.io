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
    ['Aceh',10015,6655,2998,363,20031],
    ['Sumatera Utara',18615,8161,5963,695,33434],
    ['Sumatera Barat',10621,3503,3540,1750,19414],
    ['Riau',7389,6448,5167,1356,20360],
    ['Jambi',6384,1976,2217,164,10741],
    ['Sumatera Selatan',7988,4023,2596,1268,15875],
    ['Bengkulu',3811,1667,1240,253,6971],
    ['Lampung',11441,2954,2506,873,17774],
    ['Kep. Bangka Belitung',3316,25,595,149,4085, {lat: 1, drawConnector: false}],
    ['Kepulauan Riau',2529,719,762,193,4203, {lat: 1.5, lon: 1, drawConnector: false}],
    
    ['Jawa Barat',20233,815,233,2114,23395],
    ['Jawa Tengah',24376,579,156,1573,26684, {lat: 0.5, drawConnector: false}],
    ['D.I. Yogyakarta',3099,213,5,45,3362, {lat: -1}],
    ['Jawa Timur',33460,958,1104,1659,37181],
    ['Banten',4059,105,26,1300,5490, {lat: -1, lon: -1}],
    ['Bali',6853,60,296,141,7350],
    ['Nusa Tenggara Barat',4359,626,1099,1,6085, {lon: 1, drawConnector: false}],
    ['Nusa Tenggara Timur',10021,4279,3682,1145,19127, {lat: -1, lon: 1, drawConnector: false}],
    ['Kalimantan Barat',4887,1715,7268,792,14662],
    ['Kalimantan Tengah',3775,1952,7716,1270,14713],
    ['Kalimantan Selatan',6228,3057,1444,751,11480],
    ['Kalimantan Timur',2511,4424,2290,1737,10962, {lat: -1, drawConnector: false}],
    ['Kalimantan Utara',870,546,1006,147,2569, {lat: 2, drawConnector: false}],
    ['Sulawesi Utara',4904,721,1715,141,7481],
    ['Sulawesi Tengah',5558,3942,3152,239,12891, {lon: 2, drawConnector: false}],
    ['Sulawesi Selatan',13339,7682,2960,2734,26715, {lat: -0.75, drawConnector: false}],
    ['Sulawesi Tenggara',3938,4515,1999,276,10728],
    ['Gorontalo',1976,1194,1132,21,4323],
    ['Sulawesi Barat',1657,1869,1116,86,4728, {lon: -0.5, drawConnector: false}],
    ['Maluku',2689,1151,3367,126,7333, {lat: 4, drawConnector: false}],
    ['Maluku Utara',1779,1529,1508,58,4874, {lat: 2, lon: 2, drawConnector: false}],
    ['Papua Barat',1723,2819,3527,824,8893],
    ['Papua',3488,4683,8511,143,16825]            
       
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
		    text: 'Panjang Jalan Kabupaten/Kota Menurut Jenis Permukaan Tahun 2018 (km)'
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
            name: 'Kerikil'
        }, {
            from: 2,
            to: 3,
            name: 'Tanah',
            color: yelColor
        }, {
            from: 3,
            to: 4,
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
                        ['Aspal', this.grnVotes, grnColor],
                        ['Kerikil', this.bluVotes, bluColor],
                        ['Tanah', this.yelVotes, yelColor],
                        ['Lainnya', this.redVotes, redColor]
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

