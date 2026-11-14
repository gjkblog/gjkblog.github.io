document.addEventListener('mousemove',function(e){
    if(Math.random()>0.65)return;
    var star=document.createElement('div');
    star.className='star-particle';
    star.style.left=e.clientX+'px';
    star.style.top=e.clientY+'px';
    var colors=['#ff00aa','#00ffff','#ffcc00'];
    var color=colors[Math.floor(Math.random()*colors.length)];
    star.style.background=color;
    star.style.boxShadow='0 0 10px '+color;
    var size=Math.random()*8+8;
    star.style.width=size+'px';
    star.style.height=size+'px';
    document.body.appendChild(star);
    setTimeout(function(){star.remove();},600);
});
document.addEventListener('click',function(e){
    for(var i=0;i<12;i++){
        var star=document.createElement('div');
        star.className='star-particle';
        star.style.left=e.clientX+'px';
        star.style.top=e.clientY+'px';
        var colors=['#ff00aa','#00ffff','#ffffff'];
        var color=colors[Math.floor(Math.random()*colors.length)];
        star.style.background=color;
        star.style.boxShadow='0 0 10px '+color;
        var size=Math.random()*10+5;
        star.style.width=size+'px';
        star.style.height=size+'px';
        star.style.animation='star-burst 0.6s ease-out forwards';
        star.style.setProperty('--x',(Math.random()-0.5)*200);
        star.style.setProperty('--y',(Math.random()-0.5)*200);
        document.body.appendChild(star);
        setTimeout(function(){star.remove();},600);
    }
});