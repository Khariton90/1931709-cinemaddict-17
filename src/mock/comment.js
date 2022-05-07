import { EMOTIONS, AUTHORS } from '../consts';
import { getRandomInteger, humanizeDate } from '../utils';

let commentId = 1;

const generateComment = () => ({
  id: commentId++,
  author: AUTHORS[getRandomInteger(0, AUTHORS.length)],
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: humanizeDate('2019-05-11T16:12:32.554Z'),
  emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length)]
});

export { generateComment };
