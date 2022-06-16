import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { HorizontalBar } from 'react-chartjs-2';

const getResponseString = (obj) => {
  const { children } = obj.props;
  if (typeof children !== 'string') {
    return getResponseString(children[1]);
  }
  return children;
};
const BG_COLORS = [
  'rgba(40,53,147,0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(247, 175, 0, 0.65)',
  'rgba(230,74,25,0.8)',
  'rgba(156,39,176,0.8)',
  'rgba(0,77,64,0.95)',
];
const BORDER_COLORS = [
  'rgb(40,53,147)',
  'rgba(54, 162, 235, 1)',
  'rgb(247, 175, 0)',
  'rgb(230,74,25)',
  'rgb(156,39,176)',
  'rgb(0,77,64)',
];
class PollChart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      options: null,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { currentPoll } = nextProps;

    if (!currentPoll) return null;

    const { answers, numRespondents } = currentPoll;

    const options = {
      maintainAspectRatio: false,
      tooltips: { enabled: false },
      legend: { display: false },
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            suggestedMax: 120,
            suggestedMin: 0,
            stepSize: 20,
            beginAtZero: true,
            callback(value, index, values) {
              return value === values[values.length - 1] || value === values[0] ? '' : `${value}%`;
            },
          },
        }],
      },
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value}%`;
          },
          anchor: 'end',
          align: 'right',
        },
      },
    };

    const backgroundColors = [];
    const borderColors = [];
    const datasets = [];
    const labels = [];
    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    // const isOptionsAvailable = answers.length > 2;
    answers.forEach((obj, index) => {
      const pct = Math.round(obj.numVotes / numRespondents * 100);
      // labels.push(optionLabels[index]);
      labels.push(obj.key);
      datasets.push(Number.isNaN(pct) ? 0 : pct);
      if (['yes', 'true'].includes(obj.key.toLowerCase())) {
        backgroundColors.push('rgba(0,116,241,0.8)');
        borderColors.push('rgb(0,116,241)');
      } else if (['no', 'false'].includes(obj.key.toLowerCase())) {
        backgroundColors.push('rgba(247,40,40,0.8)');
        borderColors.push('rgb(247,40,40)');
      } else {
        backgroundColors.push(BG_COLORS[index]);
        borderColors.push(BORDER_COLORS[index]);
      }
    });
    const data = {
      labels,
      datasets: [{
        data: datasets,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    };

    return {
      data,
      options,
    };
  }

  render() {
    const { data, options } = this.state;
    return (
      <div style={{ height: '150px' }}>
        {
          data && (
          <HorizontalBar
            data={data}
            options={options}
          />
          )
        }
      </div>
    );
  }
}

export default injectIntl(PollChart);
