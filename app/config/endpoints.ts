export default {
  getEvents: {
    uri: '/events',
    method: 'get',
  },
  getWeather: {
    uri: '/weather?location=:location&date=:date',
    method: 'get',
  },
  getEvent: {
    uri: '/events/:id',
    method: 'get',
  },
  deleteEvent: {
    uri: '/events/:id',
    method: 'delete',
  },
  updateEvent: {
    uri: '/events/:id',
    method: 'put',
  },
};