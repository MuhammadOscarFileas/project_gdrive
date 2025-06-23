import { User } from './users_model.js';
import { File } from './files_model.js';

// Panggil method associate untuk masing-masing model
if (typeof User.associate === 'function') {
  User.associate({ File });
}

if (typeof File.associate === 'function') {
  File.associate({ User });
}
