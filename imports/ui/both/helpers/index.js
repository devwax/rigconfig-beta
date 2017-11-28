import { Meteor } from 'meteor/meteor';

export const truncateText = function truncateText(str = '', length = 23) {
  return str.length > length ? str.substring(0, length - 3) + '...' : str
}

export const formatCurrency = function formatCurrency(n) {
  return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

// http://stackoverflow.com/a/2901298/2480125
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
