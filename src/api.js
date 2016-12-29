module.exports = XStreamAPI;


  /**
   * API Methods for encapsulating/reading XStream request/response packets
   *
   */

function XStreamAPI() {
  if ( !(this instanceof XStreamAPI) )
    return new XStreamAPI();

}


  /**
   * @private
   */



XStreamAPI.prototype.makeSenML = function(meta,data){
  var senML = [];

  var obj={};
  Object.keys(meta).forEach(function(key){
    if (['bn','pos','bt'].indexOf(key) >=0){
      obj[key] = meta[key];
    }
  });
  senML.push(obj);

  data.forEach(function(akey){
    obj={};
    Object.keys(akey).forEach(function(key){
      if (['n','u','v','min','max','vd','vi'].indexOf(key)>=0){
        obj[key] = akey[key];
      }
    });
    senML.push(obj);
  });

  return senML;
}


XStreamAPI.prototype.parseSenML = function(data){
  if (typeof(data) !='object' || data.length <2)
    return 0;

  meta= data[0];
  data._tags =[];


  data.items  = function() { return this.splice(1); };
  data.hasTag = function(t) { return (this._tags.indexOf(t) >=0); };

  for(var idx=1;idx<data.length;idx++){
    if (data[idx].hasOwnProperty('n')) {
      data._tags.push(data[idx].n);
    }

    data[idx].urn = function(){
      if (meta.hasOwnProperty('bt')) {
        return meta.bt;
      }
      return null;
    };

    data[idx].pos = function(){
      if (meta.hasOwnProperty('pos') && meta.pos.length ==3){
        return {lat:meta.pos[0],
          lon:meta.pos[1],
          alt:meta.pos[3]};
      }
      return null;
    };

    data[idx].name = function(){
      if (this.hasOwnProperty('n')) {
        return this.n;
      }
      else {
        return null;
      }
    };

    data[idx].value = function(){
      if (this.hasOwnProperty('v')) {
        return this.v;
      }
      if (this.hasOwnProperty('vd')) {
        return this.vd;
      }
      return null;
    };
  }

  return data.length -1;
}

