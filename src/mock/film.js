import { nanoid } from 'nanoid';
import { getRandomInteger } from '../utils';

const films = [
  {
    title: 'Made-for-each-other',
    poster: './images/posters/made-for-each-other.png',
    description: `
    Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
    Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
    `,
    date: '2008-05-11T00:00:00.000Z'
  },
  {
    title: 'Popeye-meets-sinbad',
    poster: './images/posters/popeye-meets-sinbad.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    date: '2019-05-11T00:00:00.000Z'
  },
  {
    title: 'Sagebrush-trail',
    poster: './images/posters/sagebrush-trail.jpg',
    description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    date: '2021-05-11T00:00:00.000Z'
  },
  {
    title: 'Made-for-each-other',
    poster: './images/posters/made-for-each-other.png',
    description: 'Sed sed nisi sed augue convallis suscipit in sed felis.',
    date: '1988-03-11T00:00:00.000Z'
  },
  {
    title: 'Santa-claus-conquers-the-martians',
    poster: './images/posters/santa-claus-conquers-the-martians.jpg',
    description: 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    date: '2008-05-11T00:00:00.000Z'
  },
  {
    title: 'The-dance-of-life',
    poster: './images/posters/the-dance-of-life.jpg',
    description: 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    date: '2011-05-11T00:00:00.000Z'
  },
  {
    title: 'The-great-flamarion',
    poster: './images/posters/the-great-flamarion.jpg',
    description: 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    date: '2010-05-11T00:00:00.000Z'
  },
  {
    title: 'The-man-with-the-golden-arm',
    poster: './images/posters/the-man-with-the-golden-arm.jpg',
    description: `
    Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
    Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
    `,
    date: '2001-05-11T00:00:00.000Z'
  }
];

let rating = 5.3;

const generateFilm = () => {
  const randomIndex = getRandomInteger(0, films.length);

  const generateDescription = () => {
    if (films[randomIndex].description.length > 139) {
      return `${films[randomIndex].description.substring(0, 139)}...`;
    }

    return films[randomIndex].description;
  };

  return ({
    id: nanoid(),
    comments: [1, 2, 3, 4, 5],
    filmInfo: {
      title: films[randomIndex].title.replaceAll('-', ' '),
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: rating++,
      poster: films[randomIndex].poster,
      ageRating: 0,
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano'
      ],
      actors: [
        'Morgan Freeman'
      ],
      release: {
        date: films[randomIndex].date,
        releaseCountry: 'Finland'
      },
      runtime: 77,
      genre: [
        'Comedy'
      ],
      description: generateDescription()
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: true,
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: false
    }
  });
};


export { generateFilm };

