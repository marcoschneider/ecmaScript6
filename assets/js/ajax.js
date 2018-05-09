class Ajax{

  constructor(url){
    this.url = url;
  }

  data(){
    var values = document.getElementById('sampleFile').value;
    console.log(values);
  }

  sendData(){
    let xhr = new XMLHttpRequest();
    document.onreadystatechange
  }

}