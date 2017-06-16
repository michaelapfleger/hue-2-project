export default function reducer(state = {
  user: {},
  opponent: {},
  over: false,
  term: '',
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
    default: {
      return state;
    }
  }
}
