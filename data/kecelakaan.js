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
    ['Aceh',771,340,3531,2349],
    ['Sumatera Utara',2062,1723,6748,6189],
    ['Sumatera Barat',638,238,4453,3009],
    ['Riau',800,582,1705,1734],
    ['Jambi',419,206,1686,1221],
    ['Sumatera Selatan',788,348,990,1219],
    ['Bengkulu',243,315,659,65],
    ['Lampung',817,1211,1943,2188],
    ['Kep. Bangka Belitung',206,127,136,275, {lat: 1, drawConnector: false}],
    ['Kepulauan Riau',214,197,968,776, {lat: 1.5, lon: 1, drawConnector: false}],
    ['DKI Jakarta',1516,776,5027,5883, {lat: 1, lon: 0.25}],
    ['Jawa Barat',3672,1103,7639,7602],
    ['Jawa Tengah',4125,98,22178,19191, {lat: 0.5, drawConnector: false}],
    ['D.I. Yogyakarta',526,16,6698,4728, {lat: -1}],
    ['Jawa Timur',5308,744,33036,24757],
    ['Banten',759,176,1714,1499, {lat: -1, lon: -1}],
    ['Bali',534,260,3792,2847],
    ['Nusa Tenggara Barat',570,305,1775,1689, {lon: 1, drawConnector: false}],
    ['Nusa Tenggara Timur',515,519,2384,1678, {lat: -1, lon: 1, drawConnector: false}],
    ['Kalimantan Barat',561,459,1144,1183],
    ['Kalimantan Tengah',369,120,951,842],
    ['Kalimantan Selatan',339,103,348,487],
    ['Kalimantan Timur',338,165,645,723, {lat: -1, drawConnector: false}],
    ['Kalimantan Utara',59,66,202,181, {lat: 2, drawConnector: false}],
    ['Sulawesi Utara',382,312,2905,2139],
    ['Sulawesi Tengah',416,828,2105,1831, {lon: 2, drawConnector: false}],
    ['Sulawesi Selatan',1183,376,9794,7547, {lat: -0.75, drawConnector: false}],
    ['Sulawesi Tenggara',297,127,1268,1019],
    ['Gorontalo',128,30,636,515],
    ['Sulawesi Barat',198,54,725,610, {lon: -0.5, drawConnector: false}],
    ['Maluku',189,253,422,408, {lat: 4, drawConnector: false}],
    ['Maluku Utara',128,83,352,271, {lat: 2, lon: 2, drawConnector: false}],
    ['Papua Barat',123,177,494,475],
    ['Papua',279,878,1518,1492]
				       
  ],
		maxVotes = 0,
    grnColor = 'rgba(213,0,0,0.80)',
    bluColor = 'rgba(142,36,170,0.80)',
    yelColor = 'rgba(240,190,50,0.80)';
    
    
    // Compute max votes to find relative sizes of bubbles
Highcharts.each(data, function (row) {
    maxVotes = Math.max(maxVotes, row[4]);
});

// Build the chart
var chart = Highcharts.mapChart('container', {
    title: {
        text: 'Statistik Transportasi Darat Indonesia'
    },
    
    subtitle: {
		    text: 'Jumlah Korban dan Kecelakaan Lalu Lintas Tahun 2018'
  },
  
  
    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            
            color: grnColor,
            name: 'Meninggal'
        }, {
            
            color: bluColor,
            name: 'Luka Berat'
        }, {
            
            name: 'Luka Ringan',
            color: yelColor
        
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
        keys: ['id', 'grnVotes', 'bluVotes', 'yelVotes', 
            'sumVotes', 'pieOffset'],
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                var hoverVotes = this.hoverVotes; // Used by pie only
                return '<b>' + this.id + '</b><br/>' +
                    Highcharts.map([                        
                        ['Meninggal', this.grnVotes, grnColor],
                        ['Luka Berat', this.bluVotes, bluColor],
                        ['Luka Ringan', this.yelVotes, yelColor]
                        
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
                    '<hr/>Kasus Kecelakaan: ' + Highcharts.numberFormat(this.sumVotes, 0);
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
                    
                    sumVotes: state.sumVotes
                });
            }
        },
        data: [{
            name: 'Meninggal',
            y: state.grnVotes,
            color: grnColor
        }, {
            name: 'Luka Berat',
            y: state.bluVotes,
            color: bluColor
        }, {
            name: 'Luka Ringan',
            y: state.yelVotes,
            color: yelColor
        
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