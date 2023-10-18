// ==UserScript==
// @name         YouTubeAdBlockBlockerBypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypasses the adblocker blocker popup.
// @author       NOS
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function insertRawVideo(){
        await sleep(1500);
        var response = await fetch(window.location.href);
        var body = await response.text()
        const myRe = new RegExp('"url":"(https://[^\"]+)"');
        var url = myRe.exec(body)[0].replaceAll('"url":', "").replaceAll('\\u0026', '&').replaceAll('"', "");

        console.log(myRe.exec(body));

        document.getElementsByClassName("style-scope ytd-watch-flexy")[6].innerHTML = `<video class="video-stream html5-main-video" style="display:block" controls>
  <source src=`+ url + ` type="video/mp4">
</video>`;
    }
    const observeUrlChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                insertRawVideo();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    window.onload = observeUrlChange;

    await insertRawVideo();

})();