import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Styled from './styles';

Chart.plugins.register(ChartDataLabels);

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
class PollResult extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      options: null,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      currentPoll,
      // intl, pollAnswerIds,
    } = nextProps;

    if (!currentPoll) return null;

    const {
      answers, numResponders,
    } = currentPoll;

    const pollStats = [];
    const question = answers[answers.length-1];//answers.pop();
    const options = {
      maintainAspectRatio: false,
      tooltips: { enabled: false },
      legend: { display: false },
      scales: {
        yAxes: [{
          display: false,
          ticks: {
            suggestedMax: 110,
            suggestedMin: 0,
            beginAtZero: true,
          },
        }],
        xAxes: [{
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            fontStyle: 'bold',
          },
        }],
      },
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value}%`;
          },
          anchor: 'end',
          align: 'end',
          labels: {
            title: {
              font: {
                weight: 'bold',
              },
            },
          },
        },
      },
    };
    const backgroundColors = [];
    const borderColors = [];
    const labels = [];
    const datasets = [];
    // const showLabel = answers.length > 2;
    // const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    // if(answers && answers.length>0){
    //   answers.map((answer,index) => {
    //     optionLabels[index]=answer.key;
    //   });
    // }
    answers.forEach((obj, index) => {
      // const formattedMessageIndex = obj.key.toLowerCase();
      const pct = Math.round(obj.numVotes / numResponders * 100);
      // const pctFormatted = `${Number.isNaN(pct) ? 0 : pct}%`;
      const value = Number.isNaN(pct) ? 0 : pct;
      // labels.push(optionLabels[index]);
      labels.push(obj.key);
      datasets.push(value);
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
      // return pollStats.push(
      //   <div className={styles.main} key={_.uniqueId('stats-')}>
      //     { showLabel ? <div style={{ padding: '0 5px', width: '1.5rem' }}>{labels[index]}</div> : '' }
      //     <div
      //       className={styles.left}
      //       style={{
      //         backgroundColor: backgroundColor[index],
      //         borderColor: borderColor[index],
      //       }}
      //     >
      //       {pctFormatted}
      //     </div>
      //     <div className={styles.right}>
      //       {
      //         pollAnswerIds[formattedMessageIndex]
      //           ? intl.formatMessage(pollAnswerIds[formattedMessageIndex])
      //           : obj.key
      //       }
      //     </div>
      //   </div>,
      // );
    });
    const data = {
      labels,
      datasets: [{
        barPercentage: 0.5,
        data: datasets,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    };
    return {
      data,
      pollStats,
      question,
      options,
    };
  }

  componentWillUnmount() {
    const { resolve } = this.props;
    if (resolve) resolve();
  }

  render() {
    const { closeModal } = this.props;
    const { data, options } = this.state;

    return (
      <Styled.PollModal
        // overlayClassName={styles.overlay}
        onRequestClose={closeModal}
        hideBorder
        shouldShowHeader
        title="Poll Results"
      >
        <div style={{ height: '60vh' }}>
          <Bar
            data={data}
            options={options}
          />
        </div>
      </Styled.PollModal>
    );
  }
}

export default injectIntl(PollResult);

PollResult.defaultProps = { currentPoll: null };

PollResult.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  currentPoll: PropTypes.oneOfType([
    PropTypes.arrayOf(Object),
    PropTypes.shape({
      answers: PropTypes.arrayOf(PropTypes.object),
    }),
  ]),
};
