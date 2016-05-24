define('core.event', function () {
    var handlers = {}, isFn = angular.isFunction;
    return {
        addHandler: function (type, handler) {
            if (!isFn(handler)) return;

            var events = handlers[type];

            Array.isArray(events) ? events.push(handler) : handlers[type] = [handler]
        },
        removeHandler: function (type, handler) {
            var events = handlers[type];

            if (!Array.isArray(events) || !events.length) return;

            for (var i = 0, len = events.length; i < len; i++) {
                if (events[i] === handler) {
                    events.splice(i, 1);
                    break;
                }
            }
        },
        trigger: function (type) {
            var events = handlers[type];

            if (!Array.isArray(events) || !events.length) return;

            var args = Array.prototype.slice.call(arguments, 1);

            for (var i = 0, len = events.length; i < len; i++) {
                events[i].apply(this, args);
            }
        },
        on: function () {
            this.addHandler.apply(this, arguments)
        },
        off: function () {
            this.removeHandler.apply(this, arguments)
        }
    }
})