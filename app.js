var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	expressSanitizer = require("express-sanitizer");

var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");

const expressSession = require('express-session');
const flash = require("connect-flash");

//CONFIGURATION FOR LIVE COMMENTS
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var User = require("./models/user");
var Blog = require("./models/blog");
var Comment = require("./models/comment");

var postId;

//const PORT = process.env.PORT || 8000;
mongoose.connect('mongodb://localhost/blog_app', {
	useNewUrlParser: true, 
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to database.");
}).catch(err => {
	console.log("Error:", err.message);
});

mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images/'));
app.use(express.static(__dirname + '/bin/'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Just random stuff",
	resave: false,
	saveUninitialized: false
}));

//FLASH-MESSAGES CONFIGURATION
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	app.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.get("/", function(req, res){
	res.redirect("/blogs");
});

//show register form
app.get("/register", function(req, res){
	res.render("register");
});
//landle sign up logic
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username, email: req.body.email, gender: req.body.gender}), req.body.password, function(err, user){
		if(err){
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			//console.log(user.email + " " + user.gender);
			//req.flash("success", "Welcome " + user.username);
			return res.redirect("/blogs");
		});
	});
});
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Database error");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	//get data from form
	var title = req.body.title;
	var image  = req.body.image;
	var body = req.body.body;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newBlog = {title: title, image: image, body: body, author: author};
	//create blog
	Blog.create(newBlog , function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			//then redirect
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, showBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: showBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, showBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: showBlog});
		}
	});
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//LIKES ROUTE
app.get("/blogs/:id/likes", function(req, res){
	 Blog.findById(req.params.id, function(err, theBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            theBlog.likes += 1;
            theBlog.save();
			res.redirect("/blogs");
        }
    });
});

app.delete("/blogs/:id", function(req, res){
	//removeblog
	Blog.findByIdAndRemove(req.params.id, function(err){
			res.redirect("/blogs");
	});
	//redirect
});

//show login form
app.get("/login", function(req, res){
	res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local", {
		successRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout routs
app.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out.");
	res.redirect("/blogs");
});

//RECEIVING DATA
io.on('connection', function(socket){
  socket.on('submitedComment', function(msg){
	//console.log(msg);
	// SAVE DATA TO DB
	// look for specific blog using id
	Blog.findById(msg.blogId, function(err, blog){
		if(err){
			console.log(err);
		} else {
			var pushComment = msg.comment;
			//create new comment
			Comment.create(pushComment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					User.findById(msg.currentUserID, function(err, user){
						if(err){
							console.log(err);
						} else {
							comment.author.id = msg.currentUserID;
							comment.author.username = msg.currentUser;
							comment.author.gender = user.gender;
							//save comment
							comment.save();
							var message = {'comment':comment, 'blogId':msg.blogId};
							io.emit('submitedComment', message);
							//connect new comment to blog
							blog.comments.push(comment);
							blog.save();
						}
					});
				}
			});
		}
	});
  });
});

http.listen(3000, function(){
	console.log("Server has started");
});