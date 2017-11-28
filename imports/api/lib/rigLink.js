import { slugify } from '/imports/api/lib/slugify.js';
// @todo - use "type" for rig categorization as well
export const rigLink = (r, type) => '/rig/' + slugify(r.title) + '-' + r.rigId
