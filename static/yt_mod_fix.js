//-------------------------------------------------------------------------
//
// NOTE: If you can read this you're hopefully smart enought to not annoy
//       other persons in a childish manner.
//
//-------------------------------------------------------------------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insecure_setupPermissions() {
    var overflowmenu = document.querySelector("#new-toolbox > div.toolbox-content > div.button-group-right > div.toolbox-button-wth-dialog > div > div:nth-child(1) > div > div") // I know, I know

    if (overflowmenu) {
        overflowmenu.onclick = async function(event) {
            // console.log('clicked');
            var list = document.getElementsByClassName("overflow-menu-item");
            // console.log(list);

            // Dev1: We have a problem here, maybe we need to wait a few ms or we need to set a listener that waits for this menu to expand or be created? Any Ideas?
            // Dev2: I have an idea, but I don't like it :D Hold my beer...
            await sleep(60);

            for (let item of list) {
                // console.log(item); console.log('item');
                if (item.getAttribute('aria-label').includes('YouTube') &&
                    !localStorage.sessionId )
                {
                    // localStorage.sessionId is my workaround as a moderator check. an alternative would be to look
                    //if your own thumbnail contains a moderator star. I know this is all hacky but  afaik we can't update the react native code?
                    item.remove()
                }
            }
        }
    }
}

// Execute regularly - sooo dirtyy, I know
setInterval(insecure_setupPermissions, 3000);
