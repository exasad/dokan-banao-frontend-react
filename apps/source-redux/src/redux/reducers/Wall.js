import {
  CREATE_NEW_POST,
  GET_FEED_POSTS,
  GET_WALL_DATA,
  UPDATE_POST,
} from '@crema/constants/ActionTypes';

const initialState = {
  wallData: null,
  postList: [],
};

const wallReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WALL_DATA:
      return {
        ...state,
        wallData: action.payload,
      };
    case GET_FEED_POSTS: {
      return { ...state, postList: action.payload };
    }

    case CREATE_NEW_POST: {
      return {
        ...state,
        postList: action.payload,
      };
    }

    case UPDATE_POST: {
      return {
        ...state,
        postList: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
export default wallReducer;
