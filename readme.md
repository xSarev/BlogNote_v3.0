# Blog Note v3.0

This repository contains a Blog project written with node.js. Some features includes persistant data with mongoDB, using passport.js library that support a comprehensive set of strategies for authentication now users can register on site. Posts are mapped to specfic user that created them, and only that user can change, delete specific post. Also using socket.io that enables real-time, bidirectional and event-based communication, users now can write comment for a post, it will be immediately post and saved to database.

Styling done using semantic.ui

## Requirements

1. Node.js
2. npm
3. MongoDB

Linux based OS:
```bash
sudo apt install nodejs npm
```
Windows:
[NodeJS](https://nodejs.org/en/download/)

[MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## Initial setup

Run mondodb in background
Navigate to project root and run

```bash
npm install
```

## Run website 

```bash
node app.js
```

### Update libaries

```bash 
npm install <libraryName>@<versio> --save
```
