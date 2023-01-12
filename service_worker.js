chrome.action.onClicked.addListener((tab) => {
    groupTabsPerchance(true);
});

chrome.tabs.onCreated.addListener((tab) => {
    groupTabsPerchance(false);
});

function groupTabsPerchance(toggle) {
    chrome.storage.local.get(['doGroupTabs'], ({ doGroupTabs }) => {
        if (toggle) {
            doGroupTabs = !doGroupTabs;
        }
        chrome.storage.local.set({ doGroupTabs: doGroupTabs });
        chrome.action.setBadgeText({ text: doGroupTabs ? '' : 'OFF' })
        
        if (doGroupTabs) {
            chrome.tabs.query({ currentWindow: true, pinned: false }, async (tabs) => {
                let tabIds = tabs.map(({ id }) => id);
                let groups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
                
                switch(groups.length) {
                    case 0:
                        let groupId = await chrome.tabs.group({ tabIds: tabIds });
                        await chrome.tabGroups.update(groupId, { title: "JO" });
                        console.log("No tabgroups detected, creating one for all tabs");
                        break;
                    case 1:
                        // tabs.query( tabGroup:tabGroups.TAB_GROUP_ID_NONE 
                        await chrome.tabs.group({ tabIds: tabIds, groupId: groups[0].id });
                        console.log("1 group found, collectinng all tabs in that one...")
                        break;
                    default:
                        console.log("More than 1 group already exists, aborting...");      
                }
            }); 
        }
    });
}

groupTabsPerchance(false);

