import math from 'mathjs';
import {Sample} from './Sampler.js'
import {jStat} from 'jstat'

export var Sampler = {
  sample({hits, total}, n) {
    // This treats your entry as a prior, and assumes you are 2 times more confident than
    // a raw beta would be. This gives your distribution more of a peak for small numbers.
    return { values: Sample(n, () => jStat.beta.sample(2*hits, 2*(total-hits))) }
  }
}
