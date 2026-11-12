import rawCategories from '../../../../data/service-categories.json'
import { parseContent, serviceCategoriesDataSchema } from './schemas'

/** Category pages (`/services/<id>`), keyed by category id. */
export const serviceCategories = parseContent(
  serviceCategoriesDataSchema,
  rawCategories,
  'data/service-categories.json',
).categories

export const serviceCategoryIds = Object.keys(serviceCategories)
