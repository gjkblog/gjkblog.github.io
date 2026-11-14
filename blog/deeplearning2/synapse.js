(function(){
    var canvas=document.getElementById('synapse-canvas');
    if(!canvas)return;
    var ctx=canvas.getContext('2d');
    var w,h;
    var lines=[];
    var pulses=[];

    function resize(){
        w=canvas.width=window.innerWidth;
        h=canvas.height=window.innerHeight;
        lines=[];
        // 增加线条数量，扩大覆盖
        for(var i=0;i<60;i++){
            var startX=Math.random()*w;
            var startY=Math.random()*h;
            var length=Math.random()*600+300;
            var isHorizontal=Math.random()>0.5;
            var points=[];
            var segments=Math.floor(Math.random()*5)+4;
            
            // 生成带随机抖动的节点，模拟神经纤维
            for(var j=0;j<=segments;j++){
                points.push({
                    x:startX + (isHorizontal ? (j/segments)*length : (Math.random()-0.5)*150),
                    y:startY + (!isHorizontal ? (j/segments)*length : (Math.random()-0.5)*150)
                });
            }
            lines.push({
                points:points,
                color:Math.random()>0.5?'0,255,204':'255,0,170', // 青色与粉色
                alpha:Math.random()*0.2+0.1 // 基础亮度提高
            });
        }
    }
    window.addEventListener('resize',resize);
    resize();

    function spawnPulse(){
        if(lines.length===0)return;
        // 每次随机选 1-3 条线发光
        var count=Math.floor(Math.random()*3)+1;
        for(var c=0;c<count;c++){
            var line=lines[Math.floor(Math.random()*lines.length)];
            pulses.push({
                line:line,
                progress:0,
                speed:Math.random()*0.015+0.008,
                color:line.color==='0,255,204'?'#00ffcc':'#ff00aa'
            });
        }
    }
    setInterval(spawnPulse, 80); // 生成频率加快

    function animate(){
        ctx.clearRect(0,0,w,h);
        
        // 画线
        for(var i=0;i<lines.length;i++){
            var line=lines[i];
            ctx.beginPath();
            ctx.moveTo(line.points[0].x, line.points[0].y);
            for(var j=1;j<line.points.length;j++){
                var prev=line.points[j-1];
                var curr=line.points[j];
                var midX=(prev.x+curr.x)/2;
                var midY=(prev.y+curr.y)/2;
                ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
            }
            ctx.strokeStyle='rgba('+line.color+','+line.alpha+')';
            ctx.lineWidth=2; // 线加粗
            ctx.stroke();
        }

        // 画流动的脉冲
        for(var i=pulses.length-1;i>=0;i--){
            var p=pulses[i];
            p.progress+=p.speed;
            if(p.progress>=1){
                pulses.splice(i,1);
                continue;
            }

            var totalSegs=p.line.points.length-1;
            var segIndex=Math.floor(p.progress*totalSegs);
            var segProgress=(p.progress*totalSegs)-segIndex;
            
            var start=p.line.points[segIndex];
            var end=p.line.points[segIndex+1];
            
            var px=start.x+(end.x-start.x)*segProgress;
            var py=start.y+(end.y-start.y)*segProgress;

            // 发光节点
            ctx.beginPath();
            ctx.arc(px,py,3.5,0,Math.PI*2);
            ctx.fillStyle=p.color;
            ctx.shadowBlur=20;
            ctx.shadowColor=p.color;
            ctx.fill();
            ctx.shadowBlur=0;

            // 拖尾光效
            var trailLength=0.1; 
            var tailProgress=p.progress-trailLength;
            if(tailProgress>0){
                var tailSegIndex=Math.floor(tailProgress*totalSegs);
                var tailSegProgress=(tailProgress*totalSegs)-tailSegIndex;
                var tStart=p.line.points[tailSegIndex];
                var tEnd=p.line.points[tailSegIndex+1];
                var tx=tStart.x+(tEnd.x-tStart.x)*tailSegProgress;
                var ty=tStart.y+(tEnd.y-tStart.y)*tailSegProgress;
                
                ctx.beginPath();
                ctx.moveTo(tx,ty);
                ctx.lineTo(px,py);
                ctx.strokeStyle=p.color;
                ctx.lineWidth=2;
                ctx.globalAlpha=0.5;
                ctx.stroke();
                ctx.globalAlpha=1;
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
})();