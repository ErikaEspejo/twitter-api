const logger = (req, res, next) => {
  const datetime = (new Date).toLocaleString();
  const { ip = '', method = '', path = '', hostname = '' } = req;
  console.log(`${datetime} :: ${method} :: ${path} :: ${hostname} :: ${ip}`)
  next();
};

module.exports = { logger };
