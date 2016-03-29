import assign from 'object-assign';
import { Dispatcher } from 'flux';
import { PayloadSources } from '../constants/constants';

const AppDispatcher = assign(new Dispatcher(), {

  handleServerAction: function (action) {
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction: function (action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleRequestAction: function (action) {
    var payload = {
      source: PayloadSources.REQUEST_ACTION,
      action: action
    };
    this.dispatch(payload);
  }
});

export default AppDispatcher;