// Open navigation bar elements with AJAX

extractParts = function(responseText) {
  if (!$('_extractor')) $(document.body).insert({ bottom: "<div id='_extractor' style='display:none'></div>" })
  var extractor = $('_extractor')
  extractor.insert({ top: responseText })
  var response = {
    body_classes: extractor.down(".body_classes").innerHTML,
    content: extractor.down(".content_part"),
    column: extractor.down(".column_part")
  }
  return response
}

// Load navigation elements on main view using AJAX
document.on('click', '.nav_links a.ajax', function(e,a) {
  if (e.isMiddleClick()) return
  e.stop()
  new Ajax.Request(a.readAttribute('href')+"?nolayout=1", {
    method: "get",
    onLoading: function(r) { Loading.show() },
    onComplete: function(r) { Loading.hide() },
    onSuccess: function(r) {
      // Mark the new element as selected
      NavigationBar.selectElement(a.up('.el'))

      // Insert the content, and update posted dates if necessary
      var parts = extractParts(r.responseText)

      document.body.className = parts.body_classes
      $('content').update(parts.content)
      $$('.view_sidebar').first().update(parts.column)
      format_posted_date()

      // Display the AJAX route in the navigation bar
      pushHistoryState(a.readAttribute('href'))
    },
    onFailure: function(r) {
      alert("Error while loading the page. Please try reloading the page.")
    }
  })
})