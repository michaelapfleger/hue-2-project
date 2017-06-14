export function setTimeOver() {
  return {
    type: 'TIME_OVER',
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
  console.log('setopp', user);
  return {
    type: 'SET_OPPONENT',
    payload: user,
  };
}
