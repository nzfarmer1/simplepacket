module.exports = XStreamDecode;

var through2 = require("through2");

var Parser = function(){

    this.BEG = 0x12;
    this.END = 0x13;
    this.DLE = 0x7D;
    var $this =this;
    
    this.init = function(){
        $this._inPacket = false;
        $this._dle = false;
        $this.buff = Buffer(0);
    }
    this.init();
    
    this.dec = function(chunk,enc,callback){
        var v = false;
        if ($this.buff.length > 0){
            chunk = Buffer.concat([$this.buff,chunk]);
            $this.buff = Buffer(0);
        }
        for(var i=0;i< chunk.length;i++){
           if (v){
              $this.buff = Buffer.concat([$this.buff,Buffer(chunk[i])]);  
              continue;
           }
           switch(chunk[i]){
               case($this.BEG):
                   if (!$this._inPacket && $this._dle == false){
                       $this._inPacket = true;
                       break;
                       }
                       if ($this._inPacket && $this._dle){
                           this.push(Buffer([chunk[i]]));
                           $this._dle= false;
                           break;
                       }
                       $this._dle = false;
                   break;
               case($this.END):
                   if (!$this._inPacket){
                       break;
                   }
                   if ($this._dle){
                       this.push(Buffer([chunk[i]]));
                       $this._dle = false;
                       break;
                   }
                   $this._inPacket = false;
                   $this._dle= false;
                   v = true;
                   break;
               case($this.DLE):
                   if ($this._dle){
                       if ($this._inPacket){
                           this.push(Buffer([chunk[i]]));
                       }
                       $this._dle = false;
                   } else {
                       $this._dle = true;
                   }
                   break;
               default:
                   if ($this._inPacket){
                       this.push(Buffer([chunk[i]]));
                   }
                   $this._dle= false;
                   break;
               }
           }
       if (v){
           callback();
           this.emit('flush');
           $this.init();  
        }
       else {
           callback(null);
       }
    };
}

function XStreamDecode() { return through2({end:false},(new Parser()).dec); };
