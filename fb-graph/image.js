// Gets current Facebook Url and returns profile image.

/**
 * Uses facebook graph search to get current URL.
 */

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    // Query chrome's tabs to get the current tab url.
    chrome.tabs.query(queryInfo, function (tabs) {
        if (tabs instanceof Array) {
            if (tabs.length > 0) {
                var tab = tabs[0];
                var url = tab.url;

                console.log("Current tab URL : " + url);

                callback(url);
            }
        }
    })
};


// When chrome window is loaded, execute this function
document.addEventListener('DOMContentLoaded', function () {
    getCurrentTabUrl(function (url) {
        document.getElementById('status').textContent = url;
    });
    var html = document.documentElement.outerHTML;
    document.getElementById('meta-tag').textContent = html;
});

// Gets the background 'source' information and gets URL.
chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        var src = request.source;
        var regexMatch = src.match(/fb:\/\/profile\/\d+/g);
        if (regexMatch !== undefined && regexMatch.length > 0) {
            // get the profile ID:
            var profileId = regexMatch[0].split("fb://profile/")[1];
            message.innerText = profileId;
            if (profileId !== undefined) {
                var photosOf = "https://www.facebook.com/search/" + profileId + "/photos-of";
                var photosTagged = "https://www.facebook.com/search/" + profileId + "/photos-tagged";
                chrome.tabs.create({
                    url: photosOf
                });
                chrome.tabs.create({
                    url: photosTagged
                });
            }
        }
    };
});

function onWindowLoad() {

    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "getPageSource.js"
    }, function () {
        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });

}

window.onload = onWindowLoad;