function processSms(event)
{
  let haystack = event.Body;
  console.log(haystack)
  if(!haystack) throw new Error('No SMS Body');
  
  haystack = haystack.toLowerCase()
  
  let needles = ["apple", "cherry"];
  
  const hasNeedle = needles.some((needle) => {
    return haystack.indexOf(needle) !== -1;
  });
  
  return hasNeedle;
}

exports.handler = function(context, event, callback) {
  let response = false;
  
  try{
    response = processSms(event)
  }catch(error){
    console.log(error.message)
  }
  
  return callback(null, {response});
};