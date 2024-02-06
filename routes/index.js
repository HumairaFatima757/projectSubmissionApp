var express = require("express");
var router = express.Router();
const userModel = require("./users");
const projectModel = require("./project");
const passport = require("passport");
const upload = require("./multer");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile");
});
router.get("/createproject", isLoggedIn, function (req, res, next) {
  res.render("createproject");
});



router.get("/login", function (req, res, next) {
  res.render("login");
});

// router.get("/regiter", function (req, res, next) {
//   res.render("register");
// });

router.get("/admin", function (req, res, next) {
  res.render("admin");
});

router.post("/register", function (req, res, next) {
  const { username, email, password } = req.body;
  const userData = new userModel({ username, email, password });

  userModel
    .register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/allproject");
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/"); // Redirect to home in case of registration failure
    });
});

router.post(
  "/createpro",
  isLoggedIn,
  upload.single("projectimage"),
  async function (req, res, next) {
    const proUser = await userModel.findOne({
      username: req.session.passport.user,
    });
    const proData = await projectModel.create({
      image: req.file.filename,
      projectname: req.body.projectname,
      email: req.body.email,
      projectDetails: req.body.projectDetails,
      URL: req.body.url,
      user: proUser._id,
    });
    proUser.projects.push(proData._id);
    await proUser.save();
    res.redirect("/allproject");
  }
);

router.get('/allproject',isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  const projects = await projectModel.find().populate("user")
    res.render("allproject",{user,projects})
  });




router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  function (req, res) {
    function checkUserRole(req) {
      return req.user && req.user.role === "admin";
    }

    if (checkUserRole(req)) {
      res.redirect("/admin");
    } else {
      res.redirect("/allproject");
    }
  }
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
