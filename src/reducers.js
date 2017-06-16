export default function reducer(state = {
  user: {},
  opponent: {},
  over: false,
  started: false,
  term: {},
  structure: [
    '/draw',
    '/mime',
    '/explain',
  ],
}, action) {
  switch (action.type) {
    case 'TIME_OVER': {
      return {
        ...state,
        over: true,
        started: false,
      };
    }
    case 'TIME_START': {
      return {
        ...state,
        over: false,
        started: true,
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
    default: {
      return state;
    }
  }
}
