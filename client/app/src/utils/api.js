import Rest from './rest-service';
import Actions from '../actions/server-actions';
import _ from 'lodash';

if (!String.prototype.includes) {
  String.prototype.includes = () => String.prototype.indexOf.apply(this, arguments) !== -1;
}

const getJSON = json => {
  if (typeof json === 'string') {
    return JSON.parse(json);
  }
  return json;
};

const API = {
  getEvents: babyIDs => {
    return Rest.get('/api/events/babies/' + babyIDs).then( res => {
      Actions.receiveEvents(getJSON(res.response));
    });
  },

  getFeedings: () => {
    return Rest.get('/api/events/feedings').then( res => {
      Actions.receiveFeedings(getJSON(res.response));
    });
  },

  getBabies: () => {
    return Rest.get('/api/babies').then( res => {
      Actions.receiveBabies(getJSON(res.response));
    });
  },

  findBabies: obj => {
    return Rest.post('/api/babies/search', obj)
      .then( res => {
        if (!_.isEmpty(res.response)) {
          Actions.receiveBabies(getJSON(res.response));
        } else {
          Actions.noBabiesFound();
        }
      })
      .catch( () => {
        Actions.noBabiesFound();
      });
  },

  getFoodTypes: () => {
    return Rest.get('/api/food-types').then( res => {
      Actions.receiveFoodTypes(getJSON(res.response));
    });
  },

  getTimeLogs: babyIDs => {
    return Rest.get('/api/time-logs/babies/' + babyIDs).then( res => {
      Actions.receiveTimeLogs(getJSON(res.response));
    });
  },

  submitEvent: info => {
    return Rest.post('/api/events', info).then( res => {
      Actions.successfulEventPost(getJSON(res.response));
    });
  },

  editEvent: info => {
    return Rest.put('/api/events/' + info._id, info).then( res => {
      Actions.successfulEventEdit(getJSON(res.response));
    });
  },

  clockIn: timeLog => {
    return Rest.post('/api/time-logs', timeLog).then( res => {
      Actions.clockedIn(getJSON(res.response));
    });
  },

  clockOut: (id, timeLog) => {
    return Rest.put('/api/time-logs/' + id, timeLog).then( res => {
      Actions.clockedOut(getJSON(res.response));
    });
  },

  sendInitialConfig: info => {
    return Rest.post('/api/babies/initialize', info).then( res => {
      Actions.receiveBabies(getJSON(res.response));
    });
  }
};

export default API;