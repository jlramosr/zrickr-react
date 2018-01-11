//{2134: true, 2135: added} => [{id:2134, state:true}, {id:2135, state:added}]
export const statesObjectToArray = object =>
  (Object.keys(object) || []).map(id => ({id, state:object[id]}))

//[{id:2134, state:true}, {id:2135, state:added}] => {2134: true, 2135: added}
export const statesArrayToObject = array =>
  array.reduce((stateIds, idState) => (
    {...stateIds, [idState.id]: idState.state}
  ), {})