chrome.runtime.onInstalled.addListener(() => {
    createContextMenus().catch((err) => console.log(err));
});
chrome.storage.onChanged.addListener(() => {
    createContextMenus().catch((err) => console.log(err));
});
async function createContextMenus() {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "typesaver",
        title: "TypeSaver",
        contexts: ["editable"],
    });
    try {
        const result = await chrome.storage.local.get(["favoriteSnippets"]);
        const favoriteSnippets = result.favoriteSnippets || [];
        if (favoriteSnippets.length > 0) {
            chrome.contextMenus.create({
                id: "favoriteSnippets",
                parentId: "typesaver",
                title: chrome.i18n.getMessage("favoriteSnippetTitle"),
                contexts: ["editable"],
            });
            favoriteSnippets.forEach((snippet) => {
                chrome.contextMenus.create({
                    id: `snippet-favoriteSnippets-${snippet.id}`,
                    parentId: "favoriteSnippets",
                    title: snippet.title,
                    contexts: ["editable"],
                });
            });
        }
    }
    catch (error) {
        console.error("Error creating favorite snippets context menu:", error);
    }
    try {
        const result = await chrome.storage.local.get(null);
        const folders = result.folder ?? [];
        if (!folders.some((f) => f.id === "default")) {
            const hasDefaultSnippets = Object.keys(result).some((key) => {
                const potentialSnippets = result[key];
                if (Array.isArray(potentialSnippets) && potentialSnippets.length > 0) {
                    return potentialSnippets.some((snippet) => snippet && snippet.folder === "default");
                }
                return false;
            });
            if (hasDefaultSnippets) {
                const folderName = chrome.i18n.getMessage("DefaultFolderName") || "Default";
                folders.push({ id: "default", name: folderName });
            }
        }
        for (const folder of folders) {
            const folderIdForStorage = folder.id === "default" || folder.name === "기본폴더"
                ? "default"
                : folder.name;
            const snippetData = await chrome.storage.local.get(folderIdForStorage);
            const snippets = snippetData[folderIdForStorage] ?? [];
            if (folder.name !== "favoriteSnippets") {
                chrome.contextMenus.create({
                    id: `folder-${folder.id}`,
                    parentId: "typesaver",
                    title: folder.name,
                    contexts: ["editable"],
                });
                snippets.forEach((snippet) => {
                    chrome.contextMenus.create({
                        id: `snippet-${folderIdForStorage}-${snippet.id}`,
                        parentId: `folder-${folder.id}`,
                        title: snippet.title,
                        contexts: ["editable"],
                    });
                });
            }
        }
    }
    catch (error) {
        console.error("Error creating context menus:", error);
    }
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const menuItemId = String(info.menuItemId);
    if (menuItemId.startsWith("snippet-")) {
        const [, folderStorageKey, ...snippetParts] = menuItemId.split("-");
        const snippetId = snippetParts.join("-");
        chrome.storage.local.get([folderStorageKey], (result) => {
            const snippets = result[folderStorageKey];
            if (Array.isArray(snippets)) {
                const found = snippets.find((s) => s.id === snippetId);
                if (found && tab?.id) {
                    void chrome.tabs.sendMessage(tab.id, {
                        type: "PASTE_SNIPPET",
                        text: found.text,
                    });
                }
                else {
                    console.warn(`Snippet not found: ${snippetId}`);
                }
            }
            else {
                console.warn(`Snippets array missing for folder: ${folderStorageKey}`);
            }
        });
    }
});
chrome.commands.onCommand.addListener((command, tab) => {
    const match = /^paste-fav-(\d)$/.exec(command);
    if (!match)
        return;
    const index = parseInt(match[1], 10) - 1;
    chrome.storage.local.get("favoriteSnippets", (result) => {
        const favoriteSnippets = result.favoriteSnippets || [];
        if (favoriteSnippets.length <= index) {
            return;
        }
        const snippet = favoriteSnippets[index];
        if (snippet && tab?.id) {
            void chrome.tabs.sendMessage(tab.id, {
                type: "PASTE_SNIPPET",
                text: snippet.text,
            });
        }
        else {
            console.warn(`Snippet not found: ${snippet.id}`);
        }
    });
});
export {};
