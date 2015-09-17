import Metrics from '../models/metrics'

let initialMetrics = [
  {id: '238jd', readableId: 'CO', name: 'cowboys', value: '100/4', guesstimate: {estimate: {median: 100, stdev: 4}}, location: {column: 3, row: 3}},
  {id: 'sd8f', readableId: 'BA', name: 'batmen', value: '1/1', guesstimate: {estimate: {median: 1, stdev: 1}}, location: {column: 1, row: 0}},
  {id: 's18f3', readableId: 'PO', name: 'police', value: '50/3', guesstimate: {estimate: {median: 50, stdev: 3}}, location: {column: 1, row: 2}}
]

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Metrics(state)).add({location: action.location, id: action.id}).state
  case 'REMOVE_METRIC':
    return (new Metrics(state)).remove(action.id).state
  case 'CHANGE_METRIC':
    let values = action.values
    if ('name' in values){
      values.readableId = values.name.substring(0,3).toUpperCase()
    }
    return (new Metrics(state)).update(action.id, values).state
  default:
    return state
  }
}

