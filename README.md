https://takeout.google.com/settings/takeout/downloads

Automate the downloading...
E.g. one export results in 358 packages (files) for me.
I don't want to click each download one by one.

https://superuser.com/questions/716756/how-to-automate-regular-google-takeout-backups-to-cloud-storage

My first Chrome Extension.
Some docs:

https://developer.chrome.com/docs/extensions/reference/
https://developer.chrome.com/docs/extensions/mv2/getstarted/
https://www.sitepoint.com/create-chrome-extension-10-minutes-flat/
https://developer.chrome.com/docs/extensions/reference/downloads/
https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/downloads/download_filename_controller/

Problem: Chrome will show save-as dialog always when Chrome is configured this way
("Ask where to save each file before downloading", `PromptForDownload` option).
See [here](https://stackoverflow.com/questions/20925222/how-to-force-chrome-to-not-open-saveas-dialog-when-downloading-a-url).
Overwriting `saveAs` does not resolve this (see [here](https://bugs.chromium.org/p/chromium/issues/detail?id=417112)),
and this is an open feature request (see [here](https://bugs.chromium.org/p/chromium/issues/detail?id=1012874)),
which is not clear if this will ever be implemented.
