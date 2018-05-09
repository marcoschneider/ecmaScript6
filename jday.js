class Drawing{
	
	constructor(config){
		//safe the configs
    this.canvasObject = config.canvasObject;
    this.thickness = config.thickness;
    this.color = config.color;
    this.opacity = config.opacity;
    this.eraseElement = config.eraseElement;
    this.overpaintElement = config.overpaintElement;
    this.setClearListener(config.clearElement);
    this.setResetListener(config.resetElement);
    this.tempArray = [];
	}

  set cursorPosition(config) {
    let boundingClientRect = this.canvasObject.getBoundingClientRect();
    this._cursorPosition = [];
    this._cursorPosition[0] = config.pageX - boundingClientRect.left;
    this._cursorPosition[1] = config.pageY - boundingClientRect.top;
  }

  get cursorPosition() {
    return this._cursorPosition;
  }

  set overpaintElement(config) {
    let overpaintElement = document.getElementById(config);
    if(overpaintElement.localName === 'input'){
      this._overpaintElement = overpaintElement;
      this.overpaintElement.addEventListener('click', () => {
        this.paintOver();
      })
    }
  }

  get overpaintElement() {
    return this._overpaintElement;
  }

  set eraseElement(config) {
    let eraseElement = document.getElementById(config);
    if(eraseElement.localName === 'input'){
      this._eraseElement = eraseElement;
      this.eraseElement.addEventListener('click', () => {
        this.toggleEraser();
      })
    }
  }

  get eraseElement() {
    return this._eraseElement;
  }

  set opacity(config) {
    let opacity = document.getElementById(config);
    if(opacity.localName === 'input'){
      this._opacity = opacity;
    }
  }

  get opacity() {
    return this._opacity;
  }

  set color(config) {
	  let color = document.getElementById(config);
	  if(color.localName === 'input'){
      this._color = color;
    }
  }

  get color() {
    return this._color;
  }

  set thickness(config){
	  let thickness = document.getElementById(config);
    if(thickness.localName === 'input'){
      this._thickness = thickness;
    }
  }

  get thickness(){
	  return this._thickness;
  }

  set isDown(isDown) {
    if(isDown === 0 || isDown === 1){
      this._isDown = isDown;
    }
  }

  get isDown() {
    if(this._isDown){
      return this._isDown;
    }
  }

	set canvasObject(config){
    let canvas = document.getElementById(config);
	  if(canvas.localName === 'canvas'){
	    this._canvasObject = canvas;
      //set event listeners for drawing
      this.setMouseUpListener();
      this.setMouseDownListener();
      this.setMouseMoveListener();
      this.setResizeListener();
      this.sizeCanvas();
      //safe it's surface area
      this.canvasArea = this.canvasObject.getContext("2d");
      this.canvasDimensions = {};
      this.canvasDimensions.height = this.canvasArea.canvas.height;
      this.canvasDimensions.width = this.canvasArea.canvas.width;
      this.savePaths();
    }
  }

	get canvasObject(){
	  return this._canvasObject;
  }

	setResizeListener(){
	  window.addEventListener('resize', () => {
	    this.sizeCanvas();
    })
  }

	setMouseDownListener(){
	  window.addEventListener('mousedown', (event) => {
	    if(this.checkLocation(event.pageX, event.pageY)){
	      this.savePaths();
	      this.isDown = 1;
      }
    });
  }

	setMouseUpListener(){
	  window.addEventListener('mouseup', () => {
	    this.isDown = 0;
    })
  }

	setMouseMoveListener(){
	  this.canvasObject.addEventListener('mousemove', (event) => {
	    this.cursorPosition = event;
	    if(this.isDown === 1){
	      if(this.checkLocation(event.pageX,event.pageY)){
	        this.draw();
        }
      }
    })
  }

  checkLocation(x,y) {
    let isInsideCanvas = true;
    let canvas = this.canvasDimensions;
    // let canvasHeight = this.canvasDimensions.height;
    // let canvasWidth = this.canvasDimensions.width;
    let spaceToBorder = this.canvasObject.getBoundingClientRect();
    if( x <= spaceToBorder.left ||
      x >= (spaceToBorder.left + canvas.width)||
      y <= spaceToBorder.top ||
      y >= (spaceToBorder.top + canvas.height)) {
      isInsideCanvas = false;
    }
    return isInsideCanvas;
  }

  draw() {
	  let color = this.color.value;
	  let opacity = Number(this.opacity.value);
    let fillColor = this.hexToRgb(color, opacity);
    this.canvasArea.beginPath();
    this.canvasArea.fillStyle = fillColor;
    let cursor = {};
    let penThickness = this.thickness.value;
    let point = {};
    let counterClockwise = false;
    cursor.x = this.cursorPosition[0];
    cursor.y = this.cursorPosition[1];
    point.start = 0;
    // 2 * Math.Pi stands for a full circle, 1 * Math.Pi a half circle, etc..
    point.end = 2 * Math.PI;
    // arc function: arc(posX, posY, radius, angleStartingPoint, angleEndPoint, counterclockwise)
    this.canvasArea.arc(cursor.x, cursor.y, penThickness, point.start, point.end, counterClockwise);
    this.canvasArea.fill();
  }

  clearCanvas() {
    this.savePaths();
    this.tempArray.compositeOperation = this.canvasArea.globalCompositeOperation;
    this.canvasArea.globalCompositeOperation = "destination-out";
    this.canvasArea.beginPath();
    this.canvasArea.rect(0, 0, this.canvasArea.canvas.width, this.canvasArea.canvas.height);
    this.canvasArea.fill();
    this.canvasArea.globalCompositeOperation = this.tempArray.compositeOperation;
  }

  toggleEraser() {
	  let drawMode = this.canvasArea.globalCompositeOperation;
    if(drawMode !== "destination-out"){
      this.tempArray.compositeOperation = drawMode;
      drawMode = "destination-out";
      this.eraseElement.classList.add('active-button');
    } else {
      if(drawMode !== this.tempArray.compositeOperation){
        drawMode = this.tempArray.compositeOperation;
      } else {
        drawMode = 'source-over'
      }
      this.eraseElement.classList.remove('active-button');
    }
    this.canvasArea.globalCompositeOperation = drawMode;
  }

  paintOver() {
	  let drawMode = this.canvasArea.globalCompositeOperation;
    if(drawMode !== "source-atop"){
      this.tempArray.compositeOperation = drawMode;
      drawMode = "source-atop";
      this.overpaintElement.classList.add('active-button');
    } else {
      if(drawMode !== this.tempArray.compositeOperation){
        drawMode = this.tempArray.compositeOperation;
      } else {
        drawMode = 'source-over'
      }
      this.overpaintElement.classList.remove('active-button');
    }
    this.canvasArea.globalCompositeOperation = drawMode;
  }

  savePaths() {
    let surfaceData = this.canvasArea.getImageData(0, 0, this.canvasArea.canvas.width, this.canvasArea.canvas.height);
    if(this.drawingSurfaceImageData){
      this.drawingSurfaceImageData.push(surfaceData);
    } else {
      this.drawingSurfaceImageData = [];
      this.drawingSurfaceImageData[0] = surfaceData;
    }
  }

  restorePaths() {
    let surfaceData = this.drawingSurfaceImageData.pop();
    this.canvasArea.putImageData(surfaceData, 0, 0);
  }

  sizeCanvas() {
    let canvasDimensions;
    let wrapperHeight = document.documentElement.clientHeight;
    let wrapperWidth = document.documentElement.clientWidth;
    if(wrapperHeight > wrapperWidth){
      canvasDimensions = wrapperHeight;
    } else {
      canvasDimensions = wrapperWidth;
    }
    // canvas dimensions / 10 * 6 / 2
    canvasDimensions = (canvasDimensions / 100 * 60 / 2);
    this.canvasObject.setAttribute("height", canvasDimensions);
    this.canvasObject.setAttribute("width", canvasDimensions);
  }

  setClearListener(config){
    let clear = document.getElementById(config);
    if(clear){
      clear.addEventListener('click', (event) => {
        this.clearCanvas();
      });
    }
  }

  setResetListener(config){
    let reset = document.getElementById(config);
    if(reset){
      reset.addEventListener('click', (event) => {
        this.restorePaths();
      });
    }
  }

  hexToRgb(hex, opacity) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgba = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: opacity
    };
    result = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    return result;
  }

}



let config = {
  canvasObject: 'char',
  thickness: 'size',
  color: 'color',
  opacity: 'opacity',
  eraseElement: 'eraser',
  overpaintElement: 'paint',
  clearElement: 'clear',
  resetElement: 'back'
};