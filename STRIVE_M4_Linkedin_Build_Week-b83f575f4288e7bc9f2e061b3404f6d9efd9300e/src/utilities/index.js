export const fetchMessagesThunk = (username) => {
  return (dispatch, getState) => {
    fetch("https://striveschool-test.herokuapp.com/api/messages/" + username, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((respObj) =>
        dispatch({
          type: "FETCH_MESSAGES",
          payload: respObj,
        })
      );
  };
};
