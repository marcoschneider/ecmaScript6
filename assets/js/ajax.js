let xhr;

class Ajax{

  constructor(url, id){
    this.url = url;
    this.inputField = document.getElementById('sampleFile');
    this.submit = document.getElementById(id);
    this.addListener();
  }

  validateData(){
    console.log(this.inputField);
  }

  sendData(inputData){
    document.onreadystatechange = function () {
      if(this.readyState === "complete"){
        xhr = new XMLHttpRequest();
        xhr.open('POST', this.url, true);
        xhr.send(JSON.stringify({data: inputData}));
      }
    };

  }

  addListener(){
    let that = this;
    that.submit.addEventListener('click', function () {
      that.sendData(123);
    });
  }

}

let ajax = new Ajax('/upload', 'submit');
ajax.validateData();