import { slugify } from '/imports/api/lib/slugify.js';

export const componentLink = (id, type, title) => '/c/' + type.toLowerCase() + '/' + slugify(title) + '-' + id
