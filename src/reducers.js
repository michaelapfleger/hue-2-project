export default function reducer(state = {
  user: {},
  opponent: {},
  over: false,
  success: false,
  term: {},
  structure: [
    '/draw',
    '/mime',
    '/explain',
  ],
  connection: false,
  newOpponent: false,
}, action) {
  switch (action.type) {
    case 'TIME_OVER': {
      return {
        ...state,
        over: true,
      };
    }
    case 'SET_CONNECTION': {
      // console.log('set connection reducer');
      return {
        ...state,
        connection: true,
      };
    }
    case 'SET_NEWOPPONENT': {
      // console.log('set new opp reducer');
      return {
        ...state,
        newOpponent: action.payload,
      };
    }
    case 'TIME_START': {
      return {
        ...state,
        over: false,
      };
    }
    case 'SET_USER': {
      return {
        ...state,
        user: {
          ...action.payload,
        },
      };
    }
    case 'SET_OPPONENT': {
      return {
        ...state,
        opponent: {
          ...action.payload,
        },
      };
    }
    case 'SET_TERM': {
      return {
        ...state,
        term: action.payload,
      };
    }
    case 'ADD_POINTS': {
      return {
        ...state,
        user: {
          ...action.payload,
        },
      };
    }
    case 'SET_SUCCESS': {
      return {
        ...state,
        success: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
