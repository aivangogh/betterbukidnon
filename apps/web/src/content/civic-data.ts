import demographicsJson from '../../../../data/demographics.json'
import fiscalJson from '../../../../data/fiscal_transparency.json'
import officialsJson from '../../../../data/officials.json'
import ordinancesJson from '../../../../data/ordinances.json'
import resolutionsJson from '../../../../data/resolutions.json'
import {
  demographicsDataSchema,
  fiscalDataSchema,
  officialsDataSchema,
  ordinancesDataSchema,
  parseContent,
  resolutionsDataSchema,
} from './schemas'

export const demographics = parseContent(
  demographicsDataSchema,
  demographicsJson,
  'data/demographics.json',
)

export const officials = parseContent(officialsDataSchema, officialsJson, 'data/officials.json')

export const ordinances = parseContent(ordinancesDataSchema, ordinancesJson, 'data/ordinances.json')

export const resolutions = parseContent(
  resolutionsDataSchema,
  resolutionsJson,
  'data/resolutions.json',
)

export const fiscalData = parseContent(
  fiscalDataSchema,
  fiscalJson,
  'data/fiscal_transparency.json',
)
