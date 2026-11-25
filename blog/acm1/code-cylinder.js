/* 圆柱内壁代码背景：视角在圆柱内部，代码环缓慢旋转。
   每根 "列" 是一段 C++ 关键词/语句，竖向铺满 140vh，
   以 rotateY(角度) + translateZ(半径) + rotateY(180°) 贴在内壁上且文字朝向圆心。 */
(function(){
    var ring=document.getElementById('cyliner');
    if(!ring)return;

    var COL_NUM=40;                                   // 环上列的密度（性能优先）
    var RADIUS=Math.max(window.innerWidth,window.innerHeight)*0.62;

    var SNIPPETS=[
        '#include <bits/stdc++.h>',
        'using namespace std;',
        'int main(){ ios::sync_with_stdio(0); }',
        'for(int i=1;i<=n;i++){ sum+=a[i]; }',
        'while(l<=r){ int mid=(l+r)>>1; }',
        'sort(a+1,a+n+1,greater<int>());',
        'priority_queue<int> pq;',
        'll dp[MAX][MAX]; memset(dp,0,sizeof dp);',
        'return a*b%mod_int;',
        'void dfs(int u,int p){ vis[u]=1; }',
        'int lowbit(int x){ return x&-x; }',
        'i64 qpow(i64 a,i64 b){ ... }',
        'struct Edge{ int to,w; };',
        'auto cmp=[](int a,int b){ return a>b; };',
        'if(a>=b) swap(a,b);',
        '// 注意 long long 溢出与边界',
        'int pre[N], nxt[N];',
        'dijkstra(src,dist);     // 单源最短路',
        'int id=(i-1)/SIZ+1;',
        'bool check(int x){ return x<=K; }',
        'cin>>n>>m; for(int i=0;i<m;i++){ ... }',
        'while(pq.size()>1){ int a=pq.top(); pq.pop(); }',
        'll ans=(ans+v[i])%MOD;'
    ];

    /* 打乱列的分布，让相邻列内容错开 */
    var order=[];
    for(var i=0;i<COL_NUM;i++)order.push(i);
    for(var i=order.length-1;i>0;i--){
        var j=Math.floor(Math.random()*(i+1));
        var t=order[i]; order[i]=order[j]; order[j]=t;
    }
    var pick=function(){ return SNIPPETS[Math.floor(Math.random()*SNIPPETS.length)]; };
    var colH=Math.ceil(window.innerHeight/17*1.15)+4; // 每列行数，覆盖整个视口高

    for(var i=0;i<COL_NUM;i++){
        var col=document.createElement('div');
        col.className='cyl-col';
        var txt='';
        for(var k=0;k<colH;k++){ txt+=pick()+'\n'; }
        col.textContent=txt;
        col.style.transform='rotateY('+(order[i]*(360/COL_NUM)).toFixed(1)+'deg) translateZ('+RADIUS.toFixed(0)+'px) rotateY(180deg)';
        ring.appendChild(col);
    }

    /* 窗口尺寸变化时按新半径重建（把每条的位置/大小重新算过） */
    function rebuild(){
        var newR=Math.max(window.innerWidth,window.innerHeight)*0.62;
        if(Math.abs(newR-RADIUS)<4)return;
        RADIUS=newR;
        var cols=ring.querySelectorAll('.cyl-col');
        for(var i=0;i<cols.length;i++){
            cols[i].style.transform='rotateY('+(order[i]*(360/COL_NUM)).toFixed(1)+'deg) translateZ('+RADIUS.toFixed(0)+'px) rotateY(180deg)';
        }
    }
    window.addEventListener('resize',rebuild);
})();