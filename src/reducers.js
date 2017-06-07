export default function reducer(state = {
  user: null,
  over: false,
}, action) {
  switch (action.type) {
    case 'TIME_OVER': {
      return {
        ...state,
        over: true,
      };
    }
    default: {
      return state;
    }
  }
}
