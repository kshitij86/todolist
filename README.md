
### Simple Todo List 



## Backend - NodeJs, Mysql, JWT

Install all package `npm i`   

Run `npm run dev`

You can create schema  todo and two tables -- tasks , users in mysql workbench.
Run given queries

  // CREATE TABLE users
  // ( id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  //   name varchar(25) NOT NULL,
  //	email varchar(25) NOT NULL,
  //   password varchar(128) NOT NULL;
  //   );


// CREATE TABLE tasks
// ( id int PRIMARY KEY,
//   name varchar(25) NOT NULL,
//   status varchar(30) NOT NULL,
//   user_id int,
//   FOREIGN KEY (user_id) REFERENCES users(id)
//   );

Register user   --  
  {
    "name" : "relevel",
    "email" : "relevel@gmail.com",
    "password":"12345678"

}
Login and verify token 
Then create the to-do list.
In todo list you can insert tasks, view tasks, edit tasks , check status of task .

