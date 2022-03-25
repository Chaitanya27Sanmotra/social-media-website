let username = $(`#username`)
let pic = $('#pic')
$(() => {
  $('#navbar').load('/components/navbar.html', user)
  $('#footer').load('/components/footer.html')
  $('#content').load('/components/all-posts.html') // this contains it's own scripts too
})

function user() {
  $('#nav-username').text(username.text())
  $('#nav-pic').attr("src", pic.text())
}
  