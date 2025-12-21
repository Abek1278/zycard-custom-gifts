const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ZYC${timestamp.slice(-8)}${random}`;
};

module.exports = { generateOrderNumber };
