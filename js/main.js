/** @jsx React.DOM */

var myWorker = new Worker("js/worker.js");

function numCoins(s) {
  return s[0] + s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7];
}

function costCoins(s) {
  return s[0] * 2.0 + s[1] * 1.0 + s[2] + 0.5 + s[3] + 0.2 + s[4] + 0.1 + s[5] + 0.05 + s[6] + 0.02 + s[7] + 0.01;
}

var App = React.createClass({
  getInitialState: function () {
    return {
      targetWeight: 100,
      weight: 0.5,
      sort: 'numCoins',
      solutions: [],
      loading: false,
      init: true
    }
  },

  onTargetWeightChange: function () {
    this.setState({
      targetWeight: Number(this.refs.targetWeight.getDOMNode().value)
    });
  },

  createOnSortChange: function (name) {
    return function (e) {
      this.setState({
        sort: name
      });
    }.bind(this);
  },

  componentDidMount: function () {
    myWorker.addEventListener("message", function (e) {
      if (e.data.type == Type.Progress) {
        this.setState({
          solutions: e.data.solutions,
          numSolutions: e.data.numSolutions
        });
      }
      else if (e.data.type === Type.Result) {
        this.setState({
          loading: false,
          solutions: e.data.solutions,
          numSolutions: e.data.numSolutions
        });
      } else {
        console.log(e.data)
      }
    }.bind(this), false);
  },

  calculate: function () {
    this.setState({
      numSolutions: 0,
      solutions: [],
      loading: true,
      init: false
    });

    myWorker.postMessage({
      targetWeight: this.state.targetWeight,
      sort: this.state.sort,
      weight: this.state.weight
    });
  },

  render: function () {
    var table;
    if (this.state.solutions.length != 0) {
      var rows = this.state.solutions.map(function (solution, i) {
        return (
          <tr key={'col-' + i}>
            <td>{solution[0]}</td>
            <td>{solution[1]}</td>
            <td>{solution[2]}</td>
            <td>{solution[3]}</td>
            <td>{solution[4]}</td>
            <td>{solution[5]}</td>
            <td>{solution[6]}</td>
            <td>{solution[7]}</td>
            <td>{numCoins(solution)}</td>
            <td>{'€ ' + costCoins(solution).toFixed(2)}</td>
          </tr>
          );
      }, this);

      table =
        <div className="row">
          <div className="col-md-8">
            <h3>
              {this.state.numSolutions} possibilities
              {' '}
              <small>Showing 100</small>
            </h3>
            <table className="table">
              <thead>
                <td>
                  <strong>2 Euro</strong>
                </td>
                <td>
                  <strong>1 Euro</strong>
                </td>
                <td>
                  <strong>50 Cent</strong>
                </td>
                <td>
                  <strong>20 Cent</strong>
                </td>
                <td>
                  <strong>10 Cent</strong>
                </td>
                <td>
                  <strong>5 Cent</strong>
                </td>
                <td>
                  <strong>2 Cent</strong>
                </td>
                <td>
                  <strong>1 Cent</strong>
                </td>
                <td>
                  <strong>Number of Coins</strong>
                </td>
                <td>
                  <strong>Cost of Coins</strong>
                </td>
              </thead>
              <tbody>
          {rows}
              </tbody>
            </table>
          </div>
        </div>;
    }

    var calculate;
    if (!this.state.loading) {
      calculate = <a className="btn btn-default" onClick={this.calculate}>Calculate</a>;
    } else {
      calculate = <a className="btn btn-default" disabled="disabled">Calculating...</a>;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h1>How to make a {this.state.targetWeight}g calibration weight using Euro coins</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <form role="form">
              <div className="form-group">
                <label htmlFor="targetWeight">Target Weight</label>
                <div className="input-group">
                  <input ref="targetWeight" type="number" className="form-control" id="targetWeight" value={this.state.targetWeight} onChange={this.onTargetWeightChange} min="0" placeholder="Target Weight"/>
                  <div className="input-group-addon">g</div>
                </div>
              </div>
              <div className="form-group">
                <div className="radio">
                  <label>
                    <input ref="numCoins" type="radio" name="optionsRadios" id="optionsRadios1" value="option1" onChange={this.createOnSortChange('numCoins')} checked={this.state.sort === 'numCoins'} />
                  Minimize number of coins
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input ref="costCoins" type="radio" name="optionsRadios" id="optionsRadios1" value="option1" onChange={this.createOnSortChange('costCoins')} checked={this.state.sort === 'costCoins'} />
                  Minimize cost of coins
                  </label>
                </div>
              </div>
              {calculate}
            </form>
          </div>
        </div>
          {table}
      </div>);
  }
});

React.renderComponent(<App/>, document.body);
