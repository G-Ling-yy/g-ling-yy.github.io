class Slider {
  constructor(sliders,time){
    this.sliders = sliders;
    this.time = time || 1000;
    this.loop();
  }

  running(){
    this.sliders.map((item,i,arry)=>{
      setTimeout(()=>{
        if (i === 0) {
          item.style.opacity = '1';
          arry[arry.length-1].style.opacity = '0';
        }else {
          item.style.opacity = '1';
          arry[i-1].style.opacity = '0';
        }
      },i*this.time);
    });
    return this.running;
  }

  loop(){
    setInterval(this.running().bind(this),this.sliders.length*this.time);
  }
}