import React from 'react';
import PriceCard from './PriceCard';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

class Body extends React.Component{
    constructor(props){
        super(props);
        this.BASE_URL = 'https://api.cryptonator.com/api/ticker/';
        this.chartRef = null;
        this.state = {
            btcgbp: '-',
            ltcgbp: '-',
            ethgbp: '-',
            showChart: false,
            initValue: 0,
            dataSource : {
                "chart": {
                    "caption": "Bitcoin Ticker",
                    "subCaption": "",
                    "xAxisName": "Local Time",
                    "yAxisName": "GBP",
                    "numberPrefix": "£",
                    "refreshinterval": "2",
                    "slantLabels": "1",
                    "numdisplaysets": "10",
                    "labeldisplay": "rotate",
                    "showValues": "0",
                    "showRealTimeValue": "0",
                    "theme": "fusion"
                },
                "categories": [{
                    "category": [{
                        "label": this.clientDateTime().toString()
                    }]
                }],
                "dataset": [{
                    "data": [{
                        "value": 0
                    }]
                }]
            }
        };
        this.chartConfigs = {
            type: 'realtimeline',
            renderAt: 'container',
            width: '100%',
            height: '350',
            dataFormat: 'json'
        };
    }

    componentDidMount() {
        this.getDataFor('btc-gbp', 'btcgbp');
        this.getDataFor('ltc-gbp', 'ltcgbp');
        this.getDataFor('eth-gbp', 'ethgbp');
    }

    startUpdatingData(){
        setInterval(() => {
            fetch(this.BASE_URL + 'btc-gbp')
            .then(res => res.json())
            .then(d => {
                let x_axis = this.clientDateTime();
                let y_axis = d.ticker.price;
                this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
            });
        }, 2000);
    }


    getDataFor(conversion, prop){
        fetch(this.BASE_URL + conversion, {
            mode: 'cors'
        })
        .then(res => res.json())
        .then(d => {
            if(prop === 'btcgbp'){
                const dataSource = this.state.dataSource;
                dataSource.chart.yAxisMaxValue =  parseInt(d.ticker.price) + 5;
                dataSource.chart.yAxisMinValue =  parseInt(d.ticker.price) - 5;
                dataSource.dataset[0]['data'][0].value = d.ticker.price;
                this.setState({
                    showChart: true,
                    dataSource: dataSource,
                    initValue: d.ticker.price
                }, ()=>{

                    this.startUpdatingData();
                })
            }

            this.setState({
                [prop]: d.ticker.price
            });
        })

    }

    static addLeadingZero(num) {
        return (num <= 9) ? ("0" + num) : num;
    }


    clientDateTime() {
        var date_time = new Date();
        var curr_hour = date_time.getHours();
        var zero_added_curr_hour = Body.addLeadingZero(curr_hour);
        var curr_min = date_time.getMinutes();
        var curr_sec = date_time.getSeconds();
        var curr_time = zero_added_curr_hour + ':' + curr_min + ':' + curr_sec;
        return curr_time
    }

    getChartRef(chart){
        this.chartRef = chart;


    }


    render(){
        return (
        <div className="row mt-5 mt-xs-4">
            <div className="col-12 mb-3">
                 <div className="card-deck custom-card-deck">
                    <PriceCard header="Bitcoin(BTC)" src={'/bitcoin.png'} alt="fireSpot" label="(Price in GBP)"   value={this.state.btcgbp} />
                    <PriceCard header="Litecoin(LTC)"   src={'/litecoin.png'} alt="fireSpot" label="(Price in GBP)"  value={this.state.ltcgbp}/>
                    <PriceCard header="Ethereum(ETH)" src={'/ethereum.png'} alt="fireSpot" label="(Price in GBP)"    value={this.state.ethgbp}/>




                 </div>
            </div>
            <div className="col-12">
                <div className="card custom-card mb-5 mb-xs-4">
                   <div className="card-body">
                            {
                            this.state.showChart ?
                            <ReactFC
                            {...this.chartConfigs}
                            dataSource={this.state.dataSource}
                            onRender={this.getChartRef.bind(this)}/>: null
                        }
                   </div>
                </div>
            </div>
		</div>
        )
    }
}

 export default Body;
