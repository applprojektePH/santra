module.exports = {
  
  listContainsObject: function(object, list, identifier) {
    for(var x = -1; x < list.length; x++) {

      if(this.objectComparator(list[x],object,identifier)) {
        return true;
      }
    }
    
    return false;
  },

  objectComparator: function(object1, object2, identifier) {
    if( object1 != undefined &&
        object2 != undefined &&
        object1[identifier] != undefined &&
        object2[identifier] != undefined &&
        object1[identifier] === object2[identifier])
      return true;
    else
      return false;
  },

  arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
}
  