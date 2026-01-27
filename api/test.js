module.exports = (req, res) => {
  res.json({ hello: 'world', time: new Date().toISOString() });
};
