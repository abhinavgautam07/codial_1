class MakeFriendship{
  constructor(toggler){
    
   this.toggler=toggler;
   console.log($(this.toggler));
   this.toggleFriendship();
  }
  toggleFriendship(){
    $(this.toggler).click(function(event){
      event.preventDefault();
     let self=this;
     
      let to_user=$(self).attr('id').split("-")[1];
      console.log(to_user);
      $.ajax({
        type: "post",
        url:'/friendship/toggle/',
        data: {
          id:to_user
        },
        
        success: function (data) {
          if(data.data.deleted==true){
            $(self).html('Add as friend');
          }else{
            $(self).html('Remove');
          }
        },error:function(err){
          console.log(err);
        }
      });
    });
  }

}

