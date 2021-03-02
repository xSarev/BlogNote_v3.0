$(function () {
	var blogId = $('div#getBlogId').attr('name');
	var currentUser = $('#getCurrentUserName').text();
	var currentUserID = $('#getCurrentUserName').attr('name');
	var socket = io();
	const part_1 = "<a class='avatar'>";
	const part_2 ="</a><div class='content'><a class='author'>";
	const part_3 ="</a><div class='text'>";
	const part_4 = "</div></div></div>";
	$('#submit-comment').click(function(e){
		var newlyCreatedComment ={text: $('textarea#comment-area').val()};
		var obj = {'blogId': blogId, 'currentUser': currentUser, 'currentUserID': currentUserID, 'comment': newlyCreatedComment};
		e.preventDefault(); // prevents page reloading
		socket.emit('submitedComment', obj);
		$('textarea#comment-area').val('');
		return false;
	});
	socket.on('submitedComment', function(msg){
		var postId = $('div#getBlogId').attr('name');
		var poster = (msg.comment.author.gender ==="male") ? "<img src='profile/avatar_male.png'>":"<img src='profile/avatar_female.png'>";
		  if(postId == msg.blogId){
			   $('.comment').append(part_1 + poster + part_2 +  msg.comment.author.username + part_3 + msg.comment.text + part_4);
			   
		  }
	});
});