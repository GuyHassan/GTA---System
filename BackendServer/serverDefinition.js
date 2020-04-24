
const { getProfession, addStudentToClassroom, getStudentsNamesAsObject, checkUsernamePassword, addUsers, existInDB, getClassrooms, addClassrooms } = require("./firebaseDefinition");
const PORT = process.env.PORT || 3005;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Website you wish to allow to connect need to add here the github root to the website !!!
app.use(function (req, res, next) {
  const allowedOrigins = [
    "http://localhost:3000"//,"github"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// create a login request and check if the user exist
app.post('/loginRequest', (req, res) => {
  const userDetails = req.body;
  checkUsernamePassword(userDetails).then((response) => {
    if (response === null) {
      res.status("404").send("Login Error");
      return;
    }
    res.send(response);
  });
});


pathPermission = ["/LecturerView/StudentPermissions", '/AdminPermission'];
//new user to the DB 
app.post(pathPermission, (req, res) => {
  const userDetails = { ...req.body, path: req.url };
  existInDB("users", userDetails.username).then((response) => {
    //if the path is exist so the username is taken
    if (response === true) {
      res.status("404").send("The Username Is Used");
      return;
    }
    addUsers(userDetails);
    console.log("The User Is Added To The DB");
    res.send(response);
  });
});

//get class for specific lecturer : NEED lecturerName , RETURN : classesList!!
app.get("/getClasses/:username/:professionName", (req, res) => {
  const { username, professionName } = req.params;
  getClassrooms(username, professionName).then(classesList => {
    res.send(classesList);
  });
});

app.get("/getProfession/:username/:isLecturer", (req, res) => {
  const { username, isLecturer } = req.params;
  getProfession(username, (isLecturer === 'true')).then(professionList => {
    res.send(professionList);
  });
});

//add class for the lecturer : NEED {lecturerName,className,professionName,description} , RETURN new classroomList !!!
//choose another URL name !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/LecturerView/createClassroom", (req, res) => {
  const classDetails = req.body;
  getClassrooms(classDetails.lecturerName, classDetails.professionName).then((classesList) => {
    //if the path is exist so the classroom is used\
    if (classesList !== null && classDetails.className in classesList) {
      res.status("404").send("you have this Classroom in your list");
      return;
    }
    addClassrooms(classDetails);
    console.log("The class Is Added To The DB");

    //res.send(classesObj.push(classDetails.professionName));
  });
});

//get list of students to add to the class : NEED {professionName} ,RETURN studentList{username:studentName} THAT NOT EXIST IN THIS CLASS!! 
app.get("/getStudentsForAddToClass/:professionName/:className", (req, res) => {
  const { professionName, className } = req.params;
  getStudentsNamesAsObject(professionName, className, false).then(studentsName => {
    res.send(studentsName);
  });
});

//add list of students to given class : NEED {lecturerName,professionName,{studentsNames}} ,RETURN None
//choose another URL name !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/LecturerView/addStudentsToClass", (req, res) => {
  addStudentToClassroom(req.body);
  res.send("the student's are added to the class");
});


//get list of students that inside the class : NEED {professionName} ,RETURN studentList THAT IN THIS CLASS!! 
app.get("/getStudentsClass", (req, res) => {
  const { professionName, className } = req.query;
  getStudentsNamesAsObject(professionName, className, true).then(studentsName => {
    res.send(studentsName);
  });
});















// inital the server in default PORT (3005)
app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}!`)
);