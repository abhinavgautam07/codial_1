{

  //submit the form data for new post using AJAX
  console.log('Hello');
  let createPost = function () {


    ////////////////important//////////////////////////
    // the strategy is to submit the form via ajax and get somthing in return in form of json and then append this json obejct in our page 
    /////////////////////////////////

    let newPostForm = $("#new-post-form");
    // The submit() method triggers the submit event, or attaches a function to run when a submit event occurs.
    newPostForm.submit(function (event) {

      let formdata = new FormData($("#new-post-form")[0]);
      console.log(formdata);
      event.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: formdata,
        processData: false,
        contentType: false, //this is data we are sending to the server

        // Our success function is where we do things after we get a successful AJAX response,
        success: function (data) { //this is the data which is recieved from the server

          let newPost = newPostDom(data.data.post);

          $("#post-list-container>ul").prepend(newPost);
          DeletePost($(' .delete-post-button', newPost));
          addComment(data.data.post._id);
        new MakeLike($(' .like-post-button', newPost));

        }, error: function (error) {
          console.log(error);
        }
      });
    }
    );

  }
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
  <p>
    <small>
      <a class="delete-post-button" href="/posts/destroy/${post._id}">&times;</a>
    </small> 
   ${post.image ? `<img src="${post.image}" alt="posted-Image" style="height:136px;width:136px">
   <br>` : ``}
      
 
    ${post.content}
    <br>
    ${post.user.name}
  </p>
  

  <div id="likes-container-${post._id}">
    0
  </div>
  likes
  <br>
    <a class="like-post-button" href="/likes/toggle/?id=${ post._id}&Type=Post">
    Like
    </a>
    
 
  <div class="add-posts-comments">
    

    <form action="/comments/create" method="POST" id="post-${post._id}-comment-form">

      <input type="text" name="content" placeholder="add a comment...">
      <!-- the id of the post to which comment is being added needed to be sent -->
      <input type="hidden" name="post" value="${ post._id}">
      <button type="submit">Add comment</button>

    </form>

    
  
  
  </div>
  
  <div class="posts-comments">
    <ul id="post-comments-${post._id}">
  
  </ul>
  </div>
  
    </li>`)
  }


  //method to delete post
  let DeletePost = (deleteLink) => {

    $(deleteLink).click((event) => {
      event.preventDefault();

      $.ajax({
        type: "get",
        //we are sending the id of the  post to be deleted in href using params
        url: $(deleteLink).prop('href'),
        success: function (data) {
          //we will get the id of the post which was deleted in the data,
          $(`#post-${data.data.post_id}`).remove();
          //.reomve is jquery function for removing element from dom
        }, error: function (error) {
          console.log(error.responseText);
        }
      });
    });

  }

  let makepostsAJAX = function () {
    // console.log($('#post-list-container>ul>li'));
    $('#post-list-container>ul>li').each(function () {
      let self = $(this);

      let postId = self.prop('id').split("-")[1];
      addComment(postId);
      makeCommentsAJAX(postId);
      DeletePost($(' .delete-post-button', self));
      new MakeLike($(' .like-post-button', self));
    });
  }

  let likePost = (likeURL) => {
    $(likeURL).click((event) => {
      event.preventDefault();
      $.ajax({
        type: "get",
        url: likeURL.prop('href'),
        success: function (data) {
            
          let deleted=data.data.deleted;
          let postId=data.data.likeable_id;
         let count =parseInt($(`#likes-container-${postId}`).html());
         if(deleted){
           if(count>0){
             count--;
           }
         }else{
           count++;
         }
         $(`#likes-container-${postId}`).html(`${count}`);

        },error:function(err){
          console.log('errr',err);
        }
      });
    })

  }
  createPost();
  makepostsAJAX();
}