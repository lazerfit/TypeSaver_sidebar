import type { Folder } from "../src/popup/components/Folder";
import type { Snippet } from "../src/popup/components/Home";

chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

chrome.storage.onChanged.addListener(() => {
  createContextMenus();
});

function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "typesaver",
      title: "TypeSaver",
      contexts: ["editable"],
    });

    chrome.storage.local.get(null, (result) => {
      const folders = (result.folder as Folder[]) ?? [];

      if (!folders.some((f) => f.name === "default")) {
        Object.keys(result).forEach((key) => {
          if (Array.isArray(result[key])) {
            const snippets = result[key] as Snippet[];
            if (snippets.length && snippets[0].folder === "default") {
              folders.push({ id: "default", name: "default" } as Folder);
            }
          }
        });
      }

      folders.forEach((folder) => {
        chrome.contextMenus.create({
          id: `folder-${folder.id}`,
          parentId: "typesaver",
          title: folder.name,
          contexts: ["editable"],
        });

        chrome.storage.local.get([folder.name], (res) => {
          const snippets = (res[folder.name] as Snippet[]) ?? [];
          snippets.forEach((snippet) => {
            chrome.contextMenus.create({
              id: `snippet-${snippet.id}`,
              parentId: `folder-${folder.id}`,
              title: snippet.title,
              contexts: ["editable"],
            });
          });
        });
      });
    });
  });
}

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    const menuItemId = String(info.menuItemId);
    if (menuItemId.startsWith("snippet-")) {
      const snippetId = menuItemId.replace("snippet-", "");
      chrome.storage.local.get(null, (result: Record<string, unknown>) => {
        let found: Snippet | null = null;
        Object.values(result).forEach((snippets) => {
          if (Array.isArray(snippets)) {
            (snippets as Snippet[]).forEach((s) => {
              if (s.id === snippetId) found = s;
            });
          }
        });
        if (found && tab?.id) {
          void chrome.tabs.sendMessage(tab.id, {
            type: "PASTE_SNIPPET",
            text: (found as Snippet).text,
          });
        }
      });
    }
  },
);
