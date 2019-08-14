// # Logger Class
// is responsible for logging the relevant information to the user

// # Import Dependencies
import dateFormat from 'dateformat';
import colors from 'colors';

const Logger = function Logger(name) {
  this._name = name;
};

Logger.prototype.green = function success(message) {
  console.log(`${getDateString()} [${this._name}] ` + colors.green('[+] ' + message));
};

Logger.prototype.red = function error(message) {
  console.log(`${getDateString()} [${this._name}] ` + colors.red('[x] ' + message));
};

Logger.prototype.blue = function won(message) {
  console.log(`${getDateString()} [${this._name}] ` + colors.blue('[$] ' + message));
};

Logger.prototype.normal = function info(message) {
  console.log(`${getDateString()} [${this._name}] [#] ${message}`);
};

Logger.prototype.yellow = function caution(message) {
  console.log(`${getDateString()} [${this._name}] ` + colors.yellow('[?] ' + message));
};

function getDateString() {
  return '[' + dateFormat(new Date(), 'HH:MM:ss.l') + ']';
}

// export for use elsewhere
export default name => {
  return new Logger(name);
};
