

var addComment = function (postId) {
  let newCommentForm = $(`#post-${postId}-comment-form`);
  
  newCommentForm.submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: "post",
      url: "/comments/create",
      data: newCommentForm.serialize(),

      success: function (data) {
        let newComment = newCommentDom(data.data.comment);
        $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
        Deletecomment($(' .delete-comment-button', newComment));

      }, error: function (err) {
        console.log(err.responseText);
      }
    });


  });


}
var Deletecomment = (deleteLink) => {

  $(deleteLink).click((e) => {
    e.preventDefault();
  
    $.ajax({
      type: "get",
      url: deleteLink.prop("href"),
     success: function (data) {
        $(`#comment-${data.data.comment._id}`).remove();
      },error : function(error){
        console.log(error.responseText);
      }
    });
  });
}
//make all comments  ofthe passed postId AJAX type
let makeCommentsAJAX=function(postId){
    $(`#post-comments-${postId}>li`).each(function(){
      let self=$(this);
     
      Deletecomment($(' .delete-comment-button',self));

    });

}
let newCommentDom = function (comment) {
  return $(`<li id="comment-${comment._id}">
 
  <small>
    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">&times;
    </a>
  </small>

  

  ${comment.content}
  <br>
  <small>
    ${comment.user.name}
  </small>

</li>`)

}



