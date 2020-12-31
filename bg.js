// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Copyright 2020 Albert Zeyer.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// https://takeout.google.com/settings/takeout/downloads?...
takeoutUrlRe = /https:\/\/takeout.google.com\/.*/;
takeoutFilenameRe = /.*-([0-9]+)\.(zip|mp4)/;
port = {};

chrome.runtime.onConnect.addListener(function(__port) {
  console.log("New backend connection");
  console.assert(__port.name == "backup-google-takeout", [__port, port]);
  port.port = __port;
});

chrome.downloads.onDeterminingFilename.addListener(function (item, __suggest) {
  function suggest(filename, conflictAction) {
    __suggest({
      filename: filename,
      conflictAction: conflictAction,
      conflict_action: conflictAction
    });
    // conflict_action was renamed to conflictAction in
    // https://chromium.googlesource.com/chromium/src/+/f1d784d6938b8fe8e0d257e41b26341992c2552c
    // which was first picked up in branch 1580.
  }

  if (!takeoutUrlRe.test(item.url))
    return;

  console.log("New download:", item.filename);
  suggest(item.filename, 'overwrite');
});

chrome.downloads.onChanged.addListener(function (delta) {
  if (!delta.state || (delta.state.current != 'complete'))
    return;

  chrome.downloads.search({id: delta.id}, function(results) {
    console.assert(results.length == 1, [results, delta]);
    var item = results[0];
    if (!takeoutUrlRe.test(item.url))
      return

    console.assert(takeoutFilenameRe.test(item.filename), item);
    var m = item.filename.match(takeoutFilenameRe);
    var partNr = parseInt(m[1], 10);

    console.log("Completed download:", item.filename, partNr);

    nextDownload(partNr + 1);
  });
});

function nextDownload(partNr) {
  console.log("next download:", partNr);
  port.port.postMessage({name: "nextDownload", partNr: partNr});
}
