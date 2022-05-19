import dayjs from 'dayjs';
import { FORMAT_DATE, LAST_FOUR_DIGITS_OF_YEAR, MINUTES_PER_HOUR, TWO_DIGIT_NUMBER, FilterTypes } from './consts';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower));
};

const getHumanizeDate = (dueDate) => dayjs(dueDate).format(FORMAT_DATE);

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

const getFilter = () => ({
  [FilterTypes.ALL]: (films) => films,
  [FilterTypes.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterTypes.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterTypes.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist)
});

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index),update,...items.slice(index + 1)];
};

export { getRandomInteger, getHumanizeDate, getHumanizeTime, getHumanizeYear, getFilter, updateItem };
