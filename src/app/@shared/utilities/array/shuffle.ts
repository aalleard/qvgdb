export class Shuffling {
  public static shuffle(aArray: any[]) {
    for (let i = aArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [aArray[i], aArray[j]] = [aArray[j], aArray[i]];
    }
  }
}
