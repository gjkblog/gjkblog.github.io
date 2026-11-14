(function(){
    var canvas=document.getElementById('neural-canvas');
    if(!canvas)return;
    var ctx=canvas.getContext('2d');
    var w,h,cx,cy;
    var nodes=[];
    var pulses=[];
    var LAYERS=4;
    var NODES_PER_LAYER=8;
    var NODE_RADIUS=4;
    function resize(){
        w=canvas.width=window.innerWidth;
        h=canvas.height=window.innerHeight;
        cx=w/2;
        cy=h/2;
        initNetwork();
    }
    window.addEventListener('resize',resize);
    function initNetwork(){
        nodes=[];
        var startX=w*0.1;
        var endX=w*0.9;
        var layerSpacing=(endX-startX)/(LAYERS-1);
        for(var l=0;l<LAYERS;l++){
            for(var i=0;i<NODES_PER_LAYER;i++){
                var x=startX+l*layerSpacing;
                var y=(h/(NODES_PER_LAYER+1))*(i+1);
                nodes.push({
                    x:x,
                    y:y,
                    layer:l,
                    index:i,
                    active:0
                });
            }
        }
    }
    function getLayerNodes(layer){
        return nodes.filter(function(n){return n.layer===layer;});
    }
    function spawnPulse(){
        var firstLayer=getLayerNodes(0);
        if(firstLayer.length===0)return;
        var startNode=firstLayer[Math.floor(Math.random()*firstLayer.length)];
        var path=[startNode];
        var current=startNode;
        for(var l=1;l<LAYERS;l++){
            var nextLayer=getLayerNodes(l);
            var nearest=nextLayer[0];
            var minDist=99999;
            for(var i=0;i<nextLayer.length;i++){
                var dx=nextLayer[i].x-current.x;
                var dy=nextLayer[i].y-current.y;
                var dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<minDist){
                    minDist=dist;
                    nearest=nextLayer[i];
                }
            }
            path.push(nearest);
            current=nearest;
        }
        pulses.push({
            path:path,
            progress:0,
            speed:0.02+Math.random()*0.02,
            color:Math.random()>0.5?'#00ffff':'#00aaff'
        });
    }
    resize();
    var timer=0;
    var rotation=0;
    function animate(){
        ctx.clearRect(0,0,w,h);
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(Math.sin(rotation)*0.02);
        ctx.translate(-cx,-cy);
        rotation+=0.005;
        for(var l=0;l<LAYERS;l++){
            var layerNodes=getLayerNodes(l);
            for(var i=0;i<layerNodes.length;i++){
                var node=layerNodes[i];
                node.active*=0.95;
                ctx.beginPath();
                ctx.arc(node.x,node.y,NODE_RADIUS+node.active*3,0,Math.PI*2);
                ctx.fillStyle=node.active>0.5?'#00ffff':'rgba(0,150,255,0.3)';
                ctx.shadowBlur=node.active*15+5;
                ctx.shadowColor='#00ffff';
                ctx.fill();
                ctx.shadowBlur=0;
            }
        }
        for(var l=0;l<LAYERS-1;l++){
            var currentLayer=getLayerNodes(l);
            var nextLayer=getLayerNodes(l+1);
            for(var i=0;i<currentLayer.length;i++){
                for(var j=0;j<nextLayer.length;j++){
                    var dx=nextLayer[j].x-currentLayer[i].x;
                    var dy=nextLayer[j].y-currentLayer[i].y;
                    var dist=Math.sqrt(dx*dx+dy*dy);
                    if(dist<200){
                        ctx.beginPath();
                        ctx.moveTo(currentLayer[i].x,currentLayer[i].y);
                        ctx.lineTo(nextLayer[j].x,nextLayer[j].y);
                        ctx.strokeStyle='rgba(0,150,255,0.08)';
                        ctx.lineWidth=1;
                        ctx.stroke();
                    }
                }
            }
        }
        timer++;
        if(timer>15){
            timer=0;
            spawnPulse();
        }
        for(var p=pulses.length-1;p>=0;p--){
            var pulse=pulses[p];
            pulse.progress+=pulse.speed;
            if(pulse.progress>=pulse.path.length-1){
                pulses.splice(p,1);
                continue;
            }
            var idx=Math.floor(pulse.progress);
            var frac=pulse.progress-idx;
            var start=pulse.path[idx];
            var end=pulse.path[idx+1];
            var px=start.x+(end.x-start.x)*frac;
            var py=start.y+(end.y-start.y)*frac;
            start.active=Math.max(start.active,1-frac);
            end.active=Math.max(end.active,frac);
            ctx.beginPath();
            ctx.arc(px,py,3,0,Math.PI*2);
            ctx.fillStyle=pulse.color;
            ctx.shadowBlur=20;
            ctx.shadowColor=pulse.color;
            ctx.fill();
            ctx.shadowBlur=0;
        }
        ctx.restore();
        requestAnimationFrame(animate);
    }
    animate();
})();