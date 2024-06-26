console.log('errorHandler.js execution started...');
const errorHandler = (err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  };
  
  export default errorHandler;
  