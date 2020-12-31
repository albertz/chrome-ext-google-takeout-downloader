// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Copyright 2020 Albert Zeyer.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// https://takeout.google.com/settings/takeout/downloads?...
takeoutUrlRe = new RegExp('https://takeout.google.com/.*');

function getDownloadItemById() {
  var d = {};
  try {
    d = JSON.parse(localStorage.downloadItemById);
  } catch (e) {
    setDownloadItemById(d);
  }
  return d;
}

function setDownloadItemById(d) {
  localStorage.downloadItemById = JSON.stringify(d);
}

function addDownloadItem(item) {
  var d = getDownloadItemById();
  d[item.id] = item;
  setDownloadItemById(d);
}

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

  if (takeoutUrlRe.test(item.url)) {
    console.log("New download:", item);
    addDownloadItem(item);
    suggest(item.filename, 'overwrite');
    return;
  }
});

chrome.downloads.onChanged.addListener(function (delta) {
  if (!delta.state || (delta.state.current != 'complete'))
    return;

  var d = getDownloadItemById();
  if (!(delta.id in d))
    return;
  var item = d[delta.id];

  console.log(delta, delta.id, delta.state.current, item);
});
