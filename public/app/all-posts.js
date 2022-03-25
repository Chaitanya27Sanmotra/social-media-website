$(async function() {
    await $.get('/api/posts/', (posts) => {
      for (let p of posts) {
        let date = new Date(`${p.updatedAt}`);
        let time = `${p.updatedAt}`.match(/\d\d:\d\d/);
        let x = p.body.length
        if(x>200){
          $('#posts-container').append(
            $(`
            <div class="col-4 post" style="margin-bottom: 3em;" id="post-${p._id}">
              <div class="card m-2 h-100 border-dark mb-3 post_id" value="${p._id}">
                <div class="card-header">
                  <h5 class="card-title">${p.title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${p.user.username}</h6>
                  <h6 class="card-subtitle mb-2 text-muted">${date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()} ${time} GMT</h6>
                </div>
                <div class="card-body">
                  <p class="card-text">
                    ${p.body.substr(0, 200)} 
                    ...
                    <a href="#" class="rmBtn" id="${p._id}">read more</a>
                  </p>
                </div>
                <div class="card-footer" value="${p._id}">
                    <a href="#" class="card-link comment" id="${p._id}" value="${p._id}">Comment</a>
                    <a href="#" class="card-link">Like</a>
                  </div>
              </div>
            </div>          
            `)
          )
        }
        else {
          $('#posts-container').append(
            $(`
            <div class="col-4 post" style="margin-bottom: 3em;" id="post-${p._id}">
              <div class="card m-2 h-100 border-dark mb-3 post_id" value="${p._id}">
                <div class="card-header">
                  <h4 class="card-title">${p.title}</h5>
                  <h5 class="card-subtitle mb-2 text-muted">${p.user.username}</h6>
                  <h6 class="card-subtitle mb-2 text-muted">${date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()} ${time} GMT</h6>
                </div>
                <div class="card-body"> 
                  <p class="card-text">
                    ${p.body.substr(0, 200)} 
                  </p>
                </div>
                <div class="card-footer" value="${p._id}">
                  <a href="#" class="card-link comment" id="${p._id}" value="${p._id}">Comment</a>
                  <a href="#" class="card-link">Like</a>
                </div>
              </div>
            </div>          
            `)
          )
        }
      }
    })
    $('.rmBtn').click(async function () {
      let pId = this.id
      $(`#posts-container`).empty()
      await $.get('/api/posts/', (posts) => {
        for (let p of posts) {
          let date = new Date(`${p.updatedAt}`);
          let time = `${p.updatedAt}`.match(/\d\d:\d\d/);
          if(p._id==pId) {
            if(p.image) {
              $('#posts-container').append(
                $(`
                <div class="col-14 post" style="margin-bottom: 3em;" id="post-${p._id}">
                  <div class="card m-2 h-100 border-dark mb-3 post_id" value="${p._id}">
                    <div class="card-header">
                    <h4 class="card-title">${p.title}</h4>
                    <h5 class="card-subtitle mb-2 text-muted">${p.user.username}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()} ${time} GMT</h6>
                    </div>
                    <br>
                    <img class="img-top rounded mx-auto d-block img-fluid" src="${p.image}" alt="Card image cap">
                    <div class="card-body">
                      <p class="card-text">
                        ${p.body} 
                      </p>
                    </div>
                    <div class="card-footer" value="${p._id}">
                        <a href="#" class="card-link comment" id="${p._id}" value="${p._id}">Comment</a>
                        <a href="#" class="card-link">Like</a>
                      </div>
                  </div>
                </div>        
              `)
              )
            }
            else {
              $('#posts-container').append(
                $(`
                <div class="col-14 post" style="margin-bottom: 3em;" id="post-${p._id}">
                  <div class="card m-2 h-100 border-dark mb-3 post_id" value="${p._id}">
                    <div class="card-header">
                    <h4 class="card-title">${p.title}</h4>
                    <h5 class="card-subtitle mb-2 text-muted">${p.user.username}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()} ${time} GMT</h6>
                    </div>
                    <div class="card-body">
                      <p class="card-text">
                        ${p.body} 
                      </p>
                    </div>
                    <div class="card-footer" value="${p._id}">
                        <a href="#" class="card-link comment" id="${p._id}" value="${p._id}">Comment</a>
                        <a href="#" class="card-link">Like</a>
                      </div>
                  </div>
                </div>        
              `)
              )
            }
          }
        }
      })
      $('.card-link.comment').click(async function() {
        $(`#posts-container`).empty()
        $('#title').text('Write Comment')
        await $(`#posts-container`).append(
          $(`
          <div class="container my-2">
            <form>
              <div class="mb-3">
                <label class="form-label">Body</label>
                <textarea class="form-control" rows="6" id="textareaBox"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" id="commentBtn">Comment</button>
            </form>
          </div>
          `)
        )
        await $.get(`/api/comments/${id}`, (comments) => {
          if(comments.length>0) {
            for (let c of comments) {
              $(`#posts-container`).append(
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
          }
        })
        $('#commentBtn').click(async function () {
          let textareaBox = $('#textareaBox')
          let user_id = $('#id').text()
          let postid = pId
          let commentBody = textareaBox.val() 
          $.post(
              '/api/comments',
              {
                  post: postid,
                  user: user_id,
                  body: commentBody
              }
          )
          .done(function (data) {
              window.alert("Comment Added!")
          })
          .fail((err) => {
              window.alert("Failed to create Comment!")
          });
        })
      })
      
    })
    $('.card-link.comment').click(async function() {
      console.log('t')
      let id = this.id
      $(`#posts-container`).empty()
      $('#title').text('Write Comment')
      await $(`#posts-container`).append(
        $(`
        <div class="container my-2">
          <form>
            <div class="mb-3">
              <label class="form-label">Body</label>
              <textarea class="form-control" rows="6" id="textareaBox"></textarea >
            </div>
            <button type="submit" class="btn btn-primary" id="commentBtn">Comment</button>
          </form>
        </div>
        `)
      )
      await $.get(`/api/comments/${id}`, (comments) => {
        if(comments.length>0) {
          for (let c of comments) {
            $(`#posts-container`).append(
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
        }
      })
      $('#commentBtn').click(async function () {
        let textareaBox = $('#textareaBox')
        let user_id = $('#id').text()
        let postid = id
        let commentBody = textareaBox.val() 
        $.post(
            '/api/comments',
            {
                post: postid,
                user: user_id,
                body: commentBody
            }
        )
        .done(function (data) {
            window.alert("Comment Added!")
        })
        .fail((err) => {
            window.alert("Failed to create Comment!")
        });
      })
    })
  })
  
  