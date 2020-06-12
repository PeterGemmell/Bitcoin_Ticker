import React from 'react';
import PriceCard from './PriceCard';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts'
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);


class Body extends Component {
  constructor(props){
    super(props);
    this.BASE_URL = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';
    this.chartRef = null;
    this.state = {
      btcgbp: '-',
      ethgbp: '-',
      xrpgbp: '-',
      showChart: false,
      initValue: 0,
      dataSource: {
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

  componentDidMount(){
    this.getDataFor('btc-gbp', 'btcgbp');
    this.getDataFor('eth-gbp', 'ethgbp');
    this.getDataFor('xrp-gbp', 'xrpgbp');
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
        dataSource.chart.yAxisMaxValue = parseInt(d.ticker.price) + 5;
        dataSource.chart.yAxisMinValue = parseInt(d.ticker.price) - 5;
        dataSource.dataset[0]['data'][0].value = d.ticker.price;
        this.setState({
          showChart: true,
          dataSource: dataSource,
          initValue: d.ticker.price
        }, () => {

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


  clientDateTime(){
    var date_time = new Date();
    var curr_hour = date_time.getHours();
    var zero_added_curr_hour = Body.addLeadingZero(curr_hour);
    var curr_min = date_time.getMinutes();
  }
}
