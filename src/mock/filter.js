import { getFilter } from '../utils';

const filter = getFilter();

const generateLink = (name) => `#${name.toLowerCase().replace('movies', '').trim()}`;

const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    link: generateLink(filterName),
    count: filterFilms(films).length
  })
);

export { generateFilter };
