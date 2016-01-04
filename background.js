(function () {

    var urlBlacklist = [
        'chrome://'
    ];

    var local = [];

    function _validUrl(url) {
        if (typeof url === 'undefined') {
            return false;
        }
        return !urlBlacklist.some(function (_url) {
            return (url.match(_url));
        });
    }

    function _handleIconClick(tab) {
        if (_validUrl(tab.url)) {
            _toggleActivity(tab);
        }
    }

    function _toggleActivity(tab) {
        if (_isActive(tab.url)) {
             _deactivate(tab);
             return;
        }
        _activate(tab);
    }

    function _isActive(url) {
        return local[url] === true;
    }

    function _activate(tab) {
        console.log("activate " + tab.url);
        local[tab.url] = true;
        console.log(local);
        _enableIcon();
    }

    function _deactivate(tab) {
        console.log("deactivate " + tab.url);
        delete local[tab.url];
        console.log(local);
        _disableIcon();
    }

    function _activateTitle(tabId) {

    }

    function _deactivateTitle(tabId) {

    }

    function _enableIcon() {
        chrome.browserAction.setIcon({
            "path": "on.png"
        });
    }

    function _disableIcon() {
        chrome.browserAction.setIcon({
            "path": "off.png"
        });
    }

    function _handleTabUpdated(tabId, changeInfo, tab) {
        console.log("handle tab updated event " + tab.url);
        _handleTabEvent(tab);
    }

    function _handleTabEvent(tab) {
        console.log("handle tab event " + tab.url);

        url = tab.url;

        if (typeof url === 'undefined') {
            return;
        }

        if (!_validUrl(url)) {
            _disableIcon();
            return;
        }

        if (!tab.active) {
            return;
        }

        if (_isActive(url)) {
            _activate(tab);
            return;
        }

        _deactivate(tab);

    }

    function _handleTabActivated(activeInfo) {
        console.log("handle tab activated");
        if (typeof activeInfo.tabId != 'number') {
            return;
        }
        chrome.tabs.get(activeInfo.tabId, _handleTabEvent);
    }

    function _handleTabRemoved(tabId, removeInfo) {
        console.log("handle tab removed");
        chrome.tabs.get(tabId, function (tab) {
            delete local[tab.url];
            console.log(local);
        });
    }

    function _addListeners() {
        console.log("add listeners");
        chrome.browserAction.onClicked.addListener(_handleIconClick);
        chrome.tabs.onActivated.addListener(_handleTabActivated);
        chrome.tabs.onCreated.addListener(_handleTabEvent);
        chrome.tabs.onUpdated.addListener(_handleTabUpdated);
    }

    _addListeners();

}) ();
