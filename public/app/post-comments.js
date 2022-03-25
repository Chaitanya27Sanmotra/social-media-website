$(function() {
    console.log('k')
    $.get(`/api/comments/60d9fc28f234b90be8260859`, (comments) => {
      for (let c of comments) {
        $(`#post-comments`).append(
          $(`
          <div class="col-4" style="margin-bottom: 3em;">
            <div class="card m-2 h-100 border-dark mb-3">
              <div class="card-header">
                <h5 class="card-title">${c.user.username}</h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  ${c.body.substr(0, 200)} 
                </p>
              </div>
              <div class="card-footer">
                  <a href="#" class="card-link">Like</a>
                </div>
            </div>
          </div>          
          `)
        )
      }
    })
  }
)