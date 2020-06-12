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
          "numberPrefix"
        }
      }
    }
  }
}
