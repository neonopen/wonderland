// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import SESSION from '../modules/session';
import UTILS from '../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var Secured = {
    componentWillMount: function() {
        var self = this;
        if (SESSION.active() !== true) {
            // "cancel" the rendering of whatever view we're in
            self.render = function () {
                return false;
            };
            // redirect to state config or signin by default
            self.context.router.push(self.state && self.state.noSessionDest ? self.state.noSessionDest : UTILS.DRY_NAV.SIGNIN.URL);
        }
    }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default Secured;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
