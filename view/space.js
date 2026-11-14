(function(){
    var canvas=document.getElementById('space-canvas');
    if(!canvas)return;
    var ctx=canvas.getContext('2d');
    var w,h,cx,cy;
    var stars=[];
    var nebulaParticles=[];
    var smallStars=[];
    var NUM_STARS=250;
    var NUM_NEBULA=400;
    var rotation=0;
    var nebulaRotationSpeed=0;
    var globalTimer=0;
    var CYCLE_DURATION=12;
    function resize(){
        w=canvas.width=window.innerWidth;
        h=canvas.height=window.innerHeight;
        cx=w/2;
        cy=h/2;
    }
    window.addEventListener('resize',resize);
    resize();
    function Star(){
        this.x=Math.random()*w;
        this.y=Math.random()*h;
        this.z=Math.random()*2+0.2;
        this.radius=Math.random()*2.5+0.3;
        this.alpha=Math.random();
        this.alphaSpeed=(Math.random()*0.04)+0.01;
        this.vx=(Math.random()-0.5)*2;
        this.vy=(Math.random()-0.5)*2;
        var r=Math.random();
        if(r<0.6)this.color='#ffffff';
        else if(r<0.8)this.color='#ffcc00';
        else if(r<0.9)this.color='#00ffff';
        else this.color='#ff00aa';
    }
    Star.prototype.update=function(){
        this.x+=this.vx*this.z;
        this.y+=this.vy*this.z;
        if(this.x<-20)this.x=w+20;
        if(this.x>w+20)this.x=-20;
        if(this.y<-20)this.y=h+20;
        if(this.y>h+20)this.y=-20;
        this.alpha+=this.alphaSpeed;
        if(this.alpha>1||this.alpha<0.1){
            this.alphaSpeed=-this.alphaSpeed;
            this.alpha=Math.max(0.1,Math.min(1,this.alpha));
        }
    };
    Star.prototype.draw=function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius*this.z,0,Math.PI*2);
        ctx.fillStyle=this.color;
        ctx.globalAlpha=Math.abs(this.alpha);
        ctx.shadowBlur=this.radius*6;
        ctx.shadowColor=this.color;
        ctx.fill();
        ctx.shadowBlur=0;
        ctx.globalAlpha=1;
    };
    function NebulaParticle(){
        this.radius=Math.random()*300+50;
        this.angle=Math.random()*Math.PI*2;
        this.speed=(Math.random()*0.002)+0.0005;
        this.size=Math.random()*3+0.5;
        this.alpha=Math.random()*0.5+0.1;
        this.offset=Math.random()*Math.PI*2;
        this.color=Math.random()>0.5?'#ff00aa':'#00ffff';
    }
    NebulaParticle.prototype.update=function(){
        this.angle+=this.speed+nebulaRotationSpeed;
    };
    NebulaParticle.prototype.draw=function(){
        var wobble=Math.sin(this.angle*3+this.offset)*20;
        var x=cx+Math.cos(this.angle)*(this.radius+wobble);
        var y=cy+Math.sin(this.angle)*(this.radius+wobble);
        ctx.beginPath();
        ctx.arc(x,y,this.size,0,Math.PI*2);
        ctx.fillStyle=this.color;
        ctx.globalAlpha=this.alpha;
        ctx.shadowBlur=this.size*15;
        ctx.shadowColor=this.color;
        ctx.fill();
        ctx.shadowBlur=0;
        ctx.globalAlpha=1;
    };
    function SmallStar(){
        var angle=Math.random()*Math.PI*2;
        var radius=Math.random()*Math.min(w,h)*0.3+Math.min(w,h)*0.1;
        this.x=cx+Math.cos(angle)*radius;
        this.y=cy+Math.sin(angle)*radius;
        this.angle=angle;
        this.radius=radius;
        this.speed=Math.random()*0.02+0.01;
        this.size=Math.random()*4+1;
        this.alpha=1;
        this.life=0;
        this.maxLife=Math.random()*3+2;
        this.color=Math.random()>0.5?'#ff00aa':'#00ffff';
        this.outwardSpeed=Math.random()*4+2;
    }
    SmallStar.prototype.update=function(){
        this.life+=1/60;
        this.angle+=this.speed;
        this.radius+=this.outwardSpeed;
        this.x=cx+Math.cos(this.angle)*this.radius;
        this.y=cy+Math.sin(this.angle)*this.radius;
        this.alpha=Math.max(0,1-this.life/this.maxLife);
        this.size*=0.99;
    };
    SmallStar.prototype.draw=function(){
        if(this.alpha<=0||this.size<=0.1)return;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle=this.color;
        ctx.globalAlpha=this.alpha;
        ctx.shadowBlur=this.size*8;
        ctx.shadowColor=this.color;
        ctx.fill();
        ctx.shadowBlur=0;
        ctx.globalAlpha=1;
    };
    for(var i=0;i<NUM_STARS;i++){
        stars.push(new Star());
    }
    for(var i=0;i<NUM_NEBULA;i++){
        nebulaParticles.push(new NebulaParticle());
    }
    var mouseX=0;
    var mouseY=0;
    var targetRotateX=0;
    var targetRotateY=0;
    var currentRotateX=0;
    var currentRotateY=0;
    document.addEventListener('mousemove',function(e){
        mouseX=e.clientX;
        mouseY=e.clientY;
        targetRotateY=(mouseX/w-0.5)*0.5;
        targetRotateX=-(mouseY/h-0.5)*0.5;
    });
    function animate(){
        ctx.clearRect(0,0,w,h);
        currentRotateX+=(targetRotateX-currentRotateX)*0.05;
        currentRotateY+=(targetRotateY-currentRotateY)*0.05;
        globalTimer+=1/60;
        if(globalTimer>=CYCLE_DURATION){
            globalTimer=0;
        }
        var isBursting=false;
        if(globalTimer>=4&&globalTimer<8){
            isBursting=true;
            nebulaRotationSpeed=0.03;
        }else if(globalTimer>=8&&globalTimer<12){
            nebulaRotationSpeed=Math.max(0,nebulaRotationSpeed-0.001);
        }else{
            nebulaRotationSpeed=0;
        }
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(currentRotateY);
        ctx.scale(1+currentRotateX*0.1,1+currentRotateX*0.1);
        ctx.translate(-cx,-cy);
        for(var i=0;i<stars.length;i++){
            stars[i].update();
            stars[i].draw();
        }
        rotation+=nebulaRotationSpeed;
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(rotation);
        ctx.translate(-cx,-cy);
        for(var i=0;i<nebulaParticles.length;i++){
            nebulaParticles[i].update();
            nebulaParticles[i].draw();
        }
        ctx.restore();
        if(isBursting){
            for(var j=0;j<5;j++){
                var angle=Math.random()*Math.PI*2;
                var r=Math.random()*Math.min(w,h)*0.2+10;
                smallStars.push(new SmallStar());
            }
        }
        for(var i=smallStars.length-1;i>=0;i--){
            smallStars[i].update();
            smallStars[i].draw();
            if(smallStars[i].alpha<=0||smallStars[i].radius>Math.max(w,h)){
                smallStars.splice(i,1);
            }
        }
        ctx.restore();
        requestAnimationFrame(animate);
    }
    animate();
})();