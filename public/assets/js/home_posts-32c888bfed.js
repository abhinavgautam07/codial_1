{console.log("Hello");let t=function(){$("#new-post-form").submit((function(t){let o=new FormData($("#new-post-form")[0]);console.log(o),t.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:o,processData:!1,contentType:!1,success:function(t){let o=n(t.data.post);$("#post-list-container>ul").prepend(o),e($(" .delete-post-button",o)),addComment(t.data.post._id),new MakeLike($(" .like-post-button",o))},error:function(t){console.log(t)}})}))},n=function(t){return $(`<li id="post-${t._id}">\n  <p>\n    <small>\n      <a class="delete-post-button" href="/posts/destroy/${t._id}">&times;</a>\n    </small> \n   ${t.image?`<img src="${t.image}" alt="posted-Image" style="height:136px;width:136px">\n   <br>`:""}\n      \n \n    ${t.content}\n    <br>\n    ${t.user.name}\n  </p>\n  \n\n  <div id="likes-container-${t._id}">\n    0\n  </div>\n  likes\n  <br>\n    <a class="like-post-button" href="/likes/toggle/?id=${t._id}&Type=Post">\n    Like\n    </a>\n    \n \n  <div class="add-posts-comments">\n    \n\n    <form action="/comments/create" method="POST" id="post-${t._id}-comment-form">\n\n      <input type="text" name="content" placeholder="add a comment...">\n      \x3c!-- the id of the post to which comment is being added needed to be sent --\x3e\n      <input type="hidden" name="post" value="${t._id}">\n      <button type="submit">Add comment</button>\n\n    </form>\n\n    \n  \n  \n  </div>\n  \n  <div class="posts-comments">\n    <ul id="post-comments-${t._id}">\n  \n  </ul>\n  </div>\n  \n    </li>`)},e=t=>{$(t).click(n=>{n.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(t){$(`#post-${t.data.post_id}`).remove()},error:function(t){console.log(t.responseText)}})})},o=function(){$("#post-list-container>ul>li").each((function(){let t=$(this),n=t.prop("id").split("-")[1];addComment(n),makeCommentsAJAX(n),e($(" .delete-post-button",t)),new MakeLike($(" .like-post-button",t))}))};t(),o()}