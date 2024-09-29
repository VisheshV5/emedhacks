const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user/:userId", controller.findById);
  app.get("/api/users", controller.getAll);

  app.post("/api/user/create/:userId", controller.createPreferences);
  app.post("/api/user/check/:userId", controller.checkSymptoms);
};
