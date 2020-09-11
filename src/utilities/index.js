export const fetchMessagesThunk = (username) => {
  return (dispatch, getState) => {
    fetch(process.env.REACT_APP_API + '/api/profile/messages', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((respObj) =>
        dispatch({
          type: 'FETCH_MESSAGES',
          payload: respObj,
        })
      );
  };
};
