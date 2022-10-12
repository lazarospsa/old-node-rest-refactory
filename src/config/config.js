const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
  },
  default: {
    SECRET: "mysecretkey",
    DATABASE: "mongodb://root:r00t@mongo:27017/test-database",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
