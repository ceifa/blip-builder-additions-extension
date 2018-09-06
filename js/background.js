chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "download-file"){
        let blob = new Blob([message.content], {type: message.fileType});
        let url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: message.fileName
        });
    }
});