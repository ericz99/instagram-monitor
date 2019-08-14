// # Logger Class
// is responsible for logging the relevant information to the user

// # Import Dependencies
import dateFormat from 'dateformat';
import colors from 'colors';

function getDateString() {
  return '[' + dateFormat(new Date(), 'HH:MM:ss.l') + ']';
}

// export for use elsewhere
export default (type, message) => {
  switch (type) {
    case 'success':
      console.log(`${getDateString()} [${type}] ` + colors.green('[+] ' + message));
      break;
    case 'info':
      console.log(`${getDateString()} [${type}] ` + colors.blue('[$] ' + message));
      break;
    case 'warn':
      console.log(`${getDateString()} [${type}] ` + colors.yellow('[?] ' + message));
      break;
    case 'error':
      console.log(`${getDateString()} [${type}] ` + colors.red('[x] ' + message));
      break;
    default:
      break;
  }
};
