import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower));
};

const humanizeDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeTime = (time) => {
  const hours = Math.floor(time / 60);
  const remainMinutes = time - (hours * 60);
  const minutes = remainMinutes < 10 ? `0${remainMinutes}` : remainMinutes;
  const currentTime = `${hours}h ${minutes}m`;
  return currentTime;
};

export { getRandomInteger, humanizeDate, humanizeTime };
