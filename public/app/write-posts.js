$(function() {
    let formData = new FormData()
    let titleBox = $('#titleBox')
    let textareaBox = $('#textareaBox')
    let postBtn = $('#postBtn')
    postBtn.click(function(event) {
        event.preventDefault()
        let user_id = $('#id').text()
        let postTitle = titleBox.val()
        let postBody = textareaBox.val()
        let file = $('#file')[0].files[0]
        formData.append("user", user_id);
        formData.append("title", postTitle);
        formData.append("body", postBody);
        formData.append('file', file)
        $.ajax({
            type: "POST",
            url: "/api/posts",
            data: formData,
            processData: false,
            contentType: false,
            success: function(r){
                window.alert("Post Created!")
            },
            error: function (e) {
                window.alert("Post creation failed!")
            }
        });
    })
})