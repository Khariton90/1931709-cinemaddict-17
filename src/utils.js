import dayjs from 'dayjs';
import { FORMAT_DATE, LAST_FOUR_DIGITS_OF_YEAR, MINUTES_PER_HOUR, TWO_DIGIT_NUMBER, FilterTypes } from './consts';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getHumanizeDate = (dueDate) => dayjs(dueDate).format(FORMAT_DATE);

const getCommentTime = (dueDate) => dayjs().from(dayjs(dueDate));

const getHumanizeYear = (date) => {
  const from = date.length - LAST_FOUR_DIGITS_OF_YEAR;
  const to = date.length;

  return date.substring(from, to);
};

const getHumanizeTime = (time) => {
  const hours = Math.floor(time / MINUTES_PER_HOUR);
  const remainMinutes = time - (hours * MINUTES_PER_HOUR);
  const minutes = remainMinutes < TWO_DIGIT_NUMBER ? `0${remainMinutes}` : remainMinutes;
  const currentTime = `${hours}h ${minutes}m`;
  return currentTime;
};

const filter = {
  [FilterTypes.ALL]: (films) => films,
  [FilterTypes.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterTypes.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterTypes.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist)
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index),update,...items.slice(index + 1)];
};


const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortCardRating = (cardA, cardB) => cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;

const sortCardComments = (cardA, cardB) => cardB.comments.length - cardA.comments.length;

const sortCardDate = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.filmInfo.release.date, cardB.filmInfo.release.date);

  return weight ?? dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));
};

const generateDescription = (description) => {
  if (description.length > 139) {
    return `${description.substring(0, 139)}...`;
  }

  return description;
};

export { getHumanizeDate, getHumanizeTime, getHumanizeYear, filter, updateItem, sortCardDate, sortCardRating, getCommentTime, generateDescription, sortCardComments };
