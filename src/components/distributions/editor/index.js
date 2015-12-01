import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, changeGuesstimateForm, saveGuesstimateForm} from 'gModules/guesstimate_form/actions'
import { changeMetricClickMode } from 'gModules/canvas_state/actions'
import $ from 'jquery'
import Icon from 'react-fa'
import DistributionSelector from './distribution-selector.js'
import * as guesstimator from 'lib/guesstimator/index.js'
import TextInput from './text-input.js'
import './style.css'

class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'

  componentWillMount() {
    this._dispatchChange = _.throttle(this._dispatchChange, 300)
  }

  static propTypes = {
    dispatch: PropTypes.func,
    guesstimate: PropTypes.object.isRequired,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    size: PropTypes.bool
  }

  state = {
    userInput: this.props.guesstimate.input || '',
    distributionType: 'NORMAL',
    showDistributionSelector: false
  }

  componentWillMount() {
    const {guesstimate} = this.props
    this.props.dispatch(createGuesstimateForm(guesstimate))

    const guesstimateType = guesstimator.find(guesstimate.guesstimateType)
    if (guesstimateType.isRangeDistribution){
      this.setState({distributionType: guesstimateType.referenceName})
    }
  }

  _guesstimateTypeName() {
    if (this._isRangeDistribution()) { return this.state.distributionType }
    else { return this._inputType().referenceName }
  }

  _guesstimateType() {
    return guesstimator.find(this._guesstimateTypeName())
  }

  _inputType() {
    const inputType = guesstimator.format({text: this.state.userInput}).guesstimateType
    return guesstimator.find(inputType)
  }

  _isRangeDistribution() {
    const type = this._inputType()
    return (!!type.isRangeDistribution)
  }

  _dispatchChange() {
    const {userInput} = this.state;
    const guesstimateType = this._guesstimateTypeName();
    const {metricId} = this.props;
    let newGuesstimateForm = {
      ...this.props.guesstimateForm,
      metric: metricId,
      input: userInput,
      guesstimateType
    }
    this.props.dispatch(changeGuesstimateForm(newGuesstimateForm));

    if (this.state.showDistributionSelector && !this._isRangeDistribution()){
      this.setState({showDistributionSelector: false})
    }

    this.props.dispatch(saveGuesstimateForm());
  }

  _changeDistributionType(distributionType) {
    this.setState({distributionType}, () => {this._dispatchChange()})
    this.setState({showDistributionSelector: false})
  }

  _changeInput(userInput) {
    this.setState({userInput}, () => {
      this._switchMetricClickMode()
      this._dispatchChange()
    })
  }

  _switchMetricClickMode(inClick=true) {
    if (inClick && (this._guesstimateTypeName() === 'FUNCTION')){
      this.props.dispatch(changeMetricClickMode('FUNCTION_INPUT_SELECT'));
    } else {
      this.props.dispatch(changeMetricClickMode(''));
    }
  }

  //right now errors live in the simulation, which is not present here.
  render() {
    const guesstimateType = this._guesstimateType()
    let {showDistributionSelector} = this.state
    let formClasses = 'GuesstimateForm'
    formClasses += (this.props.size === 'large') ? ' large' : ''
    return(
      <div className={formClasses}>
        <div className='row'>
          <div className='col-sm-12'>
            <TextInput
              value={this.props.guesstimateForm.input}
              metricFocus={this.props.metricFocus}
              onChange={this._changeInput.bind(this)}
              onFocus={() => {this._switchMetricClickMode.bind(this)(true)}}
              onBlur={() => {this._switchMetricClickMode.bind(this)(false)}}
            />
            <GuesstimateTypeIcon
              guesstimateType={guesstimateType}
              toggleDistributionSelector={() => {this.setState({showDistributionSelector: !showDistributionSelector})}}
            />
          </div>
        </div>
        {showDistributionSelector &&
          <div className='row'>
            <div className='col-sm-12'>
              <DistributionSelector
                onSubmit={this._changeDistributionType.bind(this)}
                selected={this.state.guesstimateType}
              />
            </div>
          </div>
        }
      </div>)
  }
}

class GuesstimateTypeIcon extends Component{
  displayName: 'GuesstimateTypeIcon'

  _handleMouseDown() {
    if (this.props.guesstimateType.isRangeDistribution){
      this.props.toggleDistributionSelector()
    }
  }

  render() {
    const {guesstimateType} = this.props
    const {isRangeDistribution, icon} = guesstimateType
    const showIcon = guesstimateType && guesstimateType.icon

    let className='DistributionSelectorToggle DistributionIcon'
    className += isRangeDistribution ? ' button' : ''
    if (showIcon) {
      return(
        <div
            className={className}
            onMouseDown={this._handleMouseDown.bind(this)}
        >
          <img src={icon}/>
        </div>
      )
    } else {
      return (false)
    }
  }
}

module.exports = connect(null, null, null, {withRef: true})(GuesstimateForm);
