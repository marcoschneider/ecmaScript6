class Key{

  constructor(){}

  generate (){
    return `${this.randomizer()}-${this.randomizer()}-${this.randomizer()}-${this.randomizer()}`;
  }

  randomizer(){
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

}