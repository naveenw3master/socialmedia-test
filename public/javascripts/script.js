$(function(){
  $('.like_post').click(function(){
    var $this = $(this);
    var post_id = $this.data('id');
    if(post_id){
      $.ajax({
        url: '/posts/like-post',
        type: "POST",
        dataType: "json",
        data: {post_id: post_id},
        success: function(res){
          if(res.status){
            location.reload();
            // $this.removeClass('label-success').addClass('label-default');
            // $this.text('You Liked');
          }
        }
      });
    }
  });
  $('.like_comment').click(function(){
    var $this = $(this);
    var comment_id = $this.data('id');
    if(comment_id){
      $.ajax({
        url: '/posts/like-comment',
        type: "POST",
        dataType: "json",
        data: {comment_id: comment_id},
        success: function(res){
          if(res.status){
            location.reload();
            // $this.removeClass('label-success').addClass('label-default');
            // $this.text('You Liked');
          }
        }
      });
    }
  });

  $('.post-comment-btn').click(function(){
    var $this = $(this);
    $('.post-comment-form').find('input[name="parent_id"]').val($this.data('parentid'));
  });

  $('.post-comment').click(function(){
    var $this = $(this);
    var $form = $this.parents('form');

    if($form.find('textarea[name="message"]').val() == ""){
      alert("Please enter the message!");
      return;
    }

    $.ajax({
      url: $form.attr('action'),
      type: "POST",
      dataType: "json",
      data: $form.serialize(),
      success: function(res){
        if(res.status){
          location.reload();
        }
      }
    });

  });
})
