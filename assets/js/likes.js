

class MakeLike {
  constructor(toggler){
    this.toggler=toggler;
    this.toggleLike();
  }

  toggleLike(){
    
    $(this.toggler).click(function(event){
      let self=this;
      event.preventDefault();
      console.log('likes called');
      $(self).prop('href')
      $.ajax({
        type: "get",
        url: $(self).prop('href'),
     
        success: function (data) {
          if(data.data.type=='Post'){
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
          }else{
            let deleted=data.data.deleted;
            let commentId=data.data.likeable_id;
           let count =parseInt($(`#likes-container-${commentId}`).html());
           if(deleted){
             if(count>0){
               count--;
             }
           }else{
             count++;
           }
           $(`#likes-container-${commentId}`).html(`${count}`);
          }
        }
      });
    })

  }

}