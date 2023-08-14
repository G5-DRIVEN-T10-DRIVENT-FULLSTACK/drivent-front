import api from './api';

export async function getDailyActivity(date, token) {
  try {
    const response = await api.get(`/activities/day/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e) {
    return console.log(e.message);
  }
}

export async function getCurrentCap(id, token) {
  try {
    const response = await api.get(`/activities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e) {
    return console.log(e.message);
  }
}

export async function postActivity(id, token) {
  console.log(token);
  try {
    const response = await api.post(
      `/activities/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (e) {
    // return console.log(e.message);
    throw new Error(e);
  }
}
