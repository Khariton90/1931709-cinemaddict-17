const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const AUTHORS = ['Ilya O\'Reilly', 'John Doe', 'Back Logan', 'T1000'];
const LAST_FOUR_DIGITS_OF_YEAR = 4;
const FORMAT_DATE = 'DD MMMM YYYY';
const FORMAT_COMMENT = 'DD/MMMM/YYYY HH:mm';
const MINUTES_PER_HOUR = 60;
const TWO_DIGIT_NUMBER = 10;
const CARDS_VIEW_STEPS = 5;

const FilterTypes = {
  ALL: 'All movies',
  FAVORITES: 'Favorites',
  HISTORY: 'History',
  WATCHLIST: 'Watchlist',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN'
};

const UserTitle = {
  NOVICE : [1, 10],
  FAN: [11, 20],
  MOVIE_BUFF: [21, Infinity]
};

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000
};

const Aborting = {
  isDisabled: false,
  isDeleting: false
};

const Disabled = {
  isDisabled: true,
  isDeleting: true
};

export {
  EMOTIONS, AUTHORS, LAST_FOUR_DIGITS_OF_YEAR, FORMAT_DATE, MINUTES_PER_HOUR,
  TWO_DIGIT_NUMBER, CARDS_VIEW_STEPS, FilterTypes, SortType, UserAction, UpdateType,
  FORMAT_COMMENT, Mode, UserTitle, TimeLimit, Aborting, Disabled
};
