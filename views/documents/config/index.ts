import { do1Config } from './do1.config'
import { do2Config } from './do2.config'
import type { DoConfigMap } from './types'

export const doConfigs: DoConfigMap = {
  do1: do1Config,
  do2: do2Config,
}

export * from './types'
