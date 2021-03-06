import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'
import * as meActions from 'gModules/me/actions.js'

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

function actionType(action, event) {
  return `${action}_${event}`
}

function errorAction(action, error) {
  return {
      type: actionType(action, 'FAILURE'),
      error
  }
}

function successAction(action, value) {
  return {
      type: actionType(action, 'SUCCESS'),
      value
  }
}

function simpleCallback({dispatch, action}) {
  return (err, value) => {
    if (err) { dispatch(errorAction(action, err)) }
    else if (value) { dispatch(successAction(action, value)) }
  }
}

export function fetchIframe({user_id, plan_id}) {
  return (dispatch, getState) => {
    const action = 'FIRST_SUBSCRIPTION_IFRAME_FETCH'

    dispatch({type: actionType(action, 'START')})
    api(getState()).accounts.get_new_subscription_iframe(
      {user_id, plan_id},
      simpleCallback({dispatch, action})
    )
  }
}

export function postSynchronization({user_id}) {
  return (dispatch, getState) => {
    const action = 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST'

    dispatch({type: actionType(action, 'START')})
    api(getState()).accounts.synchronize({user_id}, (err, value) => {
      if (err) { dispatch(errorAction(action, err)) }
      else if (value) {
        dispatch(successAction(action, value))
        dispatch(meActions.guesstimateMeLoad())
      }
    }
    )
  }
}

export function flowStageReset() {
  return {type: 'FIRST_SUBSCRIPTION_FLOW_RESET'}
}

export function flowStageCancel() {
  return {type: 'FIRST_SUBSCRIPTION_FLOW_CANCEL'}
}
