export default function reducer(state = {
  user: {},
  over: false,
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
