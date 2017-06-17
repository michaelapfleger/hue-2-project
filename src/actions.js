export function setTimeOver() {
  return {
    type: 'TIME_OVER',
  };
}
export function setConnection() {
  console.log('setconnection');
  return {
    type: 'SET_CONNECTION',
  };
}
export function setTimeStart() {
  return {
    type: 'TIME_START',
  };
}
export function addPoints(points) {
  return {
    type: 'ADD_POINTS',
    payload: points,
  };
}
export function setUser(user) {
  return {
    type: 'SET_USER',
    payload: user,
  };
}
export function setOpponent(user) {
  return {
    type: 'SET_OPPONENT',
    payload: user,
  };
}
export function addPointsToUser(payload) {
  return {
    type: 'ADD_POINTS',
    payload,
  };
}
export function setTerm(term) {
  return {
    type: 'SET_TERM',
    payload: term,
  };
}
export function setSuccess(payload) {
  return {
    type: 'SET_SUCCESS',
    payload,
  };
}

